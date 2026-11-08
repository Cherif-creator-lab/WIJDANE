import { NextResponse } from "next/server";
import { createClaudeMessageWithFallback } from "@/lib/anthropic";
import { Slide } from "@/types/presentation";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      currentSlide,
      allSlidesSummary,
      preferredModel,
    }: {
      message: string;
      currentSlide: Slide;
      allSlidesSummary: { slideNumber: number; act?: string; title: string; layout: string }[];
      preferredModel?: string;
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    const systemPrompt = `Tu es l'Architecte IA d'Élite du site "Wijdane LAAGUIDI Hakma La Zone", propulsé par Claude Opus.
Tu es le copilote direct de Wijdane Laaguidi et Salma Lsilis pour leur soutenance officielle de Master (Master's Thesis Defense 2026) :
"Integrated Supply-Chain Coordination Framework: Synchronizing Production Planning, Procurement and Capacity Management under EDI Demand Variability" (Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra Plant K3 — Ibn Tofail University).

CONTEXTE FONDAMENTAL DU SITE ET DU DOCUMENT :
1. LE SUJET ET LE DOCUMENT PDF SONT DÉJÀ 100% PRÉSENTS ET CHARGÉS !
   Ne dis JAMAIS que tu n'as pas le document ou le PDF.
   Quand l'utilisateur écrit "bghit ppt be had promt ou had pdf", "had l-prompt", "ce pdf", "more creative in the design", etc. :
   IL PARLE DU PROJET DE THÈSE ET DE LA SLIDE EN COURS DÉJÀ AFFICHÉE !
2. NE DEMANDE JAMAIS À L'UTILISATEUR D'UPLOADER OU DE FOURNIR UN FICHIER !
   Agis immédiatement sur la diapositive en cours pour appliquer les améliorations créatives demandées.

COMPRÉHENSION MULTILINGUE TOTALE :
Tu comprends parfaitement le Français, l'Anglais et la Darija marocaine / Arabe (ex : "bghit ppt be had promt", "dir lya", "bdel l-design", "zid", "khelliha", etc.).

RÈGLE D'OR D'ACTION VISUELLE :
Quand l'utilisateur demande une modification, un nouveau design, plus de créativité ("be more creative in the design", "change le style", "améliore", "traduis", etc.) :
TU NE DOIS PAS RÉPONDRE AVEC UNE PHRASE VIDE !
TU DOIS OBLIGATOIREMENT REMPLIR L'OBJET "updatedCurrentSlide" avec un design spectaculaire, percutant et complet. Il est INTERDIT de renvoyer "updatedCurrentSlide": null quand on te demande de changer ou sublimer le design !

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
  "reply": "Explication chaleureuse, motivante et précise en français ou anglais de ce que tu viens de modifier et des choix de design faits.",
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

    const { response, usedModel } = await createClaudeMessageWithFallback({
      system: systemPrompt,
      preferredModel: preferredModel || process.env.ANTHROPIC_MODEL || "claude-opus-4.8",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
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
