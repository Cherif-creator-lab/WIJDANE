import JSZip from "jszip";

export interface ParsedFileResult {
  text: string;
  isImage: boolean;
  mediaType?: string;
  summary: string;
}

export async function parseUploadedFile(
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<ParsedFileResult> {
  const lowerName = filename.toLowerCase();

  // 1. IMAGES (PNG, JPG, WEBP)
  if (
    mimeType.startsWith("image/") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".webp")
  ) {
    const mediaType = mimeType.startsWith("image/")
      ? mimeType
      : lowerName.endsWith(".png")
      ? "image/png"
      : lowerName.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

    return {
      text: `[Image attachée : ${filename}]`,
      isImage: true,
      mediaType,
      summary: `Image ${filename} (${Math.round(buffer.length / 1024)} KB)`,
    };
  }

  // 2. PDF DOCUMENTS
  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
    try {
      // Use dynamic require for pdf-parse to avoid Next.js build-time bundling issues with canvas/worker
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      const extractedText = (pdfData.text || "").trim();
      return {
        text: extractedText,
        isImage: false,
        summary: `Document PDF ${filename} (${pdfData.numpages || 1} pages, ~${extractedText.length} caractères)`,
      };
    } catch (err: any) {
      console.warn("pdf-parse fallback:", err.message);
      // Fallback: extract visible text streams from PDF buffer
      const rawStr = buffer.toString("binary");
      const textMatches = [...rawStr.matchAll(/\(([^()]+)\)T[jJ]/g)].map(
        (m) => m[1]
      );
      const text = textMatches.join(" ");
      return {
        text: text || `[Document PDF ${filename} téléchargé]`,
        isImage: false,
        summary: `Document PDF ${filename} (${Math.round(buffer.length / 1024)} KB)`,
      };
    }
  }

  // 3. POWERPOINT (.pptx)
  if (lowerName.endsWith(".pptx")) {
    try {
      const zip = await JSZip.loadAsync(buffer);
      const slideKeys = Object.keys(zip.files)
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, "") || "0");
          const numB = parseInt(b.replace(/\D/g, "") || "0");
          return numA - numB;
        });

      let fullPptxText = `[Présentation PowerPoint : ${filename} (${slideKeys.length} diapositives)]\n\n`;

      for (let i = 0; i < slideKeys.length; i++) {
        const key = slideKeys[i];
        const xml = await zip.file(key)?.async("string");
        if (xml) {
          const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(
            (m) => m[1]
          );
          if (texts.length > 0) {
            fullPptxText += `--- Diapositive ${i + 1} ---\n${texts.join(
              " "
            )}\n\n`;
          }
        }
      }

      return {
        text: fullPptxText.trim(),
        isImage: false,
        summary: `Présentation PPTX ${filename} (${slideKeys.length} diapositives)`,
      };
    } catch (err: any) {
      return {
        text: `[Erreur lecture PPTX ${filename}: ${err.message}]`,
        isImage: false,
        summary: `Fichier PPTX ${filename}`,
      };
    }
  }

  // 4. WORD (.docx)
  if (lowerName.endsWith(".docx")) {
    try {
      const zip = await JSZip.loadAsync(buffer);
      const docXml = await zip.file("word/document.xml")?.async("string");
      if (docXml) {
        const texts = [...docXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(
          (m) => m[1]
        );
        return {
          text: texts.join(" "),
          isImage: false,
          summary: `Document Word ${filename}`,
        };
      }
    } catch {
      // fallback
    }
  }

  // 5. TEXT / MARKDOWN / JSON / CSV / CODE
  try {
    const textContent = buffer.toString("utf-8");
    return {
      text: textContent,
      isImage: false,
      summary: `Fichier texte ${filename} (${Math.round(buffer.length / 1024)} KB)`,
    };
  } catch {
    return {
      text: `[Fichier binaire ${filename} de ${buffer.length} octets]`,
      isImage: false,
      summary: `Fichier ${filename}`,
    };
  }
}
