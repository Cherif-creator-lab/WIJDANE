"use client";

import React, { useState } from "react";
import { PresentationData, Slide } from "@/types/presentation";
import { SlidePreview } from "@/components/SlidePreview";
import { SlideEditor } from "@/components/SlideEditor";
import { exportToPptx } from "@/lib/pptx-export";
import {
  Sparkles,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Settings,
  Palette,
  Users,
} from "lucide-react";

const INITIAL_PRESENTATION: PresentationData = {
  topic: "Conception et Développement d'une Plateforme Intelligente d'Automatisation de Processus Métiers",
  candidates: "Wijdane & Salma",
  institution: "Université / Faculté des Sciences et Techniques",
  supervisor: "Pr. Encadrant",
  jury: "Membres du Jury Universitaire",
  theme: "academic-blue",
  slides: [
    {
      id: "slide-1",
      slideNumber: 1,
      layout: "title",
      title: "Conception et Développement d'une Plateforme Intelligente d'Automatisation de Processus Métiers",
      subtitle: "Projet de Fin d'Études en vue de l'obtention du Diplôme",
      bulletPoints: [],
      speaker: "Wijdane & Salma",
      speakerNotes: "Bonjour à tous les membres du jury, à notre encadrant et à l'assistance. Nous avons l'honneur aujourd'hui, Salma et moi-même Wijdane, de vous présenter les travaux menés dans le cadre de notre projet de fin d'études.",
      durationMinutes: 1.5,
    },
    {
      id: "slide-2",
      slideNumber: 2,
      layout: "content",
      title: "Contexte Général & Problématique",
      subtitle: "Constat du secteur et défis identifiés",
      bulletPoints: [
        "Multiplication des tâches répétitives chronophages et à faible valeur ajoutée dans les organisations.",
        "Risque élevé d'erreurs humaines lors des transferts manuels de flux de données hétérogènes.",
        "Manque d'interopérabilité entre les systèmes logiciels préexistants et les nouveaux outils cloud.",
        "Besoin impératif d'une solution unifiée, résiliente et sécurisée pour orchestrer les flux en temps réel.",
      ],
      speaker: "Wijdane",
      speakerNotes: "Pour débuter, je vais aborder le contexte général qui a motivé ce travail. Aujourd'hui, les entreprises perdent un temps précieux dans des saisies et des transferts manuels redondants. Notre étude vise à remédier précisément à ces frictions.",
      durationMinutes: 2,
    },
    {
      id: "slide-3",
      slideNumber: 3,
      layout: "two-columns",
      title: "Objectifs & Périmètre du Projet",
      subtitle: "Cahier des charges et vision de la solution",
      bulletPoints: [
        "Objectifs Fonctionnels :",
        "• Automatisation de bout en bout des flux documentaires.",
        "• Tableau de bord analytique en temps réel pour la supervision.",
        "• Gestion avancée des rôles et contrôle d'accès strict.",
      ],
      secondaryColumn: [
        "Objectifs Techniques :",
        "• Architecture modulaire microservices haute disponibilité.",
        "• Temps de réponse inférieur à 200ms sur les flux critiques.",
        "• Conformité réglementaire et traçabilité complète des logs.",
      ],
      speaker: "Salma",
      speakerNotes: "Comme l'a souligné Wijdane, nous avons défini un périmètre précis. D'un point de vue fonctionnel, la priorité était de garantir une fluidité totale des flux tout en offrant aux décideurs un reporting fidèle.",
      durationMinutes: 2,
    },
    {
      id: "slide-4",
      slideNumber: 4,
      layout: "content",
      title: "Architecture Technique & Choix Technologiques",
      subtitle: "Une conception robuste et évolutive",
      bulletPoints: [
        "Frontend Réactif : Next.js / TypeScript pour une ergonomie optimale et un affichage performant.",
        "API Gateway & Microservices : Orchestration des requêtes asynchrones et découplage logique.",
        "Persistance des Données : Modèle relationnel PostgreSQL pour l'intégrité, complété par Redis pour le cache.",
        "Sécurité & Intégration Continue : Authentification JWT, conteneurisation Docker et pipeline CI/CD automatisé.",
      ],
      speaker: "Salma",
      speakerNotes: "Sur le plan architectural, nous avons privilégié une approche résiliente. Le choix de Next.js combiné à une architecture microservices découplée garantit une scalabilité fluide face à l'accroissement des volumes de données.",
      durationMinutes: 2.5,
    },
    {
      id: "slide-5",
      slideNumber: 5,
      layout: "content",
      title: "Réalisations Clés & Résultats Obtenus",
      subtitle: "Bilan des fonctionnalités déployées et validation",
      bulletPoints: [
        "Gain de productivité mesuré : Réduction de 70% du temps de traitement sur les opérations cibles.",
        "Zéro perte de données observée lors des tests de charge simulée sous 5 000 requêtes concurrentes.",
        "Interface utilisateur intuitive saluée lors de la phase de tests utilisateurs (Score SUS : 86/100).",
        "Traçabilité auditable complète de chaque étape avec génération automatique de rapports conformes.",
      ],
      speaker: "Wijdane",
      speakerNotes: "Je reprends la parole pour vous présenter les résultats concrets. Les campagnes de tests et de validation ont permis de confirmer un gain moyen de 70% sur le délai de traitement, tout en maintenant une stabilité exemplaire.",
      durationMinutes: 2.5,
    },
    {
      id: "slide-6",
      slideNumber: 6,
      layout: "conclusion",
      title: "Conclusion Générale & Perspectives",
      subtitle: "Bilan du projet et pistes d'évolution futures",
      bulletPoints: [
        "Objectifs initiaux pleinement atteints avec une solution opérationnelle et testée.",
        "Apport d'une réelle valeur ajoutée pratique et d'une expertise technique approfondie.",
        "Perspectives : Intégration de modèles prédictifs IA pour anticiper les anomalies de flux.",
        "Merci pour votre bienveillante attention — Place aux questions du jury.",
      ],
      speaker: "Wijdane & Salma",
      speakerNotes: "Pour conclure, ce projet a été une formidable opportunité d'appliquer l'ensemble des compétences acquises tout au long de notre cursus. Nous remercions chaleureusement notre encadrant et les membres du jury pour leur écoute attentive.",
      durationMinutes: 2,
    },
  ],
};

