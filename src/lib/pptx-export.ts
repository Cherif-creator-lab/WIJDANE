import pptxgen from "pptxgenjs";
import { PresentationData, Slide } from "@/types/presentation";

const THEME_PALETTES = {
  "luxury-gold": {
    primary: "0F172A",
    secondary: "D97706",
    accent: "FEF3C7",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "CBD5E1",
    darkBg: "0B0F19",
    textDark: "0F172A",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
  "mercedes-midnight": {
    primary: "0B192C",
    secondary: "0284C7",
    accent: "E0F2FE",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "CBD5E1",
    darkBg: "07101E",
    textDark: "0F172A",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
  "architect-obsidian": {
    primary: "18181B",
    secondary: "4F46E5",
    accent: "E0E7FF",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "D4D4D8",
    darkBg: "09090B",
    textDark: "18181B",
    textLight: "FFFFFF",
    textMuted: "71717A",
  },
  "emerald-executive": {
    primary: "064E3B",
    secondary: "059669",
    accent: "D1FAE5",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "CBD5E1",
    darkBg: "022C22",
    textDark: "064E3B",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
};

function cleanText(val?: string): string {
  if (!val) return "";
  return String(val)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim();
}

// pptxgenjs n'échappe pas '&', '<', '>' dans docProps/app.xml et docProps/core.xml !
function cleanXmlMeta(val?: string): string {
  return cleanText(val)
    .replace(/&/g, "and")
    .replace(/[<>"]/g, "")
    .replace(/[^\x20-\x7E]/g, "-");
}

export async function exportToPptx(data: PresentationData) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625 inches
  pres.author = cleanXmlMeta(data.candidates) || "Wijdane Laaguidi - Salma Lsilis";
  pres.company = cleanXmlMeta(data.institution) || "Ibn Tofail University - Kromberg and Schubert";
  pres.title = cleanXmlMeta(data.topic) || "Master Thesis Defense 2026";
  pres.subject = "Master Thesis Defense 2026";

  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["luxury-gold"];

  data.slides.forEach((s: Slide, index: number) => {
    const slide = pres.addSlide();

    // Notes d'orateur propres
    const notesText = cleanText(
      `[Speaker: ${s.speaker || "Wijdane & Salma"}]\n${s.speakerNotes || ""}`
    );
    if (notesText) {
      slide.addNotes(notesText);
    }

    // =========================================================================
    // 1. SLIDE DE TITRE (COVER)
    // =========================================================================
    if (s.layout === "title") {
      slide.background = { color: palette.darkBg };

      // Bandeau supérieur décoratif
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: 10.0,
        h: 0.12,
        fill: { color: palette.secondary },
      });

      slide.addText(cleanText(s.act || "MASTER'S THESIS DEFENSE · 2026"), {
        x: 0.7,
        y: 0.6,
        w: 8.6,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: palette.secondary,
        fontFace: "Arial",
      });

      slide.addText(cleanText(s.title || data.topic), {
        x: 0.7,
        y: 1.1,
        w: 8.6,
        h: 1.35,
        fontSize: 26,
        bold: true,
        color: palette.textLight,
        fontFace: "Arial",
        valign: "top",
      });

      if (s.subtitle) {
        slide.addText(cleanText(s.subtitle), {
          x: 0.7,
          y: 2.5,
          w: 8.6,
          h: 0.7,
          fontSize: 13,
          color: "CBD5E1",
          fontFace: "Arial",
          valign: "top",
        });
      }

      // 3 Cartes métadonnées en bas de la slide de garde
      const metaBoxes = [
        {
          label: "PRESENTED BY",
          value: cleanText(data.candidates || "Wijdane Laaguidi · Salma Lsilis"),
          sub: "Procurement & Production Planning",
        },
        {
          label: "SUPERVISED BY",
          value: "Prof. Mohamed Mamad (Academic)",
          sub: "Younes Benrkiya (Internship)",
        },
        {
          label: "INSTITUTIONS & PROGRAM",
          value: "Ibn Tofail University · K&S (Plant K3)",
          sub: cleanText(data.program || "Mercedes-Benz VAN Program"),
        },
      ];

      metaBoxes.forEach((box, bIdx) => {
        const xPos = 0.7 + bIdx * 2.95;
        slide.addShape("rect", {
          x: xPos,
          y: 3.65,
          w: 2.75,
          h: 1.35,
          fill: { color: "162032" },
          line: { color: palette.secondary, pt: 0.75 },
        });
        slide.addText(box.label, {
          x: xPos + 0.15,
          y: 3.78,
          w: 2.45,
          h: 0.25,
          fontSize: 8.5,
          bold: true,
          color: palette.secondary,
          fontFace: "Arial",
        });
        slide.addText(box.value, {
          x: xPos + 0.15,
          y: 4.08,
          w: 2.45,
          h: 0.42,
          fontSize: 10.5,
          bold: true,
          color: "FFFFFF",
          fontFace: "Arial",
        });
        slide.addText(box.sub, {
          x: xPos + 0.15,
          y: 4.52,
          w: 2.45,
          h: 0.38,
          fontSize: 9,
          color: "94A3B8",
          fontFace: "Arial",
        });
      });

      return;
    }

    // =========================================================================
    // SLIDES DE CONTENU (SLIDES 2 à 21)
    // =========================================================================
    slide.background = { color: palette.bg };

    // Barre supérieure fine
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: 10.0,
      h: 0.08,
      fill: { color: palette.primary },
    });

    // Acte (en haut à gauche)
    if (s.act) {
      slide.addText(cleanText(s.act), {
        x: 0.5,
        y: 0.22,
        w: 6.5,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: palette.secondary,
        fontFace: "Arial",
      });
    }

    // Oratrice (en haut à droite)
    if (s.speaker) {
      slide.addText(cleanText(s.speaker), {
        x: 7.0,
        y: 0.22,
        w: 2.5,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: palette.textMuted,
        align: "right",
        fontFace: "Arial",
      });
    }

    // Titre de la slide
    slide.addText(cleanText(s.title || `Slide ${index + 1}`), {
      x: 0.5,
      y: 0.48,
      w: 9.0,
      h: 0.55,
      fontSize: 17,
      bold: true,
      color: palette.primary,
      fontFace: "Arial",
      valign: "top",
    });

    // Sous-titre
    if (s.subtitle) {
      slide.addText(cleanText(s.subtitle), {
        x: 0.5,
        y: 1.02,
        w: 9.0,
        h: 0.3,
        fontSize: 10,
        italic: true,
        color: palette.textMuted,
        fontFace: "Arial",
      });
    }

    const contentStartY = s.subtitle ? 1.42 : 1.2;
    const contentHeight = s.bottomCallout ? 3.2 : 3.65;

    // -------------------------------------------------------------------------
    // A. METRICS LAYOUT
    // -------------------------------------------------------------------------
    if (s.layout === "metrics" && s.metrics && s.metrics.length > 0) {
      const count = s.metrics.length;
      const cardW = (9.0 - (count - 1) * 0.2) / count;
      s.metrics.forEach((m, i) => {
        const xPos = 0.5 + i * (cardW + 0.2);
        slide.addShape("rect", {
          x: xPos,
          y: contentStartY + 0.15,
          w: cardW,
          h: 2.5,
          fill: { color: palette.cardBg },
          line: { color: palette.secondary, pt: 1.2 },
        });
        slide.addText(cleanText(m.value), {
          x: xPos + 0.1,
          y: contentStartY + 0.35,
          w: cardW - 0.2,
          h: 0.75,
          fontSize: 26,
          bold: true,
          color: palette.secondary,
          align: "center",
          fontFace: "Arial",
        });
        slide.addText(cleanText(m.label), {
          x: xPos + 0.1,
          y: contentStartY + 1.15,
          w: cardW - 0.2,
          h: 0.5,
          fontSize: 10.5,
          bold: true,
          color: palette.textDark,
          align: "center",
          fontFace: "Arial",
        });
        if (m.sublabel) {
          slide.addText(cleanText(m.sublabel), {
            x: xPos + 0.1,
            y: contentStartY + 1.7,
            w: cardW - 0.2,
            h: 0.7,
            fontSize: 9,
            color: palette.textMuted,
            align: "center",
            fontFace: "Arial",
          });
        }
      });
    }
    // -------------------------------------------------------------------------
    // B. TABLE LAYOUT
    // -------------------------------------------------------------------------
    else if (
      s.layout === "table" &&
      s.table &&
      Array.isArray(s.table.headers) &&
      s.table.headers.length > 0
    ) {
      const tableRows: any[] = [];

      tableRows.push(
        s.table.headers.map((h) => ({
          text: cleanText(h),
          options: {
            bold: true,
            fontSize: 9.5,
            color: palette.textLight,
            fill: { color: palette.primary },
            valign: "middle",
          },
        }))
      );

      (s.table.rows || []).forEach((r, rIdx) => {
        tableRows.push(
          r.map((cell, cIdx) => ({
            text: cleanText(cell),
            options: {
              bold: cIdx === 0,
              fontSize: 9,
              color: palette.textDark,
              fill: { color: rIdx % 2 === 0 ? "FFFFFF" : "F1F5F9" },
              valign: "top",
            },
          }))
        );
      });

      slide.addTable(tableRows, {
        x: 0.5,
        y: contentStartY,
        w: 9.0,
        border: { type: "solid", pt: 0.5, color: "CBD5E1" },
        fontFace: "Arial",
      });
    }
    // -------------------------------------------------------------------------
    // C. CARDS / FLOW LAYOUT
    // -------------------------------------------------------------------------
    else if (
      (s.layout === "cards" || s.layout === "flow") &&
      s.cards &&
      s.cards.length > 0
    ) {
      const count = s.cards.length;
      const cols = count === 4 ? 2 : Math.min(count, 3);
      const rows = Math.ceil(count / cols);
      const cardW = (9.0 - (cols - 1) * 0.2) / cols;
      const cardH = rows >= 2 ? 1.48 : 2.65;

      s.cards.forEach((c, idx) => {
        const colIdx = idx % cols;
        const rowIdx = Math.floor(idx / cols);
        const xPos = 0.5 + colIdx * (cardW + 0.2);
        const yPos = contentStartY + rowIdx * (cardH + 0.16);

        slide.addShape("rect", {
          x: xPos,
          y: yPos,
          w: cardW,
          h: cardH,
          fill: { color: palette.cardBg },
          line: { color: palette.cardBorder, pt: 0.75 },
        });

        if (c.badge) {
          slide.addText(cleanText(c.badge), {
            x: xPos + 0.15,
            y: yPos + 0.08,
            w: cardW - 0.3,
            h: 0.22,
            fontSize: 8.5,
            bold: true,
            color: palette.secondary,
            fontFace: "Arial",
          });
        }

        slide.addText(cleanText(c.title), {
          x: xPos + 0.15,
          y: yPos + 0.3,
          w: cardW - 0.3,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: palette.primary,
          fontFace: "Arial",
        });

        const bodyText =
          c.items && c.items.length > 0
            ? `${cleanText(c.description)}\n• ${c.items.map(cleanText).join("\n• ")}`
            : cleanText(c.description);

        if (bodyText) {
          slide.addText(bodyText, {
            x: xPos + 0.15,
            y: yPos + 0.62,
            w: cardW - 0.3,
            h: cardH - 0.68,
            fontSize: 9.5,
            color: palette.textDark,
            valign: "top",
            fontFace: "Arial",
          });
        }
      });
    }
    // -------------------------------------------------------------------------
    // D. DEUX COLONNES (COLUMNS / CLOSING)
    // -------------------------------------------------------------------------
    else if (s.secondaryColumn && s.secondaryColumn.length > 0) {
      const leftText = (s.bulletPoints || []).map(cleanText).filter(Boolean).join("\n\n");
      const rightText = (s.secondaryColumn || []).map(cleanText).filter(Boolean).join("\n\n");

      slide.addShape("rect", {
        x: 0.5,
        y: contentStartY,
        w: 4.35,
        h: contentHeight,
        fill: { color: palette.cardBg },
        line: { color: palette.cardBorder, pt: 0.75 },
      });
      if (leftText) {
        slide.addText(leftText, {
          x: 0.65,
          y: contentStartY + 0.15,
          w: 4.05,
          h: contentHeight - 0.3,
          fontSize: 10,
          color: palette.textDark,
          valign: "top",
          fontFace: "Arial",
        });
      }

      slide.addShape("rect", {
        x: 5.15,
        y: contentStartY,
        w: 4.35,
        h: contentHeight,
        fill: { color: palette.cardBg },
        line: { color: palette.cardBorder, pt: 0.75 },
      });
      if (rightText) {
        slide.addText(rightText, {
          x: 5.3,
          y: contentStartY + 0.15,
          w: 4.05,
          h: contentHeight - 0.3,
          fontSize: 10,
          color: palette.textDark,
          valign: "top",
          fontFace: "Arial",
        });
      }
    }
    // -------------------------------------------------------------------------
    // E. LISTE À PUCES STANDARD (FALLBACK)
    // -------------------------------------------------------------------------
    else {
      const validPoints = (s.bulletPoints || []).map(cleanText).filter(Boolean);
      if (validPoints.length > 0) {
        const items = validPoints.map((pt) => ({
          text: pt,
          options: { bullet: true, fontSize: 11.5, color: palette.textDark },
        }));
        slide.addText(items, {
          x: 0.5,
          y: contentStartY,
          w: 9.0,
          h: contentHeight,
          valign: "top",
          fontFace: "Arial",
          lineSpacingMultiple: 1.25,
        });
      }
    }

    // Bandeau Callout en bas
    if (s.bottomCallout) {
      slide.addShape("rect", {
        x: 0.5,
        y: 4.76,
        w: 9.0,
        h: 0.38,
        fill: { color: palette.primary },
      });
      slide.addText(cleanText(s.bottomCallout), {
        x: 0.65,
        y: 4.78,
        w: 8.7,
        h: 0.34,
        fontSize: 9,
        bold: true,
        color: palette.textLight,
        valign: "middle",
        fontFace: "Arial",
      });
    }

    // Pied de page
    slide.addText(
      "Wijdane Laaguidi & Salma Lsilis · Master's Thesis Defense 2026 · K&S Kenitra (Plant K3)",
      {
        x: 0.5,
        y: 5.26,
        w: 7.5,
        h: 0.25,
        fontSize: 8,
        color: palette.textMuted,
        fontFace: "Arial",
      }
    );

    slide.addText(`${index + 1} / ${data.slides.length}`, {
      x: 8.5,
      y: 5.26,
      w: 1.0,
      h: 0.25,
      fontSize: 8,
      bold: true,
      color: palette.textMuted,
      align: "right",
      fontFace: "Arial",
    });
  });

  await pres.writeFile({
    fileName: "Wijdane_Laaguidi_Salma_Lsilis_Soutenance_2026.pptx",
  });
}
