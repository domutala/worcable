import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
function useSupabase() {
  const runtime = useRuntimeConfig();
  const supabaseUrl = "https://kabfpeodsflbyoauycxz.supabase.co";
  const supabase = createClient(supabaseUrl, runtime.supabaseApiKey);

  return supabase;
}

export const supabase = useSupabase();
