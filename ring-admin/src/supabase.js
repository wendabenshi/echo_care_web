import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://nbyahizzsymhmoltutlb.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_uT3f1hvo9JmlzNEMU-6r7Q_OMpI1RYD";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
