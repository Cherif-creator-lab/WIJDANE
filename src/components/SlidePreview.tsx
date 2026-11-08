import React from "react";
import { Slide, PresentationData } from "@/types/presentation";
import { User, Users } from "lucide-react";

interface SlidePreviewProps {
  slide: Slide;
  presentation: PresentationData;
  currentIndex: number;
  totalSlides: number;
}

export function SlidePreview({
  slide,
  presentation,
  currentIndex,
  totalSlides,
}: SlidePreviewProps) {
  const isTitle = slide.layout === "title";
  const isSection = slide.layout === "section" || slide.layout === "conclusion";

  const themeClass = {
    "academic-blue": {
      card: "bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white",
      contentCard: "bg-white text-slate-900",
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      speakerBadge: "bg-blue-600/10 text-blue-700 border-blue-300",
      bulletDot: "bg-blue-600",
    },
    emerald: {
      card: "bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white",
      contentCard: "bg-white text-slate-900",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      speakerBadge: "bg-emerald-600/10 text-emerald-700 border-emerald-300",
      bulletDot: "bg-emerald-600",
    },
    slate: {
      card: "bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white",
      contentCard: "bg-white text-slate-900",
      accent: "text-slate-700 bg-slate-100 border-slate-300",
      speakerBadge: "bg-slate-700/10 text-slate-800 border-slate-300",
      bulletDot: "bg-slate-700",
    },
    purple: {
      card: "bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 text-white",
      contentCard: "bg-white text-slate-900",
      accent: "text-purple-600 bg-purple-50 border-purple-200",
      speakerBadge: "bg-purple-600/10 text-purple-700 border-purple-300",
      bulletDot: "bg-purple-600",
    },
  }[presentation.theme || "academic-blue"];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 16:9 Slide Canvas */}
      <div className="w-full aspect-[16/9] max-h-[580px] rounded-xl shadow-2xl overflow-hidden relative border border-slate-700/60 transition-all duration-300">
        {isTitle ? (
          <div className={`w-full h-full p-8 md:p-12 flex flex-col justify-between ${themeClass.card}`}>
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 text-blue-200 mb-4 backdrop-blur-sm">
                Soutenance de Fin d&apos;Études
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl">
                {slide.title || presentation.topic}
              </h1>
              {slide.subtitle && (
                <p className="mt-3 text-sm md:text-lg text-slate-300 font-light max-w-2xl">
                  {slide.subtitle}
                </p>
              )}
            </div>

            <div className="border-t border-white/15 pt-4 flex flex-wrap items-end justify-between text-xs md:text-sm text-slate-300 gap-4">
              <div>
                <p className="font-semibold text-white">Présenté par :</p>
                <p className="text-blue-300 font-medium text-base">
                  {presentation.candidates || "Wijdane & Salma"}
                </p>
                <p className="text-slate-400 mt-1">{presentation.institution}</p>
              </div>
              <div className="text-right">
                {presentation.supervisor && (
                  <p>
                    <span className="text-slate-400">Encadrant(e) :</span> {presentation.supervisor}
                  </p>
                )}
                {presentation.jury && (
                  <p className="text-xs text-slate-400 mt-0.5">Jury : {presentation.jury}</p>
                )}
              </div>
            </div>
          </div>
        ) : isSection ? (
          <div className={`w-full h-full p-10 flex flex-col items-center justify-center text-center ${themeClass.card}`}>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 text-slate-300 mb-4">
              {slide.speaker ? `Orateur : ${slide.speaker}` : "Section clé"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="mt-4 text-base md:text-xl text-slate-300 max-w-xl">
                {slide.subtitle}
              </p>
            )}
          </div>
        ) : (
          <div className={`w-full h-full p-8 md:p-10 flex flex-col justify-between ${themeClass.contentCard}`}>
            {/* Slide Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5 italic">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                {/* Speaker pill */}
                {slide.speaker && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${themeClass.speakerBadge}`}>
                    {slide.speaker.includes("&") ? (
                      <Users className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    <span>{slide.speaker}</span>
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="mt-6">
                {slide.secondaryColumn && slide.secondaryColumn.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ul className="space-y-3">
                      {slide.bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 leading-relaxed">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${themeClass.bulletDot}`} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-3 border-l pl-6 border-slate-200">
                      {slide.secondaryColumn.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 leading-relaxed">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${themeClass.bulletDot}`} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="space-y-3.5 max-w-3xl">
                    {slide.bulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs md:text-base text-slate-800 leading-relaxed">
                        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${themeClass.bulletDot}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{presentation.candidates} — {presentation.topic}</span>
              <span>
                {currentIndex + 1} / {totalSlides}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Speaker Notes Box */}
      {slide.speakerNotes && (
        <div className="w-full mt-4 bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-1 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <span className="flex items-center gap-1.5">
              🎤 Ce que doit dire {slide.speaker || "l'oratrice"} (Notes d&apos;oral)
            </span>
            {slide.durationMinutes && (
              <span>~{slide.durationMinutes} min</span>
            )}
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-200">
            {slide.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
}
