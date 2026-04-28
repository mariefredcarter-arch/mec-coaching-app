import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qftsuixpcqagycqdsxrc.supabase.co'
const supabaseKey = 'sb_publishable_rrzUyF_dBNkgC-I5u-9xbw_i0Uxfl3J'

export const supabase = createClient(supabaseUrl, supabaseKey)