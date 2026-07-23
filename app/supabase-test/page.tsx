import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function SupabaseTestPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Teste do Supabase</h1>
      <p className="mt-2 text-gray-600">Status: {error ? 'Erro ao consultar' : 'Conexão OK'}</p>

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
