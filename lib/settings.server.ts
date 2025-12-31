import fs from "fs/promises";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data/settings.json");

export type Settings = {
  features: {
    auth: boolean;
    premium: boolean;
    premiumCTA: boolean;
    paywall: boolean;
  };
  legal: {
    requireSourceForExternalNews: boolean;
    showDisclaimer: boolean;
  };
};

/**
 * Zentrale Default-Settings
 * → garantiert stabile App, selbst wenn settings.json fehlt/kaputt ist
 */
export const DEFAULT_SETTINGS: Settings = {
  features: {
    auth: false,
    premium: false,
    premiumCTA: false,
    paywall: false,
  },
  legal: {
    requireSourceForExternalNews: true,
    showDisclaimer: true,
  },
};

function normalizeSettings(input: Partial<Settings> | null): Settings {
  return {
    features: {
      auth: Boolean(input?.features?.auth ?? DEFAULT_SETTINGS.features.auth),
      premium: Boolean(input?.features?.premium ?? DEFAULT_SETTINGS.features.premium),
      premiumCTA: Boolean(input?.features?.premiumCTA ?? DEFAULT_SETTINGS.features.premiumCTA),
      paywall: Boolean(input?.features?.paywall ?? DEFAULT_SETTINGS.features.paywall),
    },
    legal: {
      requireSourceForExternalNews: Boolean(
        input?.legal?.requireSourceForExternalNews ??
          DEFAULT_SETTINGS.legal.requireSourceForExternalNews
      ),
      showDisclaimer: Boolean(
        input?.legal?.showDisclaimer ?? DEFAULT_SETTINGS.legal.showDisclaimer
      ),
    },
  };
}

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return normalizeSettings(parsed);
  } catch {
    // Fallback: Default-Settings
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(next: Partial<Settings>) {
  const normalized = normalizeSettings(next);
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(normalized, null, 2));
}
