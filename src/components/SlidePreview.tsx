import React from "react";
import { Slide, PresentationData } from "@/types/presentation";
import {
  User,
  Users,
  Sparkles,
  ArrowRight,
  Award,
  Building2,
  GraduationCap,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface SlidePreviewProps {
  slide: Slide;
  presentation: PresentationData;
  currentIndex: number;
  totalSlides: number;
}

const THEME_STYLES = {
  "luxury-gold": {
    heroBg:
      "bg-gradient-to-br from-[#070B14] via-[#0F172A] to-[#1E1B18] text-white",
    canvasBg: "bg-[#F8FAFC] text-slate-900",
    actBadge: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    speakerPill: "bg-slate-900 text-amber-400 border-amber-500/30",
    cardBorder: "border-slate-200/90 hover:border-amber-500/50",
    cardBadge: "text-amber-700 bg-amber-50 border-amber-200",
    metricValue: "text-amber-600",
    tableHeader: "bg-slate-900 text-amber-400",
    calloutBar:
      "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-amber-300 border-l-4 border-amber-500",
    accentDot: "bg-amber-500",
  },
  "mercedes-midnight": {
    heroBg:
      "bg-gradient-to-br from-[#040914] via-[#0B192C] to-[#1E3E62] text-white",
    canvasBg: "bg-[#F8FAFC] text-slate-900",
    actBadge: "text-sky-600 bg-sky-500/10 border-sky-500/30",
    speakerPill: "bg-[#0B192C] text-sky-300 border-sky-500/30",
    cardBorder: "border-slate-200/90 hover:border-sky-500/50",
    cardBadge: "text-sky-700 bg-sky-50 border-sky-200",
    metricValue: "text-sky-600",
    tableHeader: "bg-[#0B192C] text-sky-300",
    calloutBar:
      "bg-gradient-to-r from-[#0B192C] to-slate-900 text-sky-200 border-l-4 border-sky-500",
    accentDot: "bg-sky-500",
  },
  "architect-obsidian": {
    heroBg:
      "bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white",
    canvasBg: "bg-zinc-50 text-zinc-900",
    actBadge: "text-indigo-600 bg-indigo-500/10 border-indigo-500/30",
    speakerPill: "bg-zinc-900 text-indigo-300 border-indigo-500/30",
    cardBorder: "border-zinc-200 hover:border-indigo-500/50",
    cardBadge: "text-indigo-700 bg-indigo-50 border-indigo-200",
    metricValue: "text-indigo-600",
    tableHeader: "bg-zinc-900 text-indigo-300",
    calloutBar: "bg-zinc-900 text-indigo-200 border-l-4 border-indigo-500",
    accentDot: "bg-indigo-600",
  },
  "emerald-executive": {
    heroBg:
      "bg-gradient-to-br from-[#022C22] via-[#064E3B] to-slate-900 text-white",
    canvasBg: "bg-[#F8FAFC] text-slate-900",
    actBadge: "text-emerald-700 bg-emerald-500/10 border-emerald-500/30",
    speakerPill: "bg-[#064E3B] text-emerald-300 border-emerald-500/30",
    cardBorder: "border-slate-200 hover:border-emerald-500/50",
    cardBadge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    metricValue: "text-emerald-600",
    tableHeader: "bg-[#064E3B] text-emerald-200",
    calloutBar: "bg-[#064E3B] text-emerald-100 border-l-4 border-emerald-400",
    accentDot: "bg-emerald-600",
  },
};

export function SlidePreview({
  slide,
  presentation,
  currentIndex,
  totalSlides,
}: SlidePreviewProps) {
  const theme =
    THEME_STYLES[presentation.theme] || THEME_STYLES["luxury-gold"];

  const effectiveCards =
    slide.cards && slide.cards.length > 0
      ? slide.cards
      : slide.bulletPoints &&
        slide.bulletPoints.length > 0 &&
        (slide.layout === "cards" || slide.layout === "flow")
      ? slide.bulletPoints.map((bp, i) => {
          const parts = bp.replace(/^•\s*/, "").split(":");
          return {
            badge: `0${i + 1}`,
            title: parts[0]?.trim() || `Point ${i + 1}`,
            description: parts.slice(1).join(":").trim() || parts[0]?.trim(),
            items: [],
          };
        })
      : [];

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-xl mx-auto";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-3";
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* TRUE 16:9 POWERPOINT SLIDE FRAME */}
      <div className="w-full aspect-[16/9] rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85)] overflow-hidden relative border border-white/20 flex flex-col transition-all duration-300">
        {slide.layout === "title" ? (
          /* ================= SLIDE 1: MASTER'S THESIS COVER (16:9) ================= */
          <div
            className={`w-full h-full px-7 py-6 md:px-10 md:py-8 flex flex-col justify-between relative overflow-hidden ${theme.heroBg}`}
          >
            {/* Subtle Architectural Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-[0.16em] bg-amber-500/15 text-amber-300 border border-amber-400/30 shrink-0">
                <Award className="w-3.5 h-3.5" />
                {slide.act || "MASTER’S THESIS DEFENSE · 2026"}
              </span>
              <span className="text-[10px] md:text-xs font-medium text-slate-300 bg-white/5 px-3 py-1 rounded-lg border border-white/10 truncate">
                {presentation.program}
              </span>
            </div>

            {/* Center Title */}
            <div className="relative z-10 my-auto py-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.15] text-white max-w-4xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-2.5 text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 font-light max-w-3xl leading-snug">
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Bottom Metadata Grid */}
            <div className="relative z-10 grid grid-cols-3 gap-3 pt-3 border-t border-white/15">
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-2.5 md:p-3 border border-white/10">
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-0.5">
                  Presented By
                </p>
                <p className="text-xs md:text-sm font-bold text-white truncate">
                  {presentation.candidates}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Procurement & Production Planning
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-lg p-2.5 md:p-3 border border-white/10">
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-0.5">
                  Supervised By
                </p>
                <p className="text-[11px] md:text-xs font-semibold text-white truncate">
                  Prof. Mohamed Mamad{" "}
                  <span className="text-slate-400 font-normal">(Academic)</span>
                </p>
                <p className="text-[11px] md:text-xs font-semibold text-white truncate mt-0.5">
                  Younes Benrkiya{" "}
                  <span className="text-slate-400 font-normal">(Internship)</span>
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-lg p-2.5 md:p-3 border border-white/10 flex flex-col justify-between">
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-0.5">
                  Institutions
                </p>
                <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-white truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Ibn Tofail University</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-slate-200 truncate mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Kromberg & Schubert (K3)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= EXECUTIVE CONTENT SLIDES (2 to 21) ================= */
          <div
            className={`w-full h-full px-6 py-4 md:px-8 md:py-5 flex flex-col justify-between overflow-y-auto ${theme.canvasBg}`}
          >
            {/* Top Header */}
            <div className="shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                {slide.act && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest border ${theme.actBadge}`}
                  >
                    {slide.act}
                  </span>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {slide.speaker && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${theme.speakerPill}`}
                    >
                      {slide.speaker.includes("&") ? (
                        <Users className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {slide.speaker}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-[11px] md:text-xs text-slate-500 font-medium line-clamp-1">
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Dynamic Middle Body */}
            <div className="my-auto py-2 flex-1 flex flex-col justify-center">
              {/* 1. METRICS LAYOUT */}
              {slide.layout === "metrics" && slide.metrics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {slide.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between"
                    >
                      <div
                        className={`h-1 w-10 rounded-full mb-1.5 ${theme.accentDot}`}
                      />
                      <div
                        className={`text-xl md:text-2xl lg:text-3xl font-black tracking-tight ${theme.metricValue}`}
                      >
                        {m.value}
                      </div>
                      <div className="text-[11px] md:text-xs font-bold text-slate-800 mt-1">
                        {m.label}
                      </div>
                      {m.sublabel && (
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          {m.sublabel}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 2. TABLE LAYOUT */}
              {slide.layout === "table" && slide.table && (
                <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={theme.tableHeader}>
                        {slide.table.headers.map((h, i) => (
                          <th
                            key={i}
                            className="py-1.5 px-2.5 text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider border-r border-white/10 last:border-0"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[10px] md:text-[11px]">
                      {slide.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={
                            rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/80"
                          }
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-1.5 px-2.5 leading-snug ${
                                cIdx === 0
                                  ? "font-bold text-slate-900"
                                  : "text-slate-700"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. CARDS OR FLOW LAYOUT */}
              {(slide.layout === "cards" || slide.layout === "flow") &&
                effectiveCards.length > 0 && (
                  <div className="space-y-2.5">
                    <div
                      className={`grid gap-2.5 ${getGridCols(
                        effectiveCards.length
                      )}`}
                    >
                      {effectiveCards.map((c, idx) => (
                        <div
                          key={idx}
                          className={`bg-white rounded-xl p-3 border shadow-sm transition-all flex flex-col justify-between ${theme.cardBorder}`}
                        >
                          <div>
                            {c.badge && (
                              <span
                                className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border mb-1 ${theme.cardBadge}`}
                              >
                                {c.badge}
                              </span>
                            )}
                            <h3 className="text-xs font-bold text-slate-900 leading-snug">
                              {c.title}
                            </h3>
                            <p className="text-[10px] md:text-[11px] text-slate-600 mt-0.5 leading-snug">
                              {c.description}
                            </p>
                          </div>

                          {c.items && c.items.length > 0 && (
                            <ul className="mt-1.5 pt-1.5 border-t border-slate-100 space-y-0.5">
                              {c.items.map((it, i) => (
                                <li
                                  key={i}
                                  className="text-[10px] text-slate-700 flex items-start gap-1.5 leading-snug"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${theme.accentDot}`}
                                  />
                                  <span>{it}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    {slide.layout === "flow" &&
                      slide.bulletPoints &&
                      slide.bulletPoints.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                          {slide.bulletPoints.map((step, idx) => (
                            <React.Fragment key={idx}>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  idx === 0
                                    ? "bg-amber-500 text-slate-950"
                                    : "bg-white text-slate-700 border border-slate-200"
                                }`}
                              >
                                {step}
                              </span>
                              {idx < slide.bulletPoints.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                  </div>
                )}

              {/* 4. COLUMNS OR CLOSING LAYOUT */}
              {(slide.layout === "columns" || slide.layout === "closing") && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-1.5">
                    {slide.bulletPoints.map((pt, i) => (
                      <div
                        key={i}
                        className={`text-[10px] md:text-[11px] leading-snug flex items-start gap-1.5 ${
                          i === 0 && pt.endsWith(":")
                            ? "font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-100"
                            : "text-slate-700"
                        }`}
                      >
                        {!(i === 0 && pt.endsWith(":")) && (
                          <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <span>{pt.replace(/^•\s*/, "")}</span>
                      </div>
                    ))}
                  </div>

                  {slide.secondaryColumn &&
                    slide.secondaryColumn.length > 0 && (
                      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-1.5">
                        {slide.secondaryColumn.map((pt, i) => (
                          <div
                            key={i}
                            className={`text-[10px] md:text-[11px] leading-snug flex items-start gap-1.5 ${
                              i === 0 && pt.endsWith(":")
                                ? "font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-100"
                                : "text-slate-700"
                            }`}
                          >
                            {!(i === 0 && pt.endsWith(":")) && (
                              <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0 mt-0.5" />
                            )}
                            <span>{pt.replace(/^•\s*/, "")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Bottom Callout + Slide Footer */}
            <div className="space-y-1.5 pt-1 shrink-0">
              {slide.bottomCallout && (
                <div
                  className={`px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-semibold shadow-sm ${theme.calloutBar}`}
                >
                  {slide.bottomCallout}
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] md:text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-200/80">
                <span>
                  Wijdane Laaguidi · Salma Lsilis — Master&apos;s Thesis Defense
                  2026 (K&S Plant K3)
                </span>
                <span className="font-bold text-slate-600">
                  Slide {currentIndex + 1} / {totalSlides}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Oral Defense Teleprompter & Speaker Notes */}
      {slide.speakerNotes && (
        <div className="w-full mt-3 bg-slate-900/90 backdrop-blur border border-amber-500/20 rounded-xl px-4 py-3 text-xs shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3" />
              Discours Oral & Notes Jury — {slide.speaker}
            </span>
            {slide.durationMinutes && (
              <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                <Clock className="w-3 h-3" /> ~{slide.durationMinutes} min
              </span>
            )}
          </div>
          <p className="text-slate-200 leading-relaxed text-xs font-normal">
            {slide.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
}
