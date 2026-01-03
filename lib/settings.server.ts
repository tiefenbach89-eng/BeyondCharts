<<<<<<< HEAD
import { supabaseServer } from "@/lib/supabase/server";
=======
import fs from "fs/promises";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data/settings.json");
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555

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
<<<<<<< HEAD
  ui: {
    showTicker: boolean;
    showCategoryBadges: boolean;
  };
  admin: {
    allowDrafts: boolean;
  };
};

=======
};

/**
 * Zentrale Default-Settings
 * → garantiert stabile App, selbst wenn settings.json fehlt/kaputt ist
 */
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
export const DEFAULT_SETTINGS: Settings = {
  features: {
    auth: false,
    premium: false,
<<<<<<< HEAD
    premiumCTA: true,
=======
    premiumCTA: false,
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
    paywall: false,
  },
  legal: {
    requireSourceForExternalNews: true,
    showDisclaimer: true,
  },
<<<<<<< HEAD
  ui: {
    showTicker: true,
    showCategoryBadges: true,
  },
  admin: {
    allowDrafts: true,
  },
};

function normalizeSettings(next: any): Settings {
  const n = next || {};
  return {
    features: {
      auth: !!n?.features?.auth,
      premium: !!n?.features?.premium,
      premiumCTA: n?.features?.premiumCTA !== false,
      paywall: !!n?.features?.paywall,
    },
    legal: {
      requireSourceForExternalNews: n?.legal?.requireSourceForExternalNews !== false,
      showDisclaimer: n?.legal?.showDisclaimer !== false,
    },
    ui: {
      showTicker: n?.ui?.showTicker !== false,
      showCategoryBadges: n?.ui?.showCategoryBadges !== false,
    },
    admin: {
      allowDrafts: n?.admin?.allowDrafts !== false,
=======
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
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
    },
  };
}

<<<<<<< HEAD
const SETTINGS_ROW_ID = "global";

export async function getSettings(): Promise<Settings> {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("settings")
    .select("data")
    .eq("id", SETTINGS_ROW_ID)
    .maybeSingle();

  if (error) throw error;

  if (!data?.data) return DEFAULT_SETTINGS;
  return normalizeSettings(data.data);
}

export async function saveSettings(next: Partial<Settings>) {
  const supabase = supabaseServer();
  const existing = await getSettings();
  const merged = normalizeSettings({ ...existing, ...next });

  const { error } = await supabase
    .from("settings")
    .upsert(
      {
        id: SETTINGS_ROW_ID,
        data: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) throw error;

  return merged;
=======
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
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
}
