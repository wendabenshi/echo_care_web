const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://nbyahizzsymhmoltutlb.supabase.co";

function resolveSupabaseUrl() {
  const candidates = [
    process.env.SUPABASE_URL,
    process.env.VITE_SUPABASE_URL,
    DEFAULT_SUPABASE_URL,
  ];

  for (const candidate of candidates) {
    const value = String(candidate ?? "").trim();
    if (!value) continue;

    try {
      const parsed = new URL(value);
      if (parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co")) {
        return parsed.origin;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Missing valid Supabase URL");
}

function getSupabaseServerClient() {
  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

module.exports = {
  DEFAULT_SUPABASE_URL,
  resolveSupabaseUrl,
  getSupabaseServerClient,
};
