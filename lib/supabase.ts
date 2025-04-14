import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvrkedqxajldwbfmnawk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please add NEXT_PUBLIC_SUPABASE_KEY to your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey) 