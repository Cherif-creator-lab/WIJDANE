export type Speaker = "Wijdane Laaguidi" | "Salma Lsilis" | "Wijdane & Salma";

export type SlideLayout =
  | "title"
  | "cards"
  | "columns"
  | "metrics"
  | "table"
  | "flow"
  | "closing";

export interface SlideCard {
  badge?: string;
  title: string;
  description: string;
  items?: string[];
}

export interface SlideMetric {
  value: string;
  label: string;
  sublabel?: string;
}

export interface SlideTable {
  headers: string[];
  rows: string[][];
}

export interface Slide {
  id: string;
  slideNumber: number;
  act?: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  secondaryColumn?: string[];
  cards?: SlideCard[];
  metrics?: SlideMetric[];
  table?: SlideTable;
  bottomCallout?: string;
  speakerNotes: string;
  speaker: Speaker;
  durationMinutes?: number;
}

export interface PresentationData {
  siteBrand: string;
  topic: string;
  subtitle: string;
  program: string;
  candidates: string;
  supervisors: string;
  institution: string;
  year: string;
  theme: "luxury-gold" | "mercedes-midnight" | "architect-obsidian" | "emerald-executive";
  slides: Slide[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
  updatedSlideNumbers?: number[];
}
