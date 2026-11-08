import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import { PresentationData, Slide } from "@/types/presentation";

const THEME_PALETTES = {
  "luxury-gold": {
    heroBg: "070B14",
    canvasBg: "F8FAFC",
    accent: "F59E0B",
    accentDark: "B45309",
    accentLight: "FEF3C7",
    cardBg: "FFFFFF",
    cardBorder: "E2E8F0",
    textPrimary: "0F172A",
    textSecondary: "475569",
    calloutBg: "0F172A",
    calloutText: "FDE68A",
  },
  "mercedes-midnight": {
    heroBg: "040914",
    canvasBg: "F8FAFC",
    accent: "0EA5E9",
    accentDark: "0369A1",
    accentLight: "E0F2FE",
    cardBg: "FFFFFF",
    cardBorder: "E2E8F0",
    textPrimary: "0F172A",
    textSecondary: "475569",
    calloutBg: "0B192C",
    calloutText: "BAE6FD",
  },
  "architect-obsidian": {
    heroBg: "09090B",
    canvasBg: "F8FAFC",
    accent: "6366F1",
    accentDark: "4338CA",
    accentLight: "EEF2FF",
    cardBg: "FFFFFF",
    cardBorder: "E2E8F0",
    textPrimary: "0F172A",
    textSecondary: "475569",
    calloutBg: "18181B",
    calloutText: "C7D2FE",
  },
  "emerald-executive": {
    heroBg: "022C22",
    canvasBg: "F8FAFC",
    accent: "10B981",
    accentDark: "047857",
    accentLight: "D1FAE5",
    cardBg: "FFFFFF",
    cardBorder: "E2E8F0",
    textPrimary: "0F172A",
    textSecondary: "475569",
    calloutBg: "064E3B",
    calloutText: "A7F3D0",
  },
};

