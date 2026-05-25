import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('MISSING: VITE_SUPABASE_URL');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('MISSING: VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
