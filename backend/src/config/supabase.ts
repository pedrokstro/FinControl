import { createClient } from '@supabase/supabase-js'
import { config } from '@/config/env'

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn('⚠️ Supabase credentials are missing. Storage operations will fail until they are configured.')
}

export const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    persistSession: false,
  },
})
