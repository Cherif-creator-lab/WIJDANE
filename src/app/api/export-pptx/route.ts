import { NextResponse } from "next/server";
import { PresentationData } from "@/types/presentation";
import { generateStudioPptx } from "@/lib/studio-pptx-generator";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { presentation }: { presentation: PresentationData } = await req.json();

    if (!presentation || !Array.isArray(presentation.slides)) {
      return NextResponse.json(
        { error: "Données de présentation invalides." },
        { status: 400 }
      );
    }

    // Générer la présentation PowerPoint fidèle à 100% au design affiché sur le site
    const finalBuffer = await generateStudioPptx(presentation);

    return new Response(finalBuffer as any, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition":
          'attachment; filename="Wijdane_Laaguidi_Salma_Lsilis_Soutenance_2026.pptx"',
        "Content-Length": finalBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Erreur export PPTX Studio:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Erreur lors de la génération du fichier PowerPoint Studio.",
      },
      { status: 500 }
    );
  }
}
