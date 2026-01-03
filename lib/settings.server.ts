import { supabaseServer } from "@/lib/supabase/server";

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
  ui: {
    showTicker: boolean;
    showCategoryBadges: boolean;
  };
  admin: {
    allowDrafts: boolean;
  };
};

export const DEFAULT_SETTINGS: Settings = {
  features: {
    auth: false,
    premium: false,
    premiumCTA: true,
    paywall: false,
  },
  legal: {
    requireSourceForExternalNews: true,
    showDisclaimer: true,
  },
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
    },
  };
}

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
}
