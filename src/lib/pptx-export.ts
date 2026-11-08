import pptxgen from "pptxgenjs";
import { PresentationData, Slide } from "@/types/presentation";

const THEME_PALETTES = {
  "academic-blue": {
    primary: "1E3A8A", // Deep Navy
    secondary: "3B82F6", // Royal Blue
    accent: "DBEAFE", // Soft Blue
    bg: "F8FAFC", // Off white
    darkBg: "0F172A",
    textDark: "0F172A",
    textLight: "FFFFFF",
    textMuted: "64748B",
  },
  emerald: {
    primary: "065F46",
    secondary: "10B981",
    accent: "D1FAE5",
    bg: "F0FDF4",
    darkBg: "064E3B",
    textDark: "064E3B",
    textLight: "FFFFFF",
    textMuted: "6B7280",
  },
  slate: {
    primary: "334155",
    secondary: "64748B",
    accent: "E2E8F0",
    bg: "F8FAFC",
    darkBg: "0F172A",
    textDark: "1E293B",
    textLight: "FFFFFF",
    textMuted: "94A3B8",
  },
  purple: {
    primary: "581C87",
    secondary: "8B5CF6",
    accent: "F3E8FF",
    bg: "FAF5FF",
    darkBg: "3B0764",
    textDark: "3B0764",
    textLight: "FFFFFF",
    textMuted: "7E22CE",
  },
};

export async function exportToPptx(data: PresentationData) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = data.candidates || "Wijdane & Salma";
  pres.company = data.institution || "Université";
  pres.title = data.topic;

  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["academic-blue"];

  data.slides.forEach((s: Slide, index: number) => {
    const slide = pres.addSlide();

    // Notes d'orateur
    const fullNotes = `[Présentateur: ${s.speaker || "Wijdane & Salma"}]\n\n${s.speakerNotes || ""}`;
    slide.addNotes(fullNotes);

    if (s.layout === "title") {
      // Diapositive de titre principale
      slide.background = { color: palette.primary };

      // Badge Soutenance
      slide.addText("SOUTENANCE DE FIN D'ÉTUDES", {
        x: 1.0,
        y: 1.2,
        w: 11.3,
        h: 0.5,
        fontSize: 14,
        bold: true,
        color: palette.accent,
        fontFace: "Calibri",
      });

      // Titre
      slide.addText(s.title || data.topic, {
        x: 1.0,
        y: 1.8,
        w: 11.3,
        h: 2.0,
        fontSize: 34,
        bold: true,
        color: palette.textLight,
        fontFace: "Calibri",
        valign: "top",
      });

      // Sous-titre
      if (s.subtitle) {
        slide.addText(s.subtitle, {
          x: 1.0,
          y: 3.8,
          w: 11.3,
          h: 0.8,
          fontSize: 18,
          color: "E2E8F0",
          fontFace: "Calibri",
        });
      }

      // Encadré Présenté par
      slide.addText(`Présenté par : ${data.candidates}\nÉtablissement : ${data.institution || "Université"}${data.supervisor ? `\nEncadrant(e) : ${data.supervisor}` : ""}`, {
        x: 1.0,
        y: 5.0,
        w: 11.3,
        h: 1.5,
        fontSize: 16,
        color: palette.textLight,
        fontFace: "Calibri",
      });
      return;
    }

    if (s.layout === "section" || s.layout === "conclusion") {
      slide.background = { color: palette.darkBg };

      slide.addText(s.speaker ? `Rôle : ${s.speaker}` : "Section", {
        x: 1.0,
        y: 2.0,
        w: 11.3,
        h: 0.5,
        fontSize: 14,
        bold: true,
        color: palette.secondary,
        fontFace: "Calibri",
      });

      slide.addText(s.title, {
        x: 1.0,
        y: 2.7,
        w: 11.3,
        h: 1.8,
        fontSize: 36,
        bold: true,
        color: palette.textLight,
        fontFace: "Calibri",
      });

      if (s.subtitle) {
        slide.addText(s.subtitle, {
          x: 1.0,
          y: 4.5,
          w: 11.3,
          h: 1.0,
          fontSize: 20,
          color: "CBD5E1",
          fontFace: "Calibri",
        });
      }
      return;
    }

    // Diapositive de contenu standard
    slide.background = { color: palette.bg };

    // Bandeau supérieur
    slide.addText(s.title, {
      x: 0.8,
      y: 0.5,
      w: 10.0,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: palette.primary,
      fontFace: "Calibri",
    });

    // Tag orateur en haut à droite
    if (s.speaker) {
      slide.addText(`🎤 ${s.speaker}`, {
        x: 10.0,
        y: 0.5,
        w: 2.5,
        h: 0.4,
        fontSize: 11,
        bold: true,
        color: palette.secondary,
        align: "right",
      });
    }

    if (s.subtitle) {
      slide.addText(s.subtitle, {
        x: 0.8,
        y: 1.2,
        w: 11.5,
        h: 0.4,
        fontSize: 14,
        italic: true,
        color: palette.textMuted,
        fontFace: "Calibri",
      });
    }

    // Deux colonnes si secondaryColumn est rempli
    if (s.secondaryColumn && s.secondaryColumn.length > 0) {
      const itemsLeft = s.bulletPoints.map((pt) => ({ text: pt, options: { bullet: true, fontSize: 15, color: palette.textDark } }));
      slide.addText(itemsLeft, {
        x: 0.8,
        y: 1.8,
        w: 5.6,
        h: 4.8,
        valign: "top",
        lineSpacingMultiple: 1.25,
      });

      const itemsRight = s.secondaryColumn.map((pt) => ({ text: pt, options: { bullet: true, fontSize: 15, color: palette.textDark } }));
      slide.addText(itemsRight, {
        x: 6.8,
        y: 1.8,
        w: 5.6,
        h: 4.8,
        valign: "top",
        lineSpacingMultiple: 1.25,
      });
    } else {
      // Liste à puces standard sur pleine largeur
      const items = (s.bulletPoints || []).map((pt) => ({
        text: pt,
        options: {
          bullet: true,
          fontSize: 16,
          color: palette.textDark,
        },
      }));

      slide.addText(items, {
        x: 0.8,
        y: 1.8,
        w: 11.5,
        h: 4.8,
        valign: "top",
        lineSpacingMultiple: 1.3,
      });
    }

    // Pied de page
    slide.addText(`${data.candidates || "Wijdane & Salma"} — ${data.topic || "Soutenance"}`, {
      x: 0.8,
      y: 6.9,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      color: palette.textMuted,
    });

    slide.addText(`${index + 1} / ${data.slides.length}`, {
      x: 11.5,
      y: 6.9,
      w: 1.0,
      h: 0.3,
      fontSize: 10,
      color: palette.textMuted,
      align: "right",
    });
  });

  const sanitizedFileName = (data.topic || "Soutenance_Wijdane_Salma")
    .replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, "_")
    .substring(0, 40);

  await pres.writeFile({ fileName: `${sanitizedFileName}.pptx` });
}
