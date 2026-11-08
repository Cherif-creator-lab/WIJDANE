import React, { useState } from "react";
import { Slide, Speaker } from "@/types/presentation";
import { Sparkles, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";

interface SlideEditorProps {
  slide: Slide;
  topic: string;
  onUpdate: (updated: Slide) => void;
}

export function SlideEditor({ slide, topic, onUpdate }: SlideEditorProps) {
  const [prompt, setPrompt] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpeakerChange = (speaker: Speaker) => {
    onUpdate({ ...slide, speaker });
  };

  const handleTitleChange = (title: string) => {
    onUpdate({ ...slide, title });
  };

  const handleSubtitleChange = (subtitle: string) => {
    onUpdate({ ...slide, subtitle });
  };

  const handleNotesChange = (speakerNotes: string) => {
    onUpdate({ ...slide, speakerNotes });
  };

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...slide.bulletPoints];
    updated[index] = val;
    onUpdate({ ...slide, bulletPoints: updated });
  };

  const handleAddBullet = () => {
    onUpdate({
      ...slide,
      bulletPoints: [...slide.bulletPoints, "Nouveau point clé"],
    });
  };

  const handleRemoveBullet = (index: number) => {
    const updated = slide.bulletPoints.filter((_, i) => i !== index);
    onUpdate({ ...slide, bulletPoints: updated });
  };

  const handleAiModify = async (instruction: string) => {
    if (!instruction.trim()) return;
    setIsModifying(true);
    setError(null);

    try {
      const res = await fetch("/api/modify-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slide,
          instructions: instruction,
          topic,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de modification");
      }

      const updatedSlide = await res.json();
      onUpdate(updatedSlide);
      setPrompt("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 text-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span>Édition de la diapositive #{slide.slideNumber}</span>
        </h3>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
          Format : {slide.layout}
        </span>
      </div>

      {/* Orateur assigné */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Qui présente cette slide ?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["Wijdane", "Salma", "Wijdane & Salma"] as Speaker[]).map((spk) => (
            <button
              key={spk}
              type="button"
              onClick={() => handleSpeakerChange(spk)}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                slide.speaker === spk
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {spk}
            </button>
          ))}
        </div>
      </div>

      {/* Titre & Sous-titre */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Titre de la slide
          </label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Sous-titre / Contexte
          </label>
          <input
            type="text"
            value={slide.subtitle || ""}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder="Optionnel..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Points de la slide */}
      {slide.layout !== "title" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Points clés affichés
            </label>
            <button
              type="button"
              onClick={handleAddBullet}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter un point
            </button>
          </div>
          <div className="space-y-2">
            {slide.bulletPoints.map((pt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pt}
                  onChange={(e) => handleBulletChange(i, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(i)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes d'orateur */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Discours oral / Notes de jury
        </label>
        <textarea
          rows={3}
          value={slide.speakerNotes || ""}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Que devez-vous dire précisément à l'oral pendant cette diapositive..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
        />
      </div>

      {/* Assistant IA Claude pour modifier la slide */}
      <div className="pt-3 border-t border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Modifier avec Claude
        </label>

        {/* Boutons d'action rapide */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {[
            "Raccourcir et simplifier",
            "Rendre plus percutant",
            "Détailler les aspects techniques",
            "Adapter au discours de Wijdane",
            "Adapter au discours de Salma",
          ].map((quick) => (
            <button
              key={quick}
              type="button"
              disabled={isModifying}
              onClick={() => handleAiModify(quick)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700/60 transition disabled:opacity-50"
            >
              {quick}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiModify(prompt)}
            placeholder="Ex : Ajoute des métriques chiffrées et développe les notes orales..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            disabled={isModifying || !prompt.trim()}
            onClick={() => handleAiModify(prompt)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 transition"
          >
            {isModifying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Appliquer
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-900/50 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
