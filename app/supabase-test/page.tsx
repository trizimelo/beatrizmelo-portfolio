import sql from '../../db'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function ensureTodosTable(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    await sql`
      create table if not exists public.todos (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        created_at timestamptz default now()
      )
    `

    await sql`
      create policy if not exists "allow_public_read" on public.todos
      for select using (true)
    `

    await sql`
      create policy if not exists "allow_public_insert" on public.todos
      for insert with check (true)
    `

    const { data: existingTodos, error } = await supabase.from('todos').select('id, name')

    if (!error && (!existingTodos || existingTodos.length === 0)) {
      await supabase.from('todos').insert({ name: 'Registro criado via app' })
    }
  } catch {
    // Ignore initialization errors and surface them through the page status.
  }
}

export default async function SupabaseTestPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await ensureTodosTable(supabase)

  const { data: todos, error } = await supabase.from('todos').select('id, name')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Teste do Supabase</h1>
      <p className="mt-2 text-gray-600">Status: {error ? 'Erro ao consultar' : 'Conexão OK'}</p>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error.message || JSON.stringify(error)}
        </p>
      )}

      <ul className="mt-6 space-y-2">
        {(todos || []).map((todo: { id: string; name: string }) => (
          <li key={todo.id} className="rounded border p-3">
            {todo.name}
          </li>
        ))}
      </ul>
    </main>
  )
}
