import { PresentationData } from "@/types/presentation";

export async function exportToPptx(data: PresentationData) {
  try {
    const res = await fetch("/api/export-pptx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presentation: data }),
    });

    if (!res.ok) {
      let errMsg = "Erreur lors de l'exportation du fichier PowerPoint.";
      try {
        const errJson = await res.json();
        errMsg = errJson.error || errMsg;
      } catch {
        // ignore
      }
      throw new Error(errMsg);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Wijdane_Laaguidi_Salma_Lsilis_Soutenance_2026.pptx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Erreur export PPTX:", error);
    throw error;
  }
}
