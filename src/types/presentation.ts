export type Speaker = "Wijdane" | "Salma" | "Wijdane & Salma" | "Présentateur";

export type SlideLayout = "title" | "section" | "content" | "two-columns" | "metrics" | "conclusion";

export interface Slide {
  id: string;
  slideNumber: number;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  secondaryColumn?: string[];
  metrics?: { label: string; value: string; description?: string }[];
  speakerNotes: string;
  speaker: Speaker;
  durationMinutes?: number;
}

export interface PresentationData {
  topic: string;
  candidates: string; // e.g. "Wijdane & Salma"
  institution: string; // e.g. "Faculté des Sciences / École d'Ingénieurs"
  jury?: string;
  supervisor?: string;
  date?: string;
  theme: "academic-blue" | "emerald" | "slate" | "purple";
  slides: Slide[];
}
