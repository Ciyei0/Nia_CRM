import { createClient } from "@supabase/supabase-js";
import dns from "dns";

// Forzamos a Node a resolver primero IPv4 para evitar el error "fetch failed" en VPS con IPv6 roto
dns.setDefaultResultOrder("ipv4first");

const supabaseUrl = process.env.SUPABASE_URL || "https://your-project-ref.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbG...";

// Creamos un cliente con la Service Role Key para poder manejar usuarios independientemente de las reglas RLS de Supabase.
// Este cliente solo debe ser usado en el Backend, porque ignora las políticas de seguridad de Row Level Security.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
