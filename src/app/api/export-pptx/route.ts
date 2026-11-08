import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { PresentationData, Slide } from "@/types/presentation";

export const maxDuration = 45;

function escapeXml(str: string = ""): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceInXml(xml: string, oldText: string, newText: string): string {
  if (!oldText || !newText || oldText === newText) return xml;
  const escapedOld = escapeXml(oldText);
  const escapedNew = escapeXml(newText);
  if (xml.includes(escapedOld)) {
    return xml.replace(new RegExp(escapeRegExp(escapedOld), "g"), escapedNew);
  }
  // Handle text split after prefixes like "Research context: "
  const strippedOld = oldText.replace(/^[A-Za-z\s]+:\s*/, "").trim();
  const escapedStripped = escapeXml(strippedOld);
  if (strippedOld && strippedOld !== oldText && xml.includes(escapedStripped)) {
    return xml.replace(new RegExp(escapeRegExp(escapedStripped), "g"), escapedNew);
  }
  if (xml.includes(oldText)) {
    return xml.replace(new RegExp(escapeRegExp(oldText), "g"), escapedNew);
  }
  return xml;
}

export async function POST(req: Request) {
  try {
    const { presentation }: { presentation: PresentationData } = await req.json();

    if (!presentation || !Array.isArray(presentation.slides)) {
      return NextResponse.json({ error: "Données de présentation invalides." }, { status: 400 });
    }

    // 1. Lire le template master original
    const templatePath = path.join(process.cwd(), "public", "template", "master_template.pptx");
    if (!fs.existsSync(templatePath)) {
      throw new Error("Template master introuvable sur le serveur.");
    }

    // Lire également les slides riches de base pour comparaison
    let baselineSlides: Slide[] = [];
    const richPath = path.join(process.cwd(), "public", "template", "rich_22_slides.json");
    if (fs.existsSync(richPath)) {
      try {
        baselineSlides = JSON.parse(fs.readFileSync(richPath, "utf8"));
      } catch {
        baselineSlides = [];
      }
    }

    const templateBuf = fs.readFileSync(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);

    // 2. Mettre à jour chaque slide et ses notes d'orateur (jusqu'à 22 slides)
    const maxSlides = Math.min(22, presentation.slides.length);
    for (let i = 1; i <= maxSlides; i++) {
      const slide = presentation.slides[i - 1];
      const baseline = baselineSlides[i - 1];
      if (!slide) continue;

      const slideXmlPath = `ppt/slides/slide${i}.xml`;
      const notesXmlPath = `ppt/notesSlides/notesSlide${i}.xml`;

      // A. Mettre à jour les notes d'orateur dans notesSlide{i}.xml
      const notesFile = zip.file(notesXmlPath);
      if (notesFile && slide.speakerNotes) {
        let notesXml = await notesFile.async("string");
        const cleanNotes = escapeXml(slide.speakerNotes);

        if (/<a:t>[\s\S]*?<\/a:t>/.test(notesXml)) {
          notesXml = notesXml.replace(
            /(<p:ph type="body" idx="1"\/>[\s\S]*?<a:t>)([\s\S]*?)(<\/a:t>)/,
            `$1${cleanNotes}$3`
          );
          zip.file(notesXmlPath, notesXml);
        }
      }

      // B. Mettre à jour le texte dans slide{i}.xml
      const slideFile = zip.file(slideXmlPath);
      if (slideFile) {
        let slideXml = await slideFile.async("string");

        // Remplacement du titre si modifié
        if (slide.title && baseline?.title && slide.title !== baseline.title) {
          slideXml = replaceInXml(slideXml, baseline.title, slide.title);
        }

        // Remplacement du sous-titre si modifié
        if (slide.subtitle && baseline?.subtitle && slide.subtitle !== baseline.subtitle) {
          slideXml = replaceInXml(slideXml, baseline.subtitle, slide.subtitle);
        }

        // Remplacement du callout si modifié
        if (slide.bottomCallout && baseline?.bottomCallout && slide.bottomCallout !== baseline.bottomCallout) {
          slideXml = replaceInXml(slideXml, baseline.bottomCallout, slide.bottomCallout);
        }

        // Remplacement des cartes
        if (slide.cards && baseline?.cards) {
          slide.cards.forEach((card, cIdx) => {
            const baseCard = baseline.cards?.[cIdx];
            if (baseCard) {
              if (card.title && baseCard.title && card.title !== baseCard.title) {
                slideXml = replaceInXml(slideXml, baseCard.title, card.title);
              }
              if (card.description && baseCard.description && card.description !== baseCard.description) {
                slideXml = replaceInXml(slideXml, baseCard.description, card.description);
              }
              if (card.items && baseCard.items) {
                card.items.forEach((item, itIdx) => {
                  const baseItem = baseCard.items?.[itIdx];
                  if (baseItem && item !== baseItem) {
                    slideXml = replaceInXml(slideXml, baseItem, item);
                  }
                });
              }
            }
          });
        }

        // Remplacement des bullet points
        if (slide.bulletPoints && baseline?.bulletPoints) {
          slide.bulletPoints.forEach((bp, bIdx) => {
            const baseBp = baseline.bulletPoints?.[bIdx];
            if (baseBp && bp !== baseBp) {
              slideXml = replaceInXml(slideXml, baseBp, bp);
            }
          });
        }

        // Remplacement des métriques
        if (slide.metrics && baseline?.metrics) {
          slide.metrics.forEach((m, mIdx) => {
            const baseM = baseline.metrics?.[mIdx];
            if (baseM) {
              if (m.value && baseM.value && m.value !== baseM.value) {
                slideXml = replaceInXml(slideXml, baseM.value, m.value);
              }
              if (m.label && baseM.label && m.label !== baseM.label) {
                slideXml = replaceInXml(slideXml, baseM.label, m.label);
              }
            }
          });
        }

        // Slide 1 métadonnées spécifiques (Université, Entreprise, Candidats, Encadrants)
        if (i === 1) {
          const findBp = (regex: RegExp) =>
            slide.bulletPoints?.find((bp) => regex.test(bp));

          // 1. Université & Entreprise
          const instLine = slide.bulletPoints?.find(
            (bp) =>
              /university|universit|tofail|ibn tofail/i.test(bp) ||
              (/kromberg|schubert/i.test(bp) && !/van program|mercedes/i.test(bp))
          );
          let targetUniv = "";
          let targetComp = "";

          if (instLine) {
            const parts = instLine.split(/[·–|]|\s+-\s+|\n/).map((p) => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
              targetUniv = parts[0];
              targetComp = parts[1];
            } else {
              if (/kromberg|schubert|k3/i.test(instLine) && !/univers/i.test(instLine)) {
                targetComp = instLine;
              } else {
                targetUniv = instLine;
              }
            }
          } else if (presentation.institution) {
            const parts = presentation.institution.split(/[·–|]|\s+-\s+|\n/).map((p) => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
              targetUniv = parts[0];
              targetComp = parts[1];
            } else {
              targetUniv = presentation.institution;
            }
          }

          if (targetUniv && targetUniv !== "Ibn Tofail University") {
            slideXml = replaceInXml(slideXml, "Ibn Tofail University", targetUniv);
          }
          if (targetComp && targetComp !== "Kromberg & Schubert") {
            slideXml = replaceInXml(slideXml, "Kromberg & Schubert", targetComp);
          }

          // 2. Candidats
          const presLine = findBp(/presented by|wijdane|salma/i);
          const targetCand = presLine
            ? presLine.replace(/^presented by:?\s*/i, "").trim()
            : presentation.candidates;
          if (targetCand && targetCand !== "Wijdane Laaguidi · Salma Lsilis") {
            slideXml = replaceInXml(slideXml, "Wijdane Laaguidi · Salma Lsilis", targetCand);
          }

          // 3. Encadrants
          const supLine = findBp(/supervised by|mamad|benrkiya/i);
          if (supLine) {
            const acad = supLine.match(/prof[^·()]+(?:\([^()]+\))?/i)?.[0]?.trim();
            const intern = supLine.match(/younes[^·()]+(?:\([^()]+\))?/i)?.[0]?.trim();
            if (acad && acad !== "Prof. Mohamed Mamad (academic)") {
              slideXml = replaceInXml(slideXml, "Prof. Mohamed Mamad (academic)", acad);
            }
            if (intern && intern !== "Younes Benrkiya (internship)") {
              slideXml = replaceInXml(slideXml, "Younes Benrkiya (internship)", intern);
            }
          }
        }
        zip.file(slideXmlPath, slideXml);
      }
    }

    // 3. Sécuriser les métadonnées globales (docProps/app.xml & docProps/core.xml)
    const appFile = zip.file("docProps/app.xml");
    if (appFile) {
      let appXml = await appFile.async("string");
      appXml = appXml
        .replace(/Kromberg & Schubert/g, "Kromberg &amp; Schubert")
        .replace(/Wijdane & Salma/g, "Wijdane &amp; Salma");
      zip.file("docProps/app.xml", appXml);
    }

    const coreFile = zip.file("docProps/core.xml");
    if (coreFile) {
      let coreXml = await coreFile.async("string");
      coreXml = coreXml
        .replace(/Kromberg & Schubert/g, "Kromberg &amp; Schubert")
        .replace(/Wijdane & Salma/g, "Wijdane &amp; Salma");
      zip.file("docProps/core.xml", coreXml);
    }

    // 4. Générer le buffer binaire PPTX final
    const finalBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new Response(finalBuffer as any, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition":
          'attachment; filename="Wijdane_Laaguidi_Salma_Lsilis_Soutenance_2026.pptx"',
        "Content-Length": finalBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Erreur export PPTX serveur:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du fichier PowerPoint." },
      { status: 500 }
    );
  }
}
