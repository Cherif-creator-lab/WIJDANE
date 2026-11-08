import { NextResponse } from "next/server";
import { getAnthropicClient, getDefaultModel } from "@/lib/anthropic";

export const maxDuration = 60; // 60s max sur Vercel Pro/Hobby

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      topic,
      candidates = "Wijdane & Salma",
      institution = "Université",
      supervisor = "",
      jury = "",
      slideCount = 10,
      specialInstructions = "",
    } = body;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: "Le sujet de la soutenance est obligatoire." }, { status: 400 });
    }

    const anthropic = getAnthropicClient();
    const model = getDefaultModel();

    const prompt = `Tu es un expert universitaire de haut niveau dans la préparation de soutenances de fin d'études (PFE, Master, Ingénieur).
Tu dois concevoir une présentation PowerPoint complète, rigoureuse, académique et percutante pour la soutenance de : "${candidates}".

Sujet de la soutenance : "${topic}"
Établissement / Université : "${institution}"
${supervisor ? `Encadrant(e) : "${supervisor}"` : ""}
${jury ? `Membres du Jury : "${jury}"` : ""}
Nombre total de diapositives souhaité : ${slideCount}
${specialInstructions ? `Consignes particulières : "${specialInstructions}"` : ""}

IMPORTANT : Les candidates sont DEUX (Wijdane et Salma). Tu dois alterner intelligemment la prise de parole entre "Wijdane", "Salma" et parfois "Wijdane & Salma" (pour le titre, la conclusion ou les questions).

Structure type recommandée à adapter :
1. Titre & Introduction du projet (layout: "title")
2. Contexte & Problématique générale (layout: "content")
3. Objectifs et Périmètre du travail (layout: "two-columns")
4. État de l'art / Analyse comparative (layout: "content")
5. Méthodologie / Architecture technique adoptée (layout: "content" ou "two-columns")
6. Réalisation / Conception & Fonctionnalités clés (layout: "content")
7. Résultats, Métriques & Tests de validation (layout: "content" ou "metrics")
8. Démonstration & Analyse critique des apports (layout: "content")
9. Difficultés rencontrées et solutions apportées (layout: "content")
10. Conclusion générale & Perspectives d'avenir (layout: "conclusion")

Pour chaque diapositive :
- "layout": "title" | "section" | "content" | "two-columns" | "conclusion"
- "title": Titre percutant et professionnel
- "subtitle": Phrase de mise en contexte (optionnel)
- "bulletPoints": 3 à 5 points clés clairs, percutants, avec mots-clés en avant (pas de blocs de texte indigestes)
- "secondaryColumn": Tableau de points pour la 2ème colonne si layout = "two-columns" (optionnel)
- "speaker": Qui parle ? "Wijdane" ou "Salma" ou "Wijdane & Salma"
- "speakerNotes": Notes d'orateur détaillées et concrètes en français expliquant exactement ce que la candidate doit dire au jury pendant cette slide.
- "durationMinutes": Durée estimée en minutes (ex: 1.5)

Tu DOIS répondre UNIQUEMENT par un objet JSON valide, sans balises markdown, sans texte avant ni après.

Format JSON strict attendu :
{
  "topic": "${topic}",
  "candidates": "${candidates}",
  "institution": "${institution}",
  "supervisor": "${supervisor}",
  "jury": "${jury}",
  "theme": "academic-blue",
  "slides": [
    {
      "id": "slide-1",
      "slideNumber": 1,
      "layout": "title",
      "title": "Titre",
      "subtitle": "Sous-titre",
      "bulletPoints": [],
      "speaker": "Wijdane & Salma",
      "speakerNotes": "Texte explicatif pour le jury...",
      "durationMinutes": 1
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const firstContent = response.content[0];
    if (firstContent.type !== "text") {
      throw new Error("Réponse inattendue de Claude (non-texte).");
    }

    let rawText = firstContent.text.trim();
    // Nettoyer les balises de code si Claude en a mis malgré la consigne
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const presentation = JSON.parse(rawText);
    return NextResponse.json(presentation);
  } catch (error: any) {
    console.error("Erreur génération soutenance:", error);
    return NextResponse.json(
      {
        error: error.message || "Erreur lors de la génération de la présentation avec Claude.",
      },
      { status: 500 }
    );
  }
}
