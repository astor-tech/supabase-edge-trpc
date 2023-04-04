import { createBrowserSupabaseClient } from '@supabase/auth-helpers-shared';

export const supabase = createBrowserSupabaseClient({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});
