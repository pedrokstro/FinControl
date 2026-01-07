import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas. Login social ficará indisponível.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true, // Necessário para OAuth PKCE funcionar (salva code_verifier)
    autoRefreshToken: true,
    detectSessionInUrl: false, // Vamos lidar manualmente no AuthCallback
  },
})
