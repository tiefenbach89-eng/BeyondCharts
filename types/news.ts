// types/news.ts

/**
 * Base Content Type (aus content.server.ts)
 */
export type ContentStatus = "draft" | "published";
export type AuditStatus = "pending" | "approved";
export type SourceType = "own" | "external";
export type ImpactLevel = "Low" | "Medium" | "High";

/**
 * Haupt-Interface für News Items
 */
export interface NewsItem {
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
  
  // News specific
  category: string;
<<<<<<< HEAD
  ticker?: string;
=======
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  source: string;
  sourceUrl?: string;
  sourceType: SourceType;
  impact: ImpactLevel;
  
  // Optional für UI
  author?: string;
}

/**
 * Parsed Content Structure für strukturierte News
 */
export interface NewsSection {
  title: string;
  paragraphs: string[];
}

export interface ParsedNewsContent {
  sections: NewsSection[];
}

/**
 * Props für NewsView Component
 */
export interface NewsViewProps {
  item: NewsItem;
}

/**
 * Props für Impact Badge
 */
export interface ImpactBadgeProps {
  level: ImpactLevel;
}

/**
 * Props für Source Info
 */
export interface SourceInfoProps {
  source: string;
  sourceUrl?: string;
  sourceType: SourceType;
}

/**
 * Props für InfoBox Component
 */
export interface InfoBoxProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}