import { NextResponse } from "next/server";
import { getAnthropicClient, getDefaultModel } from "@/lib/anthropic";
import { Slide } from "@/types/presentation";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { slide, instructions, topic } = await req.json();

    if (!slide || !instructions) {
      return NextResponse.json({ error: "Slide et instructions requises." }, { status: 400 });
    }

    const anthropic = getAnthropicClient();
    const model = getDefaultModel();

    const prompt = `Tu es un assistant expert en présentations académiques pour soutenance.
Contexte du projet : "${topic || "Soutenance de fin d'études"}"

Voici la diapositive actuelle à modifier :
${JSON.stringify(slide, null, 2)}

Instructions de modification demandées par l'utilisateur :
"${instructions}"

Modifie la diapositive en respectant ces instructions tout en conservant le format JSON strict de l'objet Slide.
Maintiens ou ajuste "title", "subtitle", "bulletPoints", "secondaryColumn", "speaker" ("Wijdane", "Salma" ou "Wijdane & Salma") et "speakerNotes".

Réponds UNIQUEMENT par l'objet JSON modifié de la slide, sans markdown, sans texte additionnel.`;

    const response = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const firstContent = response.content[0];
    if (firstContent.type !== "text") {
      throw new Error("Réponse inattendue de Claude.");
    }

    let rawText = firstContent.text.trim();
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const updatedSlide: Slide = JSON.parse(rawText);
    return NextResponse.json(updatedSlide);
  } catch (error: any) {
    console.error("Erreur modification slide:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la modification de la diapositive." },
      { status: 500 }
    );
  }
}
