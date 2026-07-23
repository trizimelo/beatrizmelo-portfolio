"use client";

import { useState } from "react";

type ProjectCardProps = {
  name: string;
  context: string;
  execution: string;
  learning: string;
  tags: { id: string; name: string }[];
  links: { id: string; label: string; url: string }[];
};

const MAX_PREVIEW_CHARS = 180;

const truncateText = (value: string, maxChars = MAX_PREVIEW_CHARS) => {
  if (!value) return "";

  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxChars) {
    return normalized;
  }

  return `${normalized.slice(0, maxChars).trimEnd()}…`;
};

export default function ProjectCard({
  name,
  context,
  execution,
  learning,
  tags,
  links,
}: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            <dd className="mt-1 text-paper/90">{truncateText(context)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
              Execução
            </dt>
            <dd className="mt-1 text-paper/90">{truncateText(execution)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
              Aprendizado
            </dt>
            <dd className="mt-1 text-paper/90">{truncateText(learning)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-4 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-accent underline decoration-dotted underline-offset-4"
        >
          Ler tudo
        </button>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded border border-blueprint-line/40 bg-blueprint p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-bold uppercase leading-tight text-paper">
                {name}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line hover:text-accent"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-paper/90">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
                  Contexto
                </h4>
                <p className="mt-1 whitespace-pre-line">{context}</p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
                  Execução
                </h4>
                <p className="mt-1 whitespace-pre-line">{execution}</p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
                  Aprendizado
                </h4>
                <p className="mt-1 whitespace-pre-line">{learning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