export default function HomePage() {
  const [presentation, setPresentation] = useState<PresentationData>(INITIAL_PRESENTATION);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [topic, setTopic] = useState(presentation.topic);
  const [candidates, setCandidates] = useState(presentation.candidates);
  const [institution, setInstitution] = useState(presentation.institution);
  const [supervisor, setSupervisor] = useState(presentation.supervisor || "");
  const [jury, setJury] = useState(presentation.jury || "");
  const [slideCount, setSlideCount] = useState(10);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];

  const handleUpdateSlide = (updated: Slide) => {
    const updatedSlides = [...presentation.slides];
    updatedSlides[currentSlideIndex] = updated;
    setPresentation({ ...presentation, slides: updatedSlides });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      slideNumber: presentation.slides.length + 1,
      layout: "content",
      title: "Nouvelle Diapositive",
      subtitle: "Sous-titre descriptif",
      bulletPoints: ["Point clé 1", "Point clé 2", "Point clé 3"],
      speaker: "Wijdane",
      speakerNotes: "Notes pour la présentation orale...",
      durationMinutes: 2,
    };
    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide],
    });
    setCurrentSlideIndex(presentation.slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (presentation.slides.length <= 1) return;
    const filtered = presentation.slides.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setPresentation({ ...presentation, slides: renumbered });
    if (currentSlideIndex >= renumbered.length) {
      setCurrentSlideIndex(renumbered.length - 1);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          candidates,
          institution,
          supervisor,
          jury,
          slideCount,
          specialInstructions,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de génération.");
      }

      const generatedData: PresentationData = await res.json();
      setPresentation(generatedData);
      setCurrentSlideIndex(0);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de contacter l'API Claude.");
    } finally {
      setIsGenerating(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
              Soutenance PPT — {presentation.candidates}
            </h1>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
              {presentation.topic}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg p-1 text-xs">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {(["academic-blue", "emerald", "slate", "purple"] as const).map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setPresentation({ ...presentation, theme: th })}
                className={`px-2 py-1 rounded capitalize text-xs font-medium transition ${
                  presentation.theme === th
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {th.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* New / Re-generate button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Nouveau avec Claude</span>
          </button>

          {/* Export PPTX button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Télécharger .PPTX</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Slides Thumbnail Sidebar */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-3 shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Diapositives ({presentation.slides.length})
            </span>
            <button
              type="button"
              onClick={handleAddSlide}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>

          <div className="flex md:flex-col gap-2.5">
            {presentation.slides.map((s, idx) => {
              const active = idx === currentSlideIndex;
              return (
                <div
                  key={s.id || idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`group relative p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    active
                      ? "bg-blue-600/10 border-blue-500 text-white shadow-md shadow-blue-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-blue-400">#{idx + 1}</span>
                    <span className="text-slate-400 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                      {s.speaker || "Wijdane & Salma"}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
                    {s.title || "Sans titre"}
                  </p>

                  {/* Delete button on hover */}
                  {presentation.slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center: Slide Preview */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col items-center justify-start bg-slate-950">
          <div className="w-full max-w-4xl space-y-4">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">
                  Slide {currentSlideIndex + 1} sur {presentation.slides.length}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400">
                  Orateur prévu : <strong>{currentSlide?.speaker}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentSlideIndex === presentation.slides.length - 1}
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min(presentation.slides.length - 1, prev + 1)
                    )
                  }
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide 16:9 View */}
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

        {/* Right: Slide Editor & Claude Assistant */}
        <aside className="w-full md:w-96 border-l border-slate-800 bg-slate-900/70 p-4 md:p-6 overflow-y-auto shrink-0">
          {currentSlide ? (
            <SlideEditor
              slide={currentSlide}
              topic={presentation.topic}
              onUpdate={handleUpdateSlide}
            />
          ) : (
            <div className="text-center text-slate-500 py-12">
              Sélectionnez une diapositive pour commencer l&apos;édition.
            </div>
          )}
        </aside>
      </div>

      {/* Generation Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Générer une soutenance avec Claude AI
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Créez une présentation structurée sur mesure avec répartition orale pour Wijdane et Salma.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Sujet / Titre du PFE ou Mémoire *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex : Plateforme d'analyse prédictive avec apprentissage automatique..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Noms des Candidates
                  </label>
                  <input
                    type="text"
                    value={candidates}
                    onChange={(e) => setCandidates(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Université / École
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Encadrant(e) universitaire / entreprise
                  </label>
                  <input
                    type="text"
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
                    placeholder="Ex : Pr. Nom Prénom"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nombre de diapositives
                  </label>
                  <select
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={8}>8 diapositives (Court / ~12 min)</option>
                    <option value={10}>10 diapositives (Standard / ~15 min)</option>
                    <option value={12}>12 diapositives (~18 min)</option>
                    <option value={15}>15 diapositives (Approfondi / ~22 min)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Consignes spécifiques pour Claude (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Ex : Insister sur l'architecture microservices, donner la parole à Salma sur la partie technique..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération par Claude en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Générer la soutenance
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
