import Link from "next/link";

type TagFilterProps = {
  tags: { id: string; name: string }[];
  activeTag?: string;
};

export default function TagFilter({ tags, activeTag }: TagFilterProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-blueprint-line/30 bg-blueprint-dark px-6 py-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
        Filtrar ·
      </span>
      <Link
        href="/"
        className={`font-mono text-xs uppercase tracking-wide px-3 py-1 border ${
          !activeTag
            ? "border-accent text-accent"
            : "border-blueprint-line/40 text-paper/80 hover:border-blueprint-line"
        }`}
      >
        Todos
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/?tag=${encodeURIComponent(tag.name)}`}
          className={`font-mono text-xs uppercase tracking-wide px-3 py-1 border ${
            activeTag === tag.name
              ? "border-accent text-accent"
              : "border-blueprint-line/40 text-paper/80 hover:border-blueprint-line"
          }`}
        >
          {tag.name}
        </Link>
      ))}
      <Link
        href="/projetos/novo"
        className="ml-auto font-mono text-xs uppercase tracking-wide px-3 py-1 bg-accent text-blueprint-dark"
      >
        + Novo card
      </Link>
    </nav>
  );
}
