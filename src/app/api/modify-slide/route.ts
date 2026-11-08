import { NextResponse } from "next/server";
import { createClaudeMessageWithFallback } from "@/lib/anthropic";
import { Slide } from "@/types/presentation";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { slide, instructions, topic } = await req.json();

    if (!slide || !instructions) {
      return NextResponse.json({ error: "Slide et instructions requises." }, { status: 400 });
    }

    const prompt = `Tu es un architecte de présentation de niveau exécutif (Master's Thesis Defense).
Contexte : "${topic || "Integrated Supply-Chain Coordination Framework"}"

Voici la diapositive actuelle à modifier :
${JSON.stringify(slide, null, 2)}

Instructions de modification :
"${instructions}"

Modifie la diapositive en respectant ces instructions tout en conservant le format JSON strict de l'objet Slide (avec cards, metrics, table, bulletPoints, bottomCallout, speakerNotes, etc.).
Réponds UNIQUEMENT par l'objet JSON modifié de la slide, sans markdown.`;

    const { response } = await createClaudeMessageWithFallback({
      max_tokens: 3000,
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
