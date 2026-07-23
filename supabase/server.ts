import { createServerClient } from '@supabase/ssr'

export async function createClient(cookieStore: any) {
  const url = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL || 
    'https://placeholder.supabase.co'

  const key = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.STORAGE_SUPABASE_ANON_KEY || 
    'placeholder'

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignorado em Server Components
        }
      },
    },
  })
}