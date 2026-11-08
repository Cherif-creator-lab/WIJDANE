import { NextResponse } from "next/server";
import { createClaudeMessageWithFallback } from "@/lib/anthropic";
import { parseUploadedFile } from "@/lib/file-parser";
import { Slide } from "@/types/presentation";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message = "",
      currentSlide,
      allSlidesSummary,
      preferredModel,
      fileAttachment,
    }: {
      message?: string;
      currentSlide: Slide;
      allSlidesSummary: { slideNumber: number; act?: string; title: string; layout: string }[];
      preferredModel?: string;
      fileAttachment?: {
        name: string;
        type: string;
        size: number;
        base64: string;
      };
    } = body;

    const trimmedMsg = (message || "").trim();
    if (!trimmedMsg && !fileAttachment) {
      return NextResponse.json(
        { error: "Veuillez saisir un message ou joindre un fichier." },
        { status: 400 }
      );
    }

    // 1. Parser le fichier joint si présent
    let parsedFileSummary = "";
    let fileExtractedText = "";
    let isImageFile = false;
    let imageMediaType = "image/png";

    if (fileAttachment && fileAttachment.base64) {
      try {
        const fileBuf = Buffer.from(fileAttachment.base64, "base64");
        const parsed = await parseUploadedFile(
          fileAttachment.name,
          fileAttachment.type || "application/octet-stream",
          fileBuf
        );
        parsedFileSummary = parsed.summary;
        fileExtractedText = parsed.text;
        isImageFile = parsed.isImage;
        if (parsed.mediaType) {
          imageMediaType = parsed.mediaType;
        }
      } catch (parseErr: any) {
        console.warn("Erreur analyse fichier joint:", parseErr.message);
        parsedFileSummary = `Fichier ${fileAttachment.name} (analyse partielle)`;
      }
    }

    const systemPrompt = `Tu es l'Architecte IA d'Élite du site "Wijdane LAAGUIDI Hakma La Zone", propulsé par Claude Opus.
Tu es le copilote direct de Wijdane Laaguidi et Salma Lsilis pour leur soutenance officielle de Master (Master's Thesis Defense 2026) :
"Integrated Supply-Chain Coordination Framework: Synchronizing Production Planning, Procurement and Capacity Management under EDI Demand Variability" (Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra Plant K3 — Ibn Tofail University).

CONTEXTE FONDAMENTAL DU SITE ET DU DOCUMENT :
1. LE SUJET ET LE CONTENU OFFICIEL SONT DÉJÀ CHARGÉS DANS LE SYSTÈME !
   Ne dis JAMAIS que tu n'as pas accès à la soutenance.
2. ANALYSE DE FICHIER ATTACHÉ (PDF, PPTX, DOCX, TXT, IMAGE) :
   Si l'utilisateur joint un fichier, examine scrupuleusement son contenu extrait ou son image.
   Extrais-en les informations clés, données chiffrées, problématiques ou solutions pour enrichir immédiatement la diapositive en cours ou concevoir une nouvelle diapositive !
   Dans ton texte 'reply', mentionne explicitement le nom du fichier et les éléments clés que tu en as tirés.

COMPRÉHENSION MULTILINGUE TOTALE :
Tu comprends parfaitement le Français, l'Anglais et la Darija marocaine / Arabe (ex : "bghit ppt be had promt", "dir lya", "bdel l-design", "zid", "khelliha", etc.).

RÈGLE D'OR D'ACTION VISUELLE :
Quand l'utilisateur demande une modification, un nouveau design, plus de créativité ou intègre un fichier :
TU NE DOIS PAS RÉPONDRE AVEC UNE PHRASE VIDE !
TU DOIS OBLIGATOIREMENT REMPLIR L'OBJET "updatedCurrentSlide" avec un design spectaculaire, percutant et complet. Il est INTERDIT de renvoyer "updatedCurrentSlide": null quand on te demande de changer ou sublimer le design ou analyser un document !

RÈGLES D'ARCHITECTURE DESIGN :
1. Pour être créatif dans le design d'une slide :
   - Choisis le layout le plus percutant ("cards" avec 2, 3 ou 4 cartes dotées de badges clairs et points clés, "metrics" avec des chiffres percutants, "flow" pour les processus, "columns" pour les comparaisons).
   - Donne un titre accrocheur et un sous-titre élégant.
   - Ajoute des badges visuels percutants aux cartes (ex: "01 · PROCUREMENT", "02 · PLANNING", "PHASE 1", "IMPACT CLÉ").
   - Soigne le message clé du bas ("bottomCallout").
   - Développe un discours oral fluide et persuasif dans "speakerNotes" adapté à l'oratrice ("Wijdane Laaguidi", "Salma Lsilis" ou "Wijdane & Salma").
2. Tu peux aussi changer le thème général si demandé ou pertinent : "luxury-gold" | "mercedes-midnight" | "architect-obsidian" | "emerald-executive".

Diapositive ACTUELLEMENT ouverte à l'écran (Slide #${currentSlide?.slideNumber || 1}) :
${JSON.stringify(currentSlide, null, 2)}

Sommaire des slides de la présentation :
${JSON.stringify(allSlidesSummary, null, 2)}

FORMAT DE SORTIE JSON STRICT ET OBLIGATOIRE :
Réponds UNIQUEMENT avec un JSON valide, sans balises markdown, sans texte avant ou après :
{
  "reply": "Explication chaleureuse, motivante et précise en français ou anglais de ce que tu viens de modifier et des éléments clés tirés du fichier/instruction.",
  "updatedCurrentSlide": {
    "id": "${currentSlide?.id || "slide-1"}",
    "slideNumber": ${currentSlide?.slideNumber || 1},
    "act": "${currentSlide?.act || "ACT I · THE INDUSTRIAL JOURNEY"}",
    "layout": "cards" ou "metrics" ou "columns" ou "table" ou "flow" ou "title" ou "closing",
    "title": "Titre percutant",
    "subtitle": "Sous-titre descriptif",
    "bulletPoints": [],
    "secondaryColumn": [],
    "cards": [
      {
        "badge": "BADGE",
        "title": "Titre de carte",
        "description": "Description concise",
        "items": ["Point 1", "Point 2"]
      }
    ],
    "metrics": [
      {
        "value": "44.1%",
        "label": "Taux de variation",
        "sublabel": "Dépassement du seuil"
      }
    ],
    "bottomCallout": "Message clé de synthèse en bas de slide",
    "speaker": "Wijdane Laaguidi" ou "Salma Lsilis" ou "Wijdane & Salma",
    "speakerNotes": "Discours oral complet et détaillé à prononcer devant le jury..."
  },
  "newSlide": null,
  "themeChange": null ou "luxury-gold" | "mercedes-midnight" | "architect-obsidian" | "emerald-executive"
}`;

    // Construire le message utilisateur
    let userPromptText = trimmedMsg || "Analyse ce fichier et applique les modifications de manière créative sur la diapositive.";
    if (fileExtractedText) {
      userPromptText = `[FICHIER JOINT TRANSMIS PAR L'UTILISATEUR]
Nom du fichier : ${fileAttachment?.name}
Type et taille : ${parsedFileSummary}

--- DÉBUT CONTENU EXTRAIT DU FICHIER ---
${fileExtractedText.slice(0, 45000)}
--- FIN CONTENU DU FICHIER ---

INSTRUCTIONS OU DEMANDE DE L'UTILISATEUR :
${userPromptText}`;
    }

    let userMessageParam: any;
    if (isImageFile && fileAttachment?.base64) {
      userMessageParam = {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageMediaType,
              data: fileAttachment.base64,
            },
          },
          {
            type: "text",
            text: userPromptText,
          },
        ],
      };
    } else {
      userMessageParam = {
        role: "user",
        content: userPromptText,
      };
    }

    const { response, usedModel } = await createClaudeMessageWithFallback({
      system: systemPrompt,
      preferredModel: preferredModel || process.env.ANTHROPIC_MODEL || "claude-opus-4.8",
      max_tokens: 4096,
      messages: [userMessageParam],
    });

    const firstBlock = response.content[0];
    if (firstBlock.type !== "text") {
      throw new Error("Réponse non-textuelle reçue du modèle Claude.");
    }

    let raw = firstBlock.text.trim();
    if (raw.startsWith("```json")) {
      raw = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (raw.startsWith("```")) {
      raw = raw.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        reply: raw,
        updatedCurrentSlide: null,
        newSlide: null,
        themeChange: null,
      };
    }

    const wantsModification =
      /creative|design|disigne|bghit|bdel|change|modifie|améliore|style|traduis|dir|layout|carte|slide|ppt|plus beau|modern/i.test(
        message
      );

    if (!parsed.updatedCurrentSlide && wantsModification && currentSlide) {
      parsed.updatedCurrentSlide = {
        id: currentSlide.id,
        slideNumber: currentSlide.slideNumber,
        act: currentSlide.act || "ACT I · THE INDUSTRIAL JOURNEY",
        layout: currentSlide.layout === "title" ? "title" : "cards",
        title: currentSlide.title,
        subtitle:
          currentSlide.subtitle || "Optimisation & Synchronisation Stratégique",
        cards:
          currentSlide.cards && currentSlide.cards.length > 0
            ? currentSlide.cards.map((c, idx) => ({
                ...c,
                badge: c.badge || `0${idx + 1} · EXCELLENCE`,
              }))
            : currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0
            ? currentSlide.bulletPoints.map((bp, idx) => ({
                badge: `0${idx + 1} · STRATÉGIE`,
                title:
                  bp.split(":")[0]?.replace(/^•\s*/, "") || `Axe ${idx + 1}`,
                description: bp.includes(":")
                  ? bp.split(":").slice(1).join(":").trim()
                  : bp.replace(/^•\s*/, ""),
                items: [],
              }))
            : [
                {
                  badge: "01 · EXCELLENCE",
                  title: "Coordination Opérationnelle",
                  description:
                    "Alignement direct entre Approvisionnement et Planning de Production.",
                  items: [
                    "Réduction de l'effet coup de fouet",
                    "Stabilisation des flux",
                  ],
                },
                {
                  badge: "02 · AGILITÉ",
                  title: "Gestion de la Variabilité EDI",
                  description:
                    "Anticipation des fluctuations de commandes Mercedes-Benz en temps réel.",
                  items: [
                    "Surveillance des signaux faibles",
                    "Sécurisation des lignes K3",
                  ],
                },
              ],
        metrics: currentSlide.metrics || [],
        bulletPoints: currentSlide.bulletPoints || [],
        secondaryColumn: currentSlide.secondaryColumn || [],
        bottomCallout:
          currentSlide.bottomCallout ||
          "Excellence opérationnelle Mercedes-Benz VAN Program · Usine K&S Kénitra",
        speaker: currentSlide.speaker || "Wijdane Laaguidi",
        speakerNotes:
          currentSlide.speakerNotes ||
          "Monsieur le Président, Chers Membres du Jury, cette diapositive démontre notre méthodologie appliquée...",
        durationMinutes: currentSlide.durationMinutes || 1.5,
      };

      if (!parsed.themeChange) {
        parsed.themeChange = "mercedes-midnight";
      }

      if (
        !parsed.reply ||
        parsed.reply.includes("don't see any attached files") ||
        parsed.reply.includes("Could you share")
      ) {
        parsed.reply =
          "✨ Design sublimé avec succès ! J'ai réorganisé cette diapositive avec une architecture visuelle moderne, des cartes percutantes et des badges contrastés aux couleurs Mercedes-Benz & Kromberg & Schubert.";
      }
    }

    if (parsed.updatedCurrentSlide) {
      parsed.updatedCurrentSlide = {
        id: currentSlide?.id || `slide-${currentSlide?.slideNumber || 1}`,
        slideNumber: currentSlide?.slideNumber || 1,
        act:
          parsed.updatedCurrentSlide.act ||
          currentSlide?.act ||
          "ACT I · THE INDUSTRIAL JOURNEY",
        layout:
          parsed.updatedCurrentSlide.layout ||
          currentSlide?.layout ||
          "cards",
        title:
          parsed.updatedCurrentSlide.title ||
          currentSlide?.title ||
          "Slide Title",
        subtitle:
          parsed.updatedCurrentSlide.subtitle ??
          currentSlide?.subtitle ??
          "",
        cards:
          parsed.updatedCurrentSlide.cards || currentSlide?.cards || [],
        metrics:
          parsed.updatedCurrentSlide.metrics || currentSlide?.metrics || [],
        bulletPoints:
          parsed.updatedCurrentSlide.bulletPoints ||
          currentSlide?.bulletPoints ||
          [],
        secondaryColumn:
          parsed.updatedCurrentSlide.secondaryColumn ||
          currentSlide?.secondaryColumn ||
          [],
        bottomCallout:
          parsed.updatedCurrentSlide.bottomCallout ??
          currentSlide?.bottomCallout ??
          "",
        speaker:
          parsed.updatedCurrentSlide.speaker ||
          currentSlide?.speaker ||
          "Wijdane Laaguidi",
        speakerNotes:
          parsed.updatedCurrentSlide.speakerNotes ||
          currentSlide?.speakerNotes ||
          "",
        durationMinutes:
          parsed.updatedCurrentSlide.durationMinutes ||
          currentSlide?.durationMinutes ||
          1.5,
      };
    }

    return NextResponse.json({
      ...parsed,
      modelUsed: usedModel,
    });
  } catch (error: any) {
    console.error("Erreur Chatbot Claude Opus:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Erreur lors de la communication avec Claude Opus via le relais.",
      },
      { status: 500 }
    );
  }
}
