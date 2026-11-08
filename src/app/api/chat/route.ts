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

    const systemPrompt = `Tu es l'Architecte IA Officiel du site "Wijdane LAAGUIDI Hakma La Zone", propulsé par Claude Opus.
Tu assistes Wijdane Laaguidi et Salma Lsilis pour leur soutenance de Master (Master's Thesis Defense 2026) intitulée :
"Integrated Supply-Chain Coordination Framework: Synchronizing Production Planning, Procurement and Capacity Management under EDI Demand Variability" (Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra Plant K3 — Ibn Tofail University).

Tu peux :
1. Modifier directement la diapositive actuellement affichée à l'écran (titre, sous-titre, act, layout, cards, metrics, table, bulletPoints, secondaryColumn, bottomCallout, speaker, speakerNotes).
2. Créer une nouvelle diapositive si l'utilisateur le demande.
3. Changer le thème visuel du site ("luxury-gold" | "mercedes-midnight" | "architect-obsidian" | "emerald-executive").
4. Répondre aux questions de préparation au jury, reformuler les notes d'oral, traduire en français ou en anglais, corriger ou enrichir le contenu.

Voici le sommaire des ${allSlidesSummary?.length || 21} diapositives de la présentation :
${JSON.stringify(allSlidesSummary, null, 2)}

Voici la diapositive ACTUELLEMENT sélectionnée à l'écran (Slide #${currentSlide?.slideNumber}) :
${JSON.stringify(currentSlide, null, 2)}

RÈGLE DE RÉPONSE OBLIGATOIRE :
Tu DOIS répondre UNIQUEMENT avec un objet JSON valide (sans balises markdown autour) respectant exactement cette structure :
{
  "reply": "Ta réponse claire, élégante et professionnelle à l'utilisateur (explique ce que tu as modifié ou réponds à sa question).",
  "updatedCurrentSlide": null ou l'objet Slide complet modifié si l'utilisateur a demandé de modifier la slide actuelle,
  "newSlide": null ou un nouvel objet Slide complet si l'utilisateur a demandé d'ajouter une slide,
  "themeChange": null ou "luxury-gold" | "mercedes-midnight" | "architect-obsidian" | "emerald-executive"
}

Si tu modifies "updatedCurrentSlide", conserve la structure valide de l'objet Slide :
- id (string)
- slideNumber (number)
- act (string)
- layout ("title" | "cards" | "columns" | "metrics" | "table" | "flow" | "closing")
- title (string)
- subtitle (string optionnel)
- bulletPoints (string[])
- secondaryColumn (string[] optionnel)
- cards (array de { badge?: string, title: string, description: string, items?: string[] } optionnel)
- metrics (array de { value: string, label: string, sublabel?: string } optionnel)
- table ({ headers: string[], rows: string[][] } optionnel)
- bottomCallout (string optionnel)
- speaker ("Wijdane Laaguidi" | "Salma Lsilis" | "Wijdane & Salma")
- speakerNotes (string)`;

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
      // Si Claude a répondu en texte libre malgré la consigne JSON
      parsed = {
        reply: raw,
        updatedCurrentSlide: null,
        newSlide: null,
        themeChange: null,
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
