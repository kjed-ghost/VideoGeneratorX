import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://enjkimdilgrpyfvajmfb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iMvnvlSChQyivcb5FPhZLQ_SPsNQ7-l'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