export async function generateStudioPptx(
  data: PresentationData
): Promise<Buffer> {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Wijdane LAAGUIDI & Salma Lsilis — Master's Thesis Defense 2026";
  pres.company = "Mercedes-Benz · Kromberg & Schubert Kenitra (Plant K3)";

  const palette =
    THEME_PALETTES[data.theme] || THEME_PALETTES["luxury-gold"];

  data.slides.forEach((slide, index) => {
    const s = pres.addSlide();

    // ================= SLIDE 1: COVER SLIDE =================
    if (slide.layout === "title" || index === 0) {
      s.background = { color: palette.heroBg };

      // Top Badge
      s.addText(slide.act || "MASTER'S THESIS DEFENSE · 2026", {
        x: 0.8,
        y: 0.5,
        w: 3.8,
        h: 0.35,
        fontSize: 10,
        bold: true,
        color: palette.accent,
        fill: { color: "181512" },
        line: { color: palette.accent, width: 1 },
        rectRadius: 0.08,
      });

      // Top Right Program
      s.addText(
        data.program ||
          "Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra (Plant K3)",
        {
          x: 4.8,
          y: 0.5,
          w: 4.4,
          h: 0.35,
          fontSize: 9,
          color: "94A3B8",
          align: "right",
        }
      );

      // Main Title
      s.addText(slide.title, {
        x: 0.8,
        y: 1.3,
        w: 8.4,
        h: 1.4,
        fontSize: 26,
        bold: true,
        color: "FFFFFF",
        valign: "top",
      });

      // Subtitle
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.8,
          y: 2.8,
          w: 8.4,
          h: 0.8,
          fontSize: 13,
          color: "CBD5E1",
          valign: "top",
        });
      }

      // Bottom Metadata Cards (Presented by / Supervised by / Institutions)
      const boxW = 2.65;
      const boxY = 4.0;
      const boxH = 1.1;

      // Box 1: Presented by
      s.addShape(pres.ShapeType.rect, {
        x: 0.8,
        y: boxY,
        w: boxW,
        h: boxH,
        fill: { color: "111827" },
        line: { color: "374151", width: 1 },
        rectRadius: 0.08,
      });
      s.addText("PRESENTED BY", {
        x: 0.95,
        y: boxY + 0.1,
        w: boxW - 0.3,
        h: 0.25,
        fontSize: 8,
        bold: true,
        color: palette.accent,
      });
      s.addText(data.candidates || "Wijdane Laaguidi · Salma Lsilis", {
        x: 0.95,
        y: boxY + 0.35,
        w: boxW - 0.3,
        h: 0.4,
        fontSize: 10,
        bold: true,
        color: "FFFFFF",
      });
      s.addText("Procurement & Production Planning", {
        x: 0.95,
        y: boxY + 0.75,
        w: boxW - 0.3,
        h: 0.25,
        fontSize: 8,
        color: "94A3B8",
      });

      // Box 2: Supervised by
      s.addShape(pres.ShapeType.rect, {
        x: 3.65,
        y: boxY,
        w: boxW,
        h: boxH,
        fill: { color: "111827" },
        line: { color: "374151", width: 1 },
        rectRadius: 0.08,
      });
      s.addText("SUPERVISED BY", {
        x: 3.8,
        y: boxY + 0.1,
        w: boxW - 0.3,
        h: 0.25,
        fontSize: 8,
        bold: true,
        color: palette.accent,
      });
      s.addText("Prof. Mohamed Mamad (Academic)", {
        x: 3.8,
        y: boxY + 0.35,
        w: boxW - 0.3,
        h: 0.3,
        fontSize: 9,
        bold: true,
        color: "FFFFFF",
      });
      s.addText("Younes Benrkiya (Internship)", {
        x: 3.8,
        y: boxY + 0.65,
        w: boxW - 0.3,
        h: 0.3,
        fontSize: 9,
        bold: true,
        color: "FFFFFF",
      });

      // Box 3: Institutions
      s.addShape(pres.ShapeType.rect, {
        x: 6.5,
        y: boxY,
        w: boxW,
        h: boxH,
        fill: { color: "111827" },
        line: { color: "374151", width: 1 },
        rectRadius: 0.08,
      });
      s.addText("INSTITUTIONS", {
        x: 6.65,
        y: boxY + 0.1,
        w: boxW - 0.3,
        h: 0.25,
        fontSize: 8,
        bold: true,
        color: palette.accent,
      });
      s.addText("Ibn Tofail University, Kenitra", {
        x: 6.65,
        y: boxY + 0.35,
        w: boxW - 0.3,
        h: 0.3,
        fontSize: 9,
        bold: true,
        color: "FFFFFF",
      });
      s.addText("Kromberg & Schubert (Plant K3)", {
        x: 6.65,
        y: boxY + 0.65,
        w: boxW - 0.3,
        h: 0.3,
        fontSize: 9,
        bold: true,
        color: "FFFFFF",
      });
    } else {
      // ================= EXECUTIVE CONTENT SLIDES (2 to 22) =================
      s.background = { color: palette.canvasBg };

      // Top Act Badge
      if (slide.act) {
        s.addText(slide.act, {
          x: 0.8,
          y: 0.35,
          w: 4.5,
          h: 0.28,
          fontSize: 8,
          bold: true,
          color: palette.accentDark,
          fill: { color: palette.accentLight },
          line: { color: palette.accent, width: 0.5 },
          rectRadius: 0.04,
        });
      }

      // Top Right Speaker Pill
      if (slide.speaker) {
        s.addText(slide.speaker, {
          x: 6.8,
          y: 0.35,
          w: 2.4,
          h: 0.28,
          fontSize: 8,
          bold: true,
          color: "FFFFFF",
          fill: { color: "0F172A" },
          align: "center",
          rectRadius: 0.04,
        });
      }

      // Slide Title
      s.addText(slide.title, {
        x: 0.8,
        y: 0.7,
        w: 8.4,
        h: 0.55,
        fontSize: 16,
        bold: true,
        color: palette.textPrimary,
        valign: "top",
      });

      // Slide Subtitle
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.8,
          y: 1.25,
          w: 8.4,
          h: 0.3,
          fontSize: 10,
          color: palette.textSecondary,
        });
      }

      const bodyY = slide.subtitle ? 1.6 : 1.35;
      const bodyH = 2.7;

      // 1. CARDS / FLOW LAYOUT
      const effectiveCards =
        slide.cards && slide.cards.length > 0
          ? slide.cards
          : slide.bulletPoints && slide.bulletPoints.length > 0 && (slide.layout === "cards" || slide.layout === "flow")
          ? slide.bulletPoints.map((bp, i) => {
              const parts = bp.replace(/^•\s*/, "").split(":");
              return {
                badge: `0${i + 1}`,
                title: parts[0]?.trim() || `Point ${i + 1}`,
                description: parts.slice(1).join(":").trim() || parts[0]?.trim(),
                items: [],
              };
            })
          : [];

      if ((slide.layout === "cards" || slide.layout === "flow") && effectiveCards.length > 0) {
        const count = effectiveCards.length;
        const gap = 0.2;
        const totalW = 8.4;
        const cardW = (totalW - gap * (count - 1)) / count;

        effectiveCards.forEach((c, cIdx) => {
          const cardX = 0.8 + cIdx * (cardW + gap);
          s.addShape(pres.ShapeType.rect, {
            x: cardX,
            y: bodyY,
            w: cardW,
            h: bodyH,
            fill: { color: palette.cardBg },
            line: { color: palette.cardBorder, width: 1 },
            rectRadius: 0.08,
          });

          // Badge
          if (c.badge) {
            s.addText(c.badge, {
              x: cardX + 0.15,
              y: bodyY + 0.15,
              w: cardW - 0.3,
              h: 0.25,
              fontSize: 7.5,
              bold: true,
              color: palette.accentDark,
              fill: { color: palette.accentLight },
              rectRadius: 0.04,
            });
          }

          // Card Title
          s.addText(c.title, {
            x: cardX + 0.15,
            y: bodyY + 0.45,
            w: cardW - 0.3,
            h: 0.45,
            fontSize: 10.5,
            bold: true,
            color: palette.textPrimary,
          });

          // Card Description
          s.addText(c.description, {
            x: cardX + 0.15,
            y: bodyY + 0.95,
            w: cardW - 0.3,
            h: 1.1,
            fontSize: 8.5,
            color: palette.textSecondary,
            valign: "top",
          });

          // Card Items
          if (c.items && c.items.length > 0) {
            const itemsText = c.items.map((it) => `• ${it}`).join("\n");
            s.addText(itemsText, {
              x: cardX + 0.15,
              y: bodyY + 1.95,
              w: cardW - 0.3,
              h: 0.65,
              fontSize: 8,
              color: palette.textPrimary,
            });
          }
        });
      } else if (slide.layout === "metrics" && slide.metrics && slide.metrics.length > 0) {
        // 2. METRICS LAYOUT
        const mCount = slide.metrics.length;
        const gap = 0.25;
        const totalW = 8.4;
        const mW = (totalW - gap * (mCount - 1)) / mCount;

        slide.metrics.forEach((m, mIdx) => {
          const mX = 0.8 + mIdx * (mW + gap);
          s.addShape(pres.ShapeType.rect, {
            x: mX,
            y: bodyY + 0.3,
            w: mW,
            h: 2.1,
            fill: { color: "FFFFFF" },
            line: { color: palette.cardBorder, width: 1 },
            rectRadius: 0.08,
          });

          // Top Accent Bar
          s.addShape(pres.ShapeType.rect, {
            x: mX + 0.2,
            y: bodyY + 0.5,
            w: 0.6,
            h: 0.08,
            fill: { color: palette.accent },
          });

          // Metric Value
          s.addText(m.value, {
            x: mX + 0.2,
            y: bodyY + 0.65,
            w: mW - 0.4,
            h: 0.6,
            fontSize: 22,
            bold: true,
            color: palette.accentDark,
          });

          // Metric Label
          s.addText(m.label, {
            x: mX + 0.2,
            y: bodyY + 1.3,
            w: mW - 0.4,
            h: 0.4,
            fontSize: 10,
            bold: true,
            color: palette.textPrimary,
          });

          // Sublabel
          if (m.sublabel) {
            s.addText(m.sublabel, {
              x: mX + 0.2,
              y: bodyY + 1.7,
              w: mW - 0.4,
              h: 0.5,
              fontSize: 8,
              color: palette.textSecondary,
            });
          }
        });
      } else if (slide.layout === "table" && slide.table) {
        // 3. TABLE LAYOUT
        const headers = slide.table.headers.map((h) => ({
          text: h,
          options: {
            bold: true,
            color: "FFFFFF",
            fill: { color: palette.calloutBg },
            fontSize: 9,
          },
        }));

        const rows = slide.table.rows.map((row, rIdx) =>
          row.map((cell, cIdx) => ({
            text: cell,
            options: {
              fontSize: 8.5,
              color: cIdx === 0 ? palette.textPrimary : palette.textSecondary,
              bold: cIdx === 0,
              fill: { color: rIdx % 2 === 0 ? "FFFFFF" : "F1F5F9" },
            },
          }))
        );

        s.addTable([headers, ...rows] as any, {
          x: 0.8,
          y: bodyY + 0.1,
          w: 8.4,
          border: { color: "CBD5E1", pt: 0.5 },
          rowH: 0.35,
        });
      } else {
        // 4. COLUMNS / BULLETS LAYOUT
        const colW = slide.secondaryColumn && slide.secondaryColumn.length > 0 ? 4.1 : 8.4;
        const col1Text = slide.bulletPoints.map((bp) => `✓ ${bp.replace(/^•\s*/, "")}`).join("\n\n");

        s.addShape(pres.ShapeType.rect, {
          x: 0.8,
          y: bodyY,
          w: colW,
          h: bodyH,
          fill: { color: "FFFFFF" },
          line: { color: palette.cardBorder, width: 1 },
          rectRadius: 0.08,
        });
        s.addText(col1Text, {
          x: 1.0,
          y: bodyY + 0.2,
          w: colW - 0.4,
          h: bodyH - 0.4,
          fontSize: 9.5,
          color: palette.textPrimary,
          valign: "top",
        });

        if (slide.secondaryColumn && slide.secondaryColumn.length > 0) {
          const col2Text = slide.secondaryColumn.map((bp) => `✓ ${bp.replace(/^•\s*/, "")}`).join("\n\n");
          s.addShape(pres.ShapeType.rect, {
            x: 5.1,
            y: bodyY,
            w: 4.1,
            h: bodyH,
            fill: { color: "FFFFFF" },
            line: { color: palette.cardBorder, width: 1 },
            rectRadius: 0.08,
          });
          s.addText(col2Text, {
            x: 5.3,
            y: bodyY + 0.2,
            w: 3.7,
            h: bodyH - 0.4,
            fontSize: 9.5,
            color: palette.textPrimary,
            valign: "top",
          });
        }
      }

      // Bottom Callout Banner
      if (slide.bottomCallout) {
        s.addShape(pres.ShapeType.rect, {
          x: 0.8,
          y: 4.5,
          w: 8.4,
          h: 0.45,
          fill: { color: palette.calloutBg },
          rectRadius: 0.06,
        });
        s.addShape(pres.ShapeType.rect, {
          x: 0.8,
          y: 4.5,
          w: 0.08,
          h: 0.45,
          fill: { color: palette.accent },
        });
        s.addText(slide.bottomCallout, {
          x: 1.0,
          y: 4.5,
          w: 8.1,
          h: 0.45,
          fontSize: 9,
          bold: true,
          color: palette.calloutText,
          valign: "middle",
        });
      }

      // Footer
      s.addText(
        `Wijdane Laaguidi · Salma Lsilis — Master's Thesis Defense 2026 (K&S Plant K3)`,
        {
          x: 0.8,
          y: 5.1,
          w: 6.0,
          h: 0.25,
          fontSize: 7.5,
          color: "94A3B8",
        }
      );
      s.addText(`Slide ${index + 1} / ${data.slides.length}`, {
        x: 7.2,
        y: 5.1,
        w: 2.0,
        h: 0.25,
        fontSize: 7.5,
        bold: true,
        color: "64748B",
        align: "right",
      });
    }

    // Attach native speaker notes for PowerPoint presenter view!
    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }
  });

  const rawBuffer = (await pres.write({ outputType: "nodebuffer" })) as Buffer;

  // Sanitize all XML files in PPTX to guarantee 0 unescaped ampersands
  const zip = await JSZip.loadAsync(rawBuffer);
  for (const filename of Object.keys(zip.files)) {
    if (filename.endsWith(".xml") || filename.endsWith(".rels")) {
      let xml = await zip.file(filename)!.async("string");
      if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(xml)) {
        xml = xml.replace(
          /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g,
          "&amp;"
        );
        zip.file(filename, xml);
      }
    }
  }

  const cleanBuffer = (await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })) as Buffer;

  return cleanBuffer;
}
