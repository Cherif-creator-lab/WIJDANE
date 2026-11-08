"use client";

import React, { useState, useRef, useEffect } from "react";
import { Slide, PresentationData, ChatMessage, Speaker } from "@/types/presentation";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Sliders,
  MessageSquare,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface ClaudeChatbotProps {
  currentSlide: Slide;
  presentation: PresentationData;
  onApplyChatbotAction?: (action: {
    updatedSlide?: Slide;
    newSlide?: Slide;
    theme?: PresentationData["theme"];
  }) => void;
  onUpdateCurrentSlide: (updated: Slide) => void;
  onAddNewSlide: (newSlide: Slide) => void;
  onThemeChange: (theme: PresentationData["theme"]) => void;
}

export function ClaudeChatbot({
  currentSlide,
  presentation,
  onApplyChatbotAction,
  onUpdateCurrentSlide,
  onAddNewSlide,
  onThemeChange,
}: ClaudeChatbotProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "manual">("chat");
  const [preferredModel, setPreferredModel] = useState<string>("claude-opus-4.8");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bienvenue sur **Wijdane LAAGUIDI — Hakma La Zone** ✨\n\nJe suis votre Architecte IA **Claude Opus** connecté à votre clé `.env`.\nLes **21 slides officielles** de votre soutenance (*Mercedes-Benz VAN Program · K&S Plant K3*) sont chargées.\n\nDemandez-moi de modifier la slide affichée, traduire, enrichir vos notes d'oral ou préparer les réponses au jury !",
      timestamp: "Prêt",
      modelUsed: "claude-opus-4.8",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setIsLoading(true);

    try {
      const allSlidesSummary = presentation.slides.map((s) => ({
        slideNumber: s.slideNumber,
        act: s.act,
        title: s.title,
        layout: s.layout,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          currentSlide,
          allSlidesSummary,
          preferredModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de communication avec Claude Opus.");
      }

      const updatedSlideNumbers: number[] = [];

      let updatedSlidePayload: Slide | undefined;
      let newSlidePayload: Slide | undefined;
      let themePayload: PresentationData["theme"] | undefined;

      if (
        data.updatedCurrentSlide &&
        (data.updatedCurrentSlide.title ||
          data.updatedCurrentSlide.subtitle ||
          data.updatedCurrentSlide.cards ||
          data.updatedCurrentSlide.bulletPoints ||
          data.updatedCurrentSlide.bottomCallout ||
          data.updatedCurrentSlide.speakerNotes)
      ) {
        updatedSlidePayload = {
          ...currentSlide,
          ...data.updatedCurrentSlide,
          id: currentSlide.id,
          slideNumber: currentSlide.slideNumber,
        };
        updatedSlideNumbers.push(currentSlide.slideNumber);
      }

      if (data.newSlide && data.newSlide.title) {
        newSlidePayload = data.newSlide;
      }

      if (data.themeChange) {
        themePayload = data.themeChange;
      }

      if (onApplyChatbotAction) {
        onApplyChatbotAction({
          updatedSlide: updatedSlidePayload,
          newSlide: newSlidePayload,
          theme: themePayload,
        });
      } else {
        if (updatedSlidePayload) onUpdateCurrentSlide(updatedSlidePayload);
        if (newSlidePayload) onAddNewSlide(newSlidePayload);
        if (themePayload) onThemeChange(themePayload);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Modification appliquée avec succès sur la slide.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.modelUsed || preferredModel,
        updatedSlideNumbers,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Erreur : ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Traduis cette slide en Français",
    "Remets cette slide en Anglais",
    "Enrichis le discours oral de Wijdane",
    "Quelles questions le jury peut poser ici ?",
    "Rends le titre plus impactant",
  ];

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] border-l border-white/10">
      {/* Top Tabs + Model Selector */}
      <div className="p-3.5 border-b border-white/10 bg-[#070A12] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Bot className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white tracking-wide uppercase">
                Claude Opus Architect
              </h3>
              <p className="text-[10px] text-amber-400 font-medium">
                Slide active : #{currentSlide.slideNumber}
              </p>
            </div>
          </div>

          {/* Model selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1">
            <Cpu className="w-3 h-3 text-amber-400" />
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="claude-opus-4.8" className="bg-slate-900">
                Claude Opus 4.8 (Stable)
              </option>
              <option value="claude-opus-5" className="bg-slate-900">
                Claude Opus 5
              </option>
              <option value="claude-sonnet-5.5" className="bg-slate-900">
                Claude Sonnet 5.5
              </option>
            </select>
          </div>
        </div>

        {/* Switch Chat vs Manual Editor */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "chat"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chatbot IA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "manual"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Édition Manuelle
          </button>
        </div>
      </div>

      {activeTab === "chat" ? (
        /* ================= CHATBOT TAB ================= */
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {m.role === "assistant" ? (
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Claude ({m.modelUsed || "Opus"})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Wijdane
                    </span>
                  )}
                  <span className="text-[9px] text-slate-600">{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-amber-500 text-slate-950 font-semibold rounded-br-none"
                      : "bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-md"
                  }`}
                >
                  {m.content}

                  {m.updatedSlideNumbers && m.updatedSlideNumbers.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Slide #{m.updatedSlideNumbers.join(", #")} mise à jour en direct !
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-900/80 border border-amber-500/20 rounded-xl p-3">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Claude Opus analyse et modifie votre présentation...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-white/5 bg-[#080C15]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickActions.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 text-[10px] font-semibold bg-slate-900 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-slate-300 px-2.5 py-1 rounded-full border border-white/10 transition disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/10 bg-[#070A12]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Demander à Claude de modifier la Slide #${currentSlide.slideNumber}...`}
                className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                disabled={isLoading || !input.trim()}
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold disabled:opacity-40 transition shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ================= MANUAL EDITOR TAB ================= */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Speaker Assignment */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              Oratrice de la Slide #{currentSlide.slideNumber}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                ["Wijdane Laaguidi", "Salma Lsilis", "Wijdane & Salma"] as Speaker[]
              ).map((spk) => (
                <button
                  key={spk}
                  type="button"
                  onClick={() =>
                    onUpdateCurrentSlide({ ...currentSlide, speaker: spk })
                  }
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold border transition ${
                    currentSlide.speaker === spk
                      ? "bg-amber-500 border-amber-400 text-slate-950"
                      : "bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {spk}
                </button>
              ))}
            </div>
          </div>

          {/* Act Header */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Acte / Section
            </label>
            <input
              type="text"
              value={currentSlide.act || ""}
              onChange={(e) =>
                onUpdateCurrentSlide({ ...currentSlide, act: e.target.value })
              }
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Titre de la Slide
            </label>
            <textarea
              rows={2}
              value={currentSlide.title}
              onChange={(e) =>
                onUpdateCurrentSlide({ ...currentSlide, title: e.target.value })
              }
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sous-titre
            </label>
            <input
              type="text"
              value={currentSlide.subtitle || ""}
              onChange={(e) =>
                onUpdateCurrentSlide({
                  ...currentSlide,
                  subtitle: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Bottom Callout */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Message Clé en Bas (Callout)
            </label>
            <textarea
              rows={2}
              value={currentSlide.bottomCallout || ""}
              onChange={(e) =>
                onUpdateCurrentSlide({
                  ...currentSlide,
                  bottomCallout: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-amber-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Notes d&apos;Oral (Speech Notes)
            </label>
            <textarea
              rows={4}
              value={currentSlide.speakerNotes || ""}
              onChange={(e) =>
                onUpdateCurrentSlide({
                  ...currentSlide,
                  speakerNotes: e.target.value,
                })
              }
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
