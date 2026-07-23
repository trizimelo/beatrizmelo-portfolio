# Portfólio — Beatriz Melo

Next.js (App Router) + Prisma + Tailwind. Tela estática de portfólio com cards de
projeto filtráveis por tag, e uma tela de cadastro (`/projetos/novo`) para
criar cada card sem mexer no código.

## Estrutura

- `prisma/schema.prisma` — modelos `Profile`, `Project`, `Tag`, `Link`
- `prisma/seed.ts` — cria seu perfil e as 4 tags iniciais (UX Design,
  Engenharia de Software, Frontend, IDP)
- `app/page.tsx` — home: perfil + filtro de tags + grid de cards
- `app/projetos/novo/page.tsx` — formulário de cadastro de card
- `app/api/projects/route.ts` — GET (lista, com `?tag=`) e POST (cria)
- `app/api/profile/route.ts` — GET e PUT do seu perfil
- `components/` — `ProfileHeader`, `ProjectCard`, `TagFilter`, `ProjectForm`

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o banco: copie `.env.example` para `.env` e ajuste
   `DATABASE_URL`. Duas opções:

   - **Postgres** (Supabase/Neon/Railway, gratuito): cole a connection string.
   - **SQLite local** (mais simples pra testar): troque no
     `prisma/schema.prisma` o `provider` de `postgresql` para `sqlite` e use
     `DATABASE_URL="file:./dev.db"`.

3. Crie as tabelas e rode o seed:

   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

4. Suba o projeto:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` para ver o portfólio e
   `http://localhost:3000/projetos/novo` para cadastrar cada card.

## Editar perfil (nome, cargo, bio)

Ainda não há tela de edição de perfil — é rápido de adicionar depois, mas por
enquanto dá pra editar direto via Prisma Studio:

```bash
npx prisma studio
```

Abra a tabela `Profile` e edite o campo `bio` quando tiver o texto pronto.

## Próximos passos sugeridos

- Tela de edição/exclusão de cards (hoje só há criação)
- Tela de edição do perfil
- Upload de imagem de capa por projeto
- Deploy (Vercel para o app + Supabase/Neon para o Postgres)
