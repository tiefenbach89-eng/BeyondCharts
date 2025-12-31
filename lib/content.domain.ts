import type {
  BaseContent,
  AnalysisItem,
  AnalysisDeepDive,
} from "@/lib/content.server";

type ViewMode = "full" | "preview";

export type AnalysisViewModel = {
  item: AnalysisItem;
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
  item: AnalysisItem,
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

  const deepDive: AnalysisDeepDive = {
    overview: item.analysis?.overview,
    businessModel: item.analysis?.businessModel,
    risks: item.analysis?.risks,
    scenarios: item.analysis?.scenarios,
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
