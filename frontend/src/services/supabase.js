import { createClient } from "@supabase/supabase-js";

// Por favor, define estas variables de entorno en tu .env del frontend
// Ej: REACT_APP_SUPABASE_URL=https://...
// REACT_APP_SUPABASE_ANON_KEY=ey...
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://tusupabase.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJ...";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
