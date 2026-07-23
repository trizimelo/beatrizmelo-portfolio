"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ExistingTag = { id: string; name: string };

type LinkField = { label: string; url: string };

export default function ProjectForm({
  existingTags,
}: {
  existingTags: ExistingTag[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [execution, setExecution] = useState("");
  const [learning, setLearning] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [links, setLinks] = useState<LinkField[]>([{ label: "", url: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  }

  function addNewTag() {
    const trimmed = newTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
    }
    setNewTag("");
  }

  function updateLink(index: number, field: keyof LinkField, value: string) {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  }

  function addLinkField() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLinkField(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          context,
          execution,
          learning,
          tags: selectedTags,
          links: links.filter((l) => l.label && l.url),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar o card.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass =
    "font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line";
  const inputClass =
    "mt-1 w-full border border-blueprint-line/40 bg-blueprint-dark px-3 py-2 text-paper placeholder:text-paper/30 focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="crop-mark flex flex-col gap-6 border border-blueprint-line/30 bg-blueprint p-8"
    >
      <div>
        <label className={labelClass} htmlFor="name">
          Nome da iniciativa
        </label>
        <input
          id="name"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="context">
          Contexto (em que ela se inseria)
        </label>
        <textarea
          id="context"
          className={inputClass}
          rows={3}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="execution">
          Execução (o que você fez)
        </label>
        <textarea
          id="execution"
          className={inputClass}
          rows={3}
          value={execution}
          onChange={(e) => setExecution(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="learning">
          Aprendizado
        </label>
        <textarea
          id="learning"
          className={inputClass}
          rows={3}
          value={learning}
          onChange={(e) => setLearning(e.target.value)}
          required
        />
      </div>

      <div>
        <p className={labelClass}>Tags</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {existingTags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`font-mono text-xs uppercase tracking-wide px-3 py-1 border ${
                selectedTags.includes(tag.name)
                  ? "border-accent text-accent"
                  : "border-blueprint-line/40 text-paper/80"
              }`}
            >
              {tag.name}
            </button>
          ))}
          {selectedTags
            .filter((t) => !existingTags.some((et) => et.name === t))
            .map((t) => (
              <span
                key={t}
                className="font-mono text-xs uppercase tracking-wide px-3 py-1 border border-accent text-accent"
              >
                {t}
              </span>
            ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className={inputClass + " mt-0"}
            placeholder="Criar nova tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNewTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addNewTag}
            className="shrink-0 border border-blueprint-line/40 px-4 font-mono text-xs uppercase text-paper/80"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <p className={labelClass}>Links</p>
        <div className="mt-2 flex flex-col gap-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass + " mt-0"}
                placeholder="Rótulo (ex: Repositório)"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
              />
              <input
                className={inputClass + " mt-0"}
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeLinkField(i)}
                className="shrink-0 border border-blueprint-line/40 px-3 font-mono text-xs text-paper/60"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLinkField}
          className="mt-2 font-mono text-xs uppercase tracking-wide text-blueprint-line hover:text-accent"
        >
          + adicionar link
        </button>
      </div>

      {error && (
        <p className="font-mono text-xs text-accent" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-accent px-6 py-3 font-mono text-sm uppercase tracking-wide text-blueprint-dark disabled:opacity-50"
      >
        {submitting ? "Salvando..." : "Salvar card"}
      </button>
    </form>
  );
}
