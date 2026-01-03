// types/analyse.ts

/**
 * Snapshot-Daten für die Metric Cards
 */
export interface AnalyseSnapshot {
  thesis?: string;
  profitability?: string;
  substance?: string;
  risk?: string;
}

/**
 * Deep Dive Struktur (optional)
 */
export interface AnalysisDeepDive {
  overview?: string;
  businessModel?: string;
  risks?: string;
  scenarios?: string;
}

/**
 * Base Content Type (aus content.server.ts)
 */
export type ContentStatus = "draft" | "published";
export type AuditStatus = "pending" | "approved";

/**
 * Haupt-Interface für eine Analyse (kompatibel mit AnalysisItem)
 */
export interface Analyse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  
  // Image handling
  imageUrl?: string;
  image?: string;
  imageSource?: string;
  
  // Metadata
  tags: string[];
  isPremium: boolean;
  status: ContentStatus;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Audit
  auditStatus: AuditStatus;
  auditNotes?: string;
  auditedAt?: string;
  
  // Analysis specific
  category: string;
  analysis?: AnalysisDeepDive;
  
  // Optional fields für UI
  ticker?: string;
  author?: string;
  
  // Strukturierte Daten (custom)
  snapshot?: AnalyseSnapshot;
}

/**
 * Parsed Content Structure
 */
export interface ContentSection {
  title: string;
  paragraphs: string[];
}

export interface ParsedContent {
  sections: ContentSection[];
}

/**
 * Props für die AnalyseView Component
 */
export interface AnalyseViewProps {
  item: Analyse;
}

/**
 * Props für MetricCard Component
 */
export interface MetricCardProps {
  label: string;
  value?: string;
  icon: React.ReactNode;
  gradient: string;
  isRisk?: boolean;
}

/**
 * Props für InfoRow Component
 */
export interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

/**
 * Props für StatBox Component
 */
export interface StatBoxProps {
  label: string;
  value: string;
}