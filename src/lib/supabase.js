import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qtsbfhgoxwpxqxwdjqym.supabase.co',
  'sb_publishable_cyq67QeAY3w2W6MtrNkLlg_mFCNHXaZ'
)

export const TMDB_KEY = '9e4a16a3d6e9c10f8f85a0f7a9b1e5c2'
export const IMG_BASE = 'https://image.tmdb.org/t/p/'