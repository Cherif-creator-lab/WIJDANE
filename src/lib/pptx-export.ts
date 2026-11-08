import pptxgen from "pptxgenjs";
import { PresentationData, Slide } from "@/types/presentation";

const THEME_PALETTES = {
  "luxury-gold": {
    primary: "0F172A", // Obsidian Navy
    secondary: "D97706", // Gold Amber
    accent: "FEF3C7", // Soft Gold
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "E2E8F0",
    darkBg: "090D16",
    textDark: "0F172A",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
  "mercedes-midnight": {
    primary: "0B192C", // Deep Midnight Blue
    secondary: "0284C7", // Cyan/Silver Blue
    accent: "E0F2FE",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    cardBorder: "CBD5E1",
    darkBg: "050C16",
    textDark: "0F172A",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
  "architect-obsidian": {
    primary: "18181B",
    secondary: "6366F1",
    accent: "E0E7FF",
    bg: "FAFAFA",
    cardBg: "FFFFFF",
    cardBorder: "E4E4E7",
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

export async function exportToPptx(data: PresentationData) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625 inches
  pres.author = data.candidates || "Wijdane Laaguidi · Salma Lsilis";
  pres.company = data.institution || "Ibn Tofail University · Kromberg & Schubert";
  pres.title = data.topic;

  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["luxury-gold"];

  data.slides.forEach((s: Slide, index: number) => {
    const slide = pres.addSlide();

    // Speaker notes
    const fullNotes = `[Speaker: ${s.speaker || "Wijdane & Salma"}]\n[Act: ${s.act || ""}]\n\n${s.speakerNotes || ""}`;
    slide.addNotes(fullNotes);

    // 1. TITLE SLIDE
    if (s.layout === "title") {
      slide.background = { color: palette.darkBg };

      slide.addText(s.act || "MASTER’S THESIS DEFENSE · 2026", {
        x: 0.7,
        y: 0.7,
        w: 8.6,
        h: 0.4,
        fontSize: 11,
        bold: true,
        color: palette.secondary,
        fontFace: "Calibri",
      });

      slide.addText(s.title || data.topic, {
        x: 0.7,
        y: 1.2,
        w: 8.6,
        h: 1.3,
        fontSize: 28,
        bold: true,
        color: palette.textLight,
        fontFace: "Calibri",
        valign: "top",
      });

      if (s.subtitle) {
        slide.addText(s.subtitle, {
          x: 0.7,
          y: 2.5,
          w: 8.6,
          h: 0.7,
          fontSize: 14,
          color: "CBD5E1",
          fontFace: "Calibri",
        });
      }

      slide.addText(
        `Program: ${data.program}\nPresented by: ${data.candidates}\nSupervised by: ${data.supervisors}\nInstitutions: ${data.institution}`,
        {
          x: 0.7,
          y: 3.6,
          w: 8.6,
          h: 1.5,
          fontSize: 12,
          color: "E2E8F0",
          fontFace: "Calibri",
          lineSpacingMultiple: 1.3,
        }
      );
      return;
    }

    // STANDARD SLIDE BACKGROUND
    slide.background = { color: palette.bg };

    // Top Act Banner
    if (s.act) {
      slide.addText(s.act, {
        x: 0.5,
        y: 0.25,
        w: 6.5,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: palette.secondary,
        fontFace: "Calibri",
      });
    }

    // Speaker Tag Top Right
    if (s.speaker) {
      slide.addText(s.speaker, {
        x: 7.2,
        y: 0.25,
        w: 2.3,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: palette.textMuted,
        align: "right",
        fontFace: "Calibri",
      });
    }

    // Title
    slide.addText(s.title, {
      x: 0.5,
      y: 0.52,
      w: 9.0,
      h: 0.55,
      fontSize: 18,
      bold: true,
      color: palette.primary,
      fontFace: "Calibri",
      valign: "top",
    });

    // Subtitle
    if (s.subtitle) {
      slide.addText(s.subtitle, {
        x: 0.5,
        y: 1.08,
        w: 9.0,
        h: 0.3,
        fontSize: 10.5,
        italic: true,
        color: palette.textMuted,
        fontFace: "Calibri",
      });
    }

    const contentStartY = s.subtitle ? 1.48 : 1.25;
    const contentHeight = s.bottomCallout ? 3.2 : 3.65;

    // 2. METRICS LAYOUT
    if (s.layout === "metrics" && s.metrics && s.metrics.length > 0) {
      const count = s.metrics.length;
      const cardW = (9.0 - (count - 1) * 0.2) / count;
      s.metrics.forEach((m, i) => {
        const xPos = 0.5 + i * (cardW + 0.2);
        slide.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: contentStartY + 0.2,
          w: cardW,
          h: 2.4,
          fill: { color: palette.cardBg },
          line: { color: palette.secondary, width: 1.5 },
        });
        slide.addText(m.value, {
          x: xPos + 0.1,
          y: contentStartY + 0.45,
          w: cardW - 0.2,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: palette.secondary,
          align: "center",
          fontFace: "Calibri",
        });
        slide.addText(m.label, {
          x: xPos + 0.1,
          y: contentStartY + 1.3,
          w: cardW - 0.2,
          h: 0.45,
          fontSize: 11,
          bold: true,
          color: palette.textDark,
          align: "center",
          fontFace: "Calibri",
        });
        if (m.sublabel) {
          slide.addText(m.sublabel, {
            x: xPos + 0.1,
            y: contentStartY + 1.8,
            w: cardW - 0.2,
            h: 0.6,
            fontSize: 9.5,
            color: palette.textMuted,
            align: "center",
            fontFace: "Calibri",
          });
        }
      });
    }
    // 3. TABLE LAYOUT
    else if (s.layout === "table" && s.table) {
      const tableRows: any[] = [];
      tableRows.push(
        s.table.headers.map((h) => ({
          text: h,
          options: {
            bold: true,
            fontSize: 9.5,
            color: palette.textLight,
            fill: palette.primary,
            valign: "middle",
          },
        }))
      );
      s.table.rows.forEach((r, rIdx) => {
        tableRows.push(
          r.map((cell, cIdx) => ({
            text: cell,
            options: {
              bold: cIdx === 0,
              fontSize: 9,
              color: palette.textDark,
              fill: rIdx % 2 === 0 ? "FFFFFF" : "F1F5F9",
              valign: "top",
            },
          }))
        );
      });

      slide.addTable(tableRows, {
        x: 0.5,
        y: contentStartY,
        w: 9.0,
        border: { pt: 0.5, color: "CBD5E1" },
        fontFace: "Calibri",
      });
    }
    // 4. CARDS / FLOW LAYOUT
    else if ((s.layout === "cards" || s.layout === "flow") && s.cards && s.cards.length > 0) {
      const count = s.cards.length;
      const cols = count === 4 ? 2 : count;
      const rows = count === 4 ? 2 : 1;
      const cardW = (9.0 - (cols - 1) * 0.2) / cols;
      const cardH = rows === 2 ? 1.45 : 2.65;

      s.cards.forEach((c, idx) => {
        const colIdx = idx % cols;
        const rowIdx = Math.floor(idx / cols);
        const xPos = 0.5 + colIdx * (cardW + 0.2);
        const yPos = contentStartY + rowIdx * (cardH + 0.18);

        slide.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: yPos,
          w: cardW,
          h: cardH,
          fill: { color: palette.cardBg },
          line: { color: palette.cardBorder, width: 1 },
        });

        if (c.badge) {
          slide.addText(c.badge, {
            x: xPos + 0.15,
            y: yPos + 0.1,
            w: cardW - 0.3,
            h: 0.22,
            fontSize: 8.5,
            bold: true,
            color: palette.secondary,
            fontFace: "Calibri",
          });
        }

        slide.addText(c.title, {
          x: xPos + 0.15,
          y: yPos + 0.32,
          w: cardW - 0.3,
          h: 0.32,
          fontSize: 12,
          bold: true,
          color: palette.primary,
          fontFace: "Calibri",
        });

        const bodyText = c.items && c.items.length > 0
          ? `${c.description}\n• ${c.items.join("\n• ")}`
          : c.description;

        slide.addText(bodyText, {
          x: xPos + 0.15,
          y: yPos + 0.65,
          w: cardW - 0.3,
          h: cardH - 0.72,
          fontSize: 9.5,
          color: palette.textDark,
          valign: "top",
          fontFace: "Calibri",
        });
      });
    }
    // 5. TWO-COLUMNS OR CLOSING
    else if (s.secondaryColumn && s.secondaryColumn.length > 0) {
      const leftItems = s.bulletPoints.map((pt) => ({
        text: pt,
        options: { fontSize: 11, color: palette.textDark, breakLine: true },
      }));
      slide.addText(leftItems, {
        x: 0.5,
        y: contentStartY,
        w: 4.35,
        h: contentHeight,
        valign: "top",
        lineSpacingMultiple: 1.25,
      });

      const rightItems = s.secondaryColumn.map((pt) => ({
        text: pt,
        options: { fontSize: 11, color: palette.textDark, breakLine: true },
      }));
      slide.addText(rightItems, {
        x: 5.15,
        y: contentStartY,
        w: 4.35,
        h: contentHeight,
        valign: "top",
        lineSpacingMultiple: 1.25,
      });
    }
    // 6. FALLBACK BULLETS
    else {
      const items = (s.bulletPoints || []).map((pt) => ({
        text: pt,
        options: { bullet: true, fontSize: 12, color: palette.textDark },
      }));
      slide.addText(items, {
        x: 0.5,
        y: contentStartY,
        w: 9.0,
        h: contentHeight,
        valign: "top",
        lineSpacingMultiple: 1.3,
      });
    }

    // Bottom Callout Banner
    if (s.bottomCallout) {
      slide.addShape(pres.ShapeType.rect, {
        x: 0.5,
        y: 4.78,
        w: 9.0,
        h: 0.38,
        fill: { color: palette.primary },
      });
      slide.addText(s.bottomCallout, {
        x: 0.65,
        y: 4.8,
        w: 8.7,
        h: 0.34,
        fontSize: 9,
        bold: true,
        color: palette.textLight,
        valign: "middle",
        fontFace: "Calibri",
      });
    }

    // Footer
    slide.addText(
      `Wijdane Laaguidi & Salma Lsilis · Master's Thesis Defense 2026 · K&S (Plant K3)`,
      {
        x: 0.5,
        y: 5.28,
        w: 7.5,
        h: 0.25,
        fontSize: 8,
        color: palette.textMuted,
        fontFace: "Calibri",
      }
    );

    slide.addText(`${index + 1} / ${data.slides.length}`, {
      x: 8.5,
      y: 5.28,
      w: 1.0,
      h: 0.25,
      fontSize: 8,
      bold: true,
      color: palette.textMuted,
      align: "right",
      fontFace: "Calibri",
    });
  });

  await pres.writeFile({
    fileName: "Wijdane_Laaguidi_Salma_Lsilis_Thesis_Defense_2026.pptx",
  });
}
