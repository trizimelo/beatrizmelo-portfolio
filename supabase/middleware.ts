import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
  'https://placeholder.supabase.co'

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.STORAGE_SUPABASE_ANON_KEY ||
  'placeholder-key'

export const createClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      // 🚀 Tipagem explícita adicionada para o TypeScript não reclamar
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  return { supabase, response }
}