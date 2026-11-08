import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { PresentationData, Slide } from "@/types/presentation";

export const maxDuration = 45;

function escapeXml(str: string = ""): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

    const templateBuf = fs.readFileSync(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);

    // 2. Mettre à jour chaque slide et ses notes d'orateur
    for (let i = 1; i <= 22; i++) {
      const slide = presentation.slides[i - 1];
      if (!slide) continue;

      const slideXmlPath = `ppt/slides/slide${i}.xml`;
      const notesXmlPath = `ppt/notesSlides/notesSlide${i}.xml`;

      // A. Mettre à jour les notes d'orateur dans notesSlide{i}.xml
      const notesFile = zip.file(notesXmlPath);
      if (notesFile) {
        let notesXml = await notesFile.async("string");
        const cleanNotes = escapeXml(slide.speakerNotes || "");
        
        // Remplacement propre du corps de texte de la note
        if (/<a:t>[\s\S]*?<\/a:t>/.test(notesXml)) {
          // Remplace le premier texte (qui est la note orateur, pas le numéro de page)
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
        if (slide.title) {
          const escapedTitle = escapeXml(slide.title);
          // Si le titre de la slide a été édité via le chatbot, le substituer
          if (slide.title !== DEFAULT_TITLES[i]) {
            slideXml = slideXml.replace(
              new RegExp(escapeRegExp(DEFAULT_TITLES[i] || ""), "g"),
              escapedTitle
            );
          }
        }

        // Remplacement du message clé / callout si modifié
        if (slide.bottomCallout) {
          const escapedCallout = escapeXml(slide.bottomCallout);
          if (DEFAULT_CALLOUTS[i] && slide.bottomCallout !== DEFAULT_CALLOUTS[i]) {
            slideXml = slideXml.replace(
              new RegExp(escapeRegExp(DEFAULT_CALLOUTS[i]), "g"),
              escapedCallout
            );
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

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const DEFAULT_TITLES: Record<number, string> = {
  1: "Integrated Supply-Chain Coordination Framework",
  2: "We entered the supply chain from the inside: Procurement and Planning, side by side",
  3: "From pre-series to mass production: the window to fix coordination before volumes rise",
  4: "EDI transmits the customer’s changes — but who acts on them?",
  5: "The first warning signs: the same demand change, felt differently across functions",
  6: "The gap: information arrives, but coordinated action does not follow automatically",
  7: "Problem statement and research questions",
  8: "From observation to a structured research project",
  9: "Constructivism, mixed methods and an action-research logic",
  10: "Two evidence streams: ten voices and the company’s own records",
  11: "What the professionals revealed: five recurring themes",
  12: "Measuring the problem: demand moves almost every week",
  13: "What the combined evidence confirmed",
  14: "Why the gap matters: increases and decreases hurt differently",
  15: "Three lenses on the same problem",
  16: "From theory to the K&S case",
  17: "Why we built the ISCC Model",
  18: "The ISCC Model: from EDI information to coordinated decisions",
  19: "How the ISCC Model can prepare the move to mass production",
  20: "Recommendations and implementation priorities",
  21: "Limitations and conclusion",
  22: "Thank you for your attention",
};

const DEFAULT_CALLOUTS: Record<number, string> = {
  2: "pre-series production at K3, with the transition to mass production expected about two weeks after the study window — a real industrial situation, not an abstract assumption.",
  3: "Pre-series is the opportunity to identify and correct coordination weaknesses before volumes increase",
  4: "EDI transmits customer information — but receiving it does not automatically guarantee coordinated operational action",
  5: "We saw it first; Act II tests whether it was systematic",
  6: "A coordination gap, not a knowledge gap: the steps are known, but no owner, timeline or shared procedure exists",
  7: "Risk: shortages, backlog, excess stock and obsolescence, sharpest in the move to mass production.",
  8: "Academic: a context-specific coordination framework for pre-series to mass production.  Practical: a structured model for cross-functional decisions at K&S",
  9: "comparing sources to strengthen credibility",
  10: "Qualitative + quantitative evidence  →  TRIANGULATION  →  a fuller understanding of the coordination problem",
  11: "“improvised each time” (Procurement)",
  12: "CW35 (9,723.3%) is a calculation artifact (86 LAB vs 8,362 VSAT units) and is excluded.",
  13: "Type 2/3 orders delay information",
  14: "The response is cross-functional: Planning · Procurement · Industrial Engineering · Material Flow · Quality",
  15: "Context: ramp-up and pre-series logistics require coordinated capacity, materials and information flows before series production",
  16: "Theory interprets the real problem; it does not replace the evidence",
  17: "ISCC",
  18: "Builds on existing mechanisms; not yet implemented or validated.",
  19: "Readiness for series volumes",
  20: "Priority = relevance to the findings and feasibility: formalize existing mechanisms first",
  21: "Coordination must be structured before mass production",
  22: "Questions and discussion",
};
