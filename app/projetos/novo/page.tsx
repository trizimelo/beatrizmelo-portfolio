import { prisma } from "@/lib/prisma";
import { getFallbackTags } from "@/lib/fallback-store";
import ProjectForm from "@/components/ProjectForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NovoProjeto() {
  let tags = [] as Array<{ id: string; name: string }>;

  try {
    tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  } catch {
    tags = getFallbackTags();
  }

  return (
    <main className="min-h-screen bg-blueprint-dark bg-grid bg-grid px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-blueprint-line hover:text-accent"
        >
          ← Voltar ao portfólio
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase text-paper">
          Novo card
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-blueprint-line">
          Cadastro de iniciativa
        </p>

        <div className="mt-8">
          <ProjectForm existingTags={tags} />
        </div>
      </div>
    </main>
  );
}
