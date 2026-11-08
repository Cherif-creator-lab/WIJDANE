"use client";

import React, { useState, useEffect } from "react";
import { PresentationData, Slide } from "@/types/presentation";
import { DEFAULT_THESIS_PRESENTATION } from "@/lib/default-presentation";
import { SlidePreview } from "@/components/SlidePreview";
import { ClaudeChatbot } from "@/components/ClaudeChatbot";
import { exportToPptx } from "@/lib/pptx-export";
import {
  Crown,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "wijdane_hakma_la_zone_ppt_v1";

export default function HomePage() {
  const [presentation, setPresentation] = useState<PresentationData>(
    DEFAULT_THESIS_PRESENTATION
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load saved modifications from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          setPresentation(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presentation));
    } catch {
      // ignore
    }
  }, [presentation]);

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) =>
          Math.min(presentation.slides.length - 1, prev + 1)
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentation.slides.length, isFullscreen]);

  const currentSlide =
    presentation.slides[currentSlideIndex] || presentation.slides[0];

  const handleUpdateCurrentSlide = (updated: Slide) => {
    const updatedSlides = [...presentation.slides];
    updatedSlides[currentSlideIndex] = updated;
    setPresentation({ ...presentation, slides: updatedSlides });
  };

  const handleAddSlide = (customSlide?: Slide) => {
    const newSlide: Slide = customSlide || {
      id: `slide-${Date.now()}`,
      slideNumber: presentation.slides.length + 1,
      act: currentSlide?.act || "ACT VI · FROM FINDINGS TO ACTION",
      layout: "cards",
      title: "New Strategic Slide",
      subtitle: "Added via Wijdane LAAGUIDI Hakma La Zone Studio",
      cards: [
        {
          badge: "01",
          title: "Key Point 1",
          description: "Ask Claude Opus in the chatbot to customize this card.",
        },
        {
          badge: "02",
          title: "Key Point 2",
          description: "Edit manually or with AI instructions.",
        },
        {
          badge: "03",
          title: "Key Point 3",
          description: "Synchronized with PowerPoint export.",
        },
      ],
      bulletPoints: [],
      bottomCallout: "Key takeaway for the thesis defense jury.",
      speaker: "Wijdane Laaguidi",
      speakerNotes: "Oral defense notes for this slide...",
      durationMinutes: 1.5,
    };

    const nextSlides = [
      ...presentation.slides,
      { ...newSlide, slideNumber: presentation.slides.length + 1 },
    ];
    setPresentation({
      ...presentation,
      slides: nextSlides,
    });
    setCurrentSlideIndex(nextSlides.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (presentation.slides.length <= 1) return;
    const filtered = presentation.slides.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
    }));
    setPresentation({ ...presentation, slides: renumbered });
    if (currentSlideIndex >= renumbered.length) {
      setCurrentSlideIndex(renumbered.length - 1);
    }
  };

  const handleResetDefault = () => {
    if (
      confirm(
        "Réinitialiser les 21 slides originales de la soutenance de Wijdane Laaguidi & Salma Lsilis ?"
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setPresentation(DEFAULT_THESIS_PRESENTATION);
      setCurrentSlideIndex(0);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToPptx(presentation);
    } catch (err: any) {
      alert("Erreur lors de l'export PowerPoint : " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Act jump shortcuts
  const actShortcuts = [
    { label: "Cover", slideIdx: 0 },
    { label: "Act I · Journey", slideIdx: 1 },
    { label: "Act II · Research", slideIdx: 7 },
    { label: "Act III · Findings", slideIdx: 10 },
    { label: "Act IV · Theory", slideIdx: 14 },
    { label: "Act V · ISCC Model", slideIdx: 16 },
    { label: "Act VI · Action", slideIdx: 19 },
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#050811] text-slate-100 overflow-hidden">
      {/* ================= ARCHITECTURAL LUXURY NAVBAR ================= */}
      <header className="border-b border-white/10 bg-[#070B14]/95 backdrop-blur-xl px-4 lg:px-6 py-2.5 flex items-center justify-between shrink-0 z-30">
        {/* Brand Identity: Wijdane LAAGUIDI Hakma La Zone */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/40">
            <Crown className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Wijdane LAAGUIDI — Hakma La Zone
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Claude Opus Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              Master&apos;s Thesis Defense 2026 · Mercedes-Benz VAN Program · K&S Kenitra (Plant K3)
            </p>
          </div>
        </div>

        {/* Center Act Quick-Jump Bar */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-white/10 rounded-xl p-1">
          {actShortcuts.map((act) => {
            const isActive =
              currentSlideIndex >= act.slideIdx &&
              (act.slideIdx === 19 ||
                currentSlideIndex <
                  (actShortcuts[actShortcuts.indexOf(act) + 1]?.slideIdx ?? 99));
            return (
              <button
                key={act.label}
                type="button"
                onClick={() => setCurrentSlideIndex(act.slideIdx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {act.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1">
            <Palette className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
            {(
              [
                { id: "luxury-gold", label: "Gold" },
                { id: "mercedes-midnight", label: "Mercedes" },
                { id: "architect-obsidian", label: "Obsidian" },
                { id: "emerald-executive", label: "Emerald" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPresentation({ ...presentation, theme: t.id })}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  presentation.theme === t.id
                    ? "bg-white/15 text-amber-300 border border-amber-400/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetDefault}
            title="Restaurer les 21 slides d'origine"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Mode Soutenance Plein Écran"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-amber-400" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Export PPTX button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export .PPTX</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN 3-PANE ARCHITECT WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: 21 Slides Storyboard Navigator (Hidden in Fullscreen) */}
        {!isFullscreen && (
          <aside className="w-64 lg:w-72 border-r border-white/10 bg-[#070A12] flex flex-col shrink-0">
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Storyboard ({presentation.slides.length} Slides)
              </span>
              <button
                type="button"
                onClick={() => handleAddSlide()}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                <Plus className="w-3 h-3" /> Slide
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {presentation.slides.map((s, idx) => {
                const active = idx === currentSlideIndex;
                return (
                  <div
                    key={s.id || idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      active
                        ? "bg-gradient-to-r from-amber-500/15 to-transparent border-amber-500/60 text-white shadow-lg shadow-amber-500/5"
                        : "bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span
                        className={`font-black px-1.5 py-0.5 rounded ${
                          active
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[130px]">
                        {s.act?.split("·")[0] || s.layout}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                      {s.title}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                      <span>🎤 {s.speaker}</span>
                      <span className="uppercase text-[9px] px-1.5 py-0.2 bg-white/5 rounded">
                        {s.layout}
                      </span>
                    </div>

                    {presentation.slides.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER PANE: Interactive 16:9 Presentation Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start bg-[radial-gradient(ellipse_at_top,#111827_0%,#050811_75%)]">
          <div
            className={`w-full ${
              isFullscreen ? "max-w-6xl" : "max-w-4xl"
            } space-y-4 my-auto`}
          >
            {/* Stage Controls Bar */}
            <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur border border-white/10 rounded-xl px-4 py-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                  Slide {currentSlideIndex + 1} / {presentation.slides.length}
                </span>
                <span className="text-slate-400 hidden sm:inline">
                  {currentSlide?.act}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentSlideIndex === 0}
                  onClick={() =>
                    setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
                <button
                  type="button"
                  disabled={currentSlideIndex === presentation.slides.length - 1}
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min(presentation.slides.length - 1, prev + 1)
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition font-extrabold"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 16:9 Slide Canvas + Speaker Teleprompter */}
            {currentSlide && (
              <SlidePreview
                slide={currentSlide}
                presentation={presentation}
                currentIndex={currentSlideIndex}
                totalSlides={presentation.slides.length}
              />
            )}
          </div>
        </main>

        {/* RIGHT PANE: Claude Opus Chatbot & Live Slide Architect (Hidden in Fullscreen) */}
        {!isFullscreen && currentSlide && (
          <aside className="w-80 lg:w-96 shrink-0 h-full overflow-hidden">
            <ClaudeChatbot
              currentSlide={currentSlide}
              presentation={presentation}
              onUpdateCurrentSlide={handleUpdateCurrentSlide}
              onAddNewSlide={(newSlide) => handleAddSlide(newSlide)}
              onThemeChange={(theme) =>
                setPresentation({ ...presentation, theme })
              }
            />
          </aside>
        )}
      </div>
    </div>
  );
}
