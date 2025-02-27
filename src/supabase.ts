import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
export default supabase
