type ProjectCardProps = {
  name: string;
  context: string;
  execution: string;
  learning: string;
  tags: { id: string; name: string }[];
  links: { id: string; label: string; url: string }[];
};

export default function ProjectCard({
  name,
  context,
  execution,
  learning,
  tags,
  links,
}: ProjectCardProps) {
  return (
    <article className="crop-mark flex flex-col border border-blueprint-line/30 bg-blueprint p-6 transition-colors hover:border-accent/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-bold uppercase leading-tight text-paper">
          {name}
        </h3>
      </div>

      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
            Contexto
          </dt>
          <dd className="mt-1 text-paper/90">{context}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
            Execução
          </dt>
          <dd className="mt-1 text-paper/90">{execution}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
            Aprendizado
          </dt>
          <dd className="mt-1 text-paper/90">{learning}</dd>
        </div>
      </dl>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="font-mono text-[10px] uppercase tracking-wide text-accent"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-4 border-t border-blueprint-line/30 pt-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-blueprint-line underline decoration-dotted underline-offset-4 hover:text-accent"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
