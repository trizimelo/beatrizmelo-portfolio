type ProfileHeaderProps = {
  name: string;
  role: string;
  bio?: string | null;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
};

export default function ProfileHeader({
  name,
  role,
  bio,
  githubUrl = "https://github.com/trizimelo",
  linkedinUrl = "https://www.linkedin.com/in/beatrizddmelo",
  email = "mailto:beatrizdantas2312@gmail.com",
}: ProfileHeaderProps) {
  return (
    <header className="border-b border-blueprint-line/30 bg-blueprint-dark bg-grid">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-blueprint-line">
          Portfólio técnico
        </p>
        <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.95] text-paper sm:text-7xl">
          {name}
        </h1>

        <div className="mt-8 grid grid-cols-1 border border-blueprint-line/40 sm:grid-cols-3">
          <div className="crop-mark border-b border-blueprint-line/40 p-4 sm:border-b-0 sm:border-r">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-blueprint-line">
              Cargo
            </p>
            <p className="mt-1 font-body text-lg text-paper">{role}</p>
          </div>
          <div className="crop-mark border-b border-blueprint-line/40 p-4 sm:col-span-2 sm:border-b-0">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-blueprint-line">
              Descrição
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-paper/90">
              {bio && bio.trim().length > 0
                ? bio
                : "Estudos de caso focados em resolver problemas reais. Para cada projeto, apresento o contexto do desafio, a execução técnica e as principais lições aprendidas ao longo do processo"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blueprint-line/40 bg-blueprint-dark/50 px-3 py-1.5 text-paper/80 transition-colors hover:border-blueprint-line hover:text-paper"
            >
              [ GitHub ]
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blueprint-line/40 bg-blueprint-dark/50 px-3 py-1.5 text-paper/80 transition-colors hover:border-blueprint-line hover:text-paper"
            >
              [ LinkedIn ]
            </a>
          )}
          {email && (
            <a
              href={email.startsWith("mailto:") ? email : `mailto:${email}`}
              className="border border-blueprint-line/40 bg-blueprint-dark/50 px-3 py-1.5 text-paper/80 transition-colors hover:border-blueprint-line hover:text-paper"
            >
              [ Email ]
            </a>
          )}
        </div>
      </div>
    </header>
  );
}