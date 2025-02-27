import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  client: {
    PUBLIC_SUPABASE_URL: z.string().url(),
    PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  clientPrefix: 'PUBLIC_',
  runtimeEnv: {
    PUBLIC_SUPABASE_URL: import.meta.env['PUBLIC_SUPABASE_URL'],
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env['PUBLIC_SUPABASE_ANON_KEY'],
  },
  emptyStringAsUndefined: true,
})
