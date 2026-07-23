import sql from '../../db'
import { createClient } from '@/supabase/server'

export const dynamic = 'force-dynamic'

async function ensureTodosTable(supabase: any) {
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
  // Verifica se as variáveis de URL do Supabase estão presentes no servidor
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL

  if (!supabaseUrl) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Teste do Supabase</h1>
        <p className="mt-2 text-red-600 font-semibold">
          Erro de Configuração: A variável de ambiente NEXT_PUBLIC_SUPABASE_URL não foi encontrada na Vercel.
        </p>
      </main>
    )
  }

  let todos: { id: string; name: string }[] | null = null
  let error: any = null

  try {
    // 🚀 O createClient() agora lê os cookies internamente sem receber argumentos
    const supabase = await createClient()

    await ensureTodosTable(supabase)

    const response = await supabase.from('todos').select('id, name')
    todos = response.data
    error = response.error
  } catch (err: any) {
    error = err
  }

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