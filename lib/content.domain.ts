import type { BaseContent } from "@/lib/content.server";
import type { Analyse } from "@/types/analyse";

type ViewMode = "full" | "preview";

// Define AnalysisDeepDive locally since it's not exported
export type AnalysisDeepDive = {
  overview?: string;
  businessModel?: string;
  risks?: string;
  scenarios?: string;
};

export type AnalysisViewModel = {
  item: Analyse;
  content: string;
  mode: ViewMode;
  isLocked: boolean;
  hasDeepDive: boolean;
  analysis: AnalysisDeepDive;
};

function makePreviewText(input: string, maxChars: number): string {
  const raw = (input || "").trim();
  if (!raw) return "";
  if (raw.length <= maxChars) return raw;

  const slice = raw.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const safe = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;

  return safe.trimEnd() + "…";
}

export function buildAnalysisViewModel(
  item: Analyse,
  opts: {
    paywallEnabled: boolean;
    previewChars?: number;
    allowFullAccess?: boolean;
  }
): AnalysisViewModel {
  const previewChars = opts.previewChars ?? 400;

  const isLocked =
    item.isPremium &&
    opts.paywallEnabled &&
    opts.allowFullAccess !== true;

  const itemWithAnalysis = item as any;
  
  const deepDive: AnalysisDeepDive = {
    overview: itemWithAnalysis.analysis?.overview,
    businessModel: itemWithAnalysis.analysis?.businessModel,
    risks: itemWithAnalysis.analysis?.risks,
    scenarios: itemWithAnalysis.analysis?.scenarios,
  };

  const hasDeepDive = Boolean(
    deepDive.overview ||
      deepDive.businessModel ||
      deepDive.risks ||
      deepDive.scenarios
  );

  return {
    item,
    content: isLocked
      ? makePreviewText(item.content, previewChars)
      : item.content,
    mode: isLocked ? "preview" : "full",
    isLocked,
    hasDeepDive,
    analysis: deepDive,
  };
}