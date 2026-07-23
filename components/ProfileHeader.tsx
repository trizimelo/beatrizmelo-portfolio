type ProfileHeaderProps = {
  name: string;
  role: string;
  bio?: string | null;
};

export default function ProfileHeader({ name, role, bio }: ProfileHeaderProps) {
  return (
    <header className="border-b border-blueprint-line/30 bg-grid bg-grid bg-blueprint-dark">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueprint-line">
          Portfólio técnico · Rev. 01
        </p>
        <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.95] text-paper sm:text-7xl">
          {name}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-0 border border-blueprint-line/40 sm:grid-cols-3">
          <div className="crop-mark border-b border-blueprint-line/40 p-4 sm:border-b-0 sm:border-r">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
              Cargo
            </p>
            <p className="mt-1 font-body text-lg text-paper">{role}</p>
          </div>
          <div className="crop-mark border-b border-blueprint-line/40 p-4 sm:col-span-2 sm:border-b-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint-line">
              Descrição
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-paper/90">
              {bio && bio.trim().length > 0
                ? bio
                : "Bio em construção — em breve por aqui."}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
