import { prisma } from "@/lib/prisma";
import ProfileHeader from "@/components/ProfileHeader";
import TagFilter from "@/components/TagFilter";
import ProjectCard from "@/components/ProjectCard";
import { Key } from "react";

interface SearchParams {
  tag?: string;
}

interface Profile {
  name: string | null;
  role: string | null;
  bio: string | null;
}

interface Tag {
  id: string;
  name: string;
}

interface Link {
  id: string;
  url: string;
  label: string;
}

interface Project {
  id: string;
  name: string;
  context: string | null;
  execution: string | null;
  learning: string | null;
  tags: Tag[];
  links: Link[];
}

export const revalidate = 60;

const withTimeout = <T,>(promise: Promise<T>, ms = 1500) =>
  new Promise<T | null>((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });

export default async function Home({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const activeTag = searchParams.tag;

  const [profile, tags, projects] = await Promise.all([
    withTimeout(prisma.profile.findFirst(), 1500),
    withTimeout(
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
      1500,
    ),
    withTimeout(
      prisma.project.findMany({
        where: activeTag ? { tags: { some: { name: activeTag } } } : undefined,
        include: { tags: true, links: true },
        orderBy: { createdAt: "desc" },
      }),
      2000,
    ),
  ]);

  const profileData = (profile ?? null) as Profile | null;
  const tagsData = (tags ?? []) as Tag[];
  const projectsData = (projects ?? []) as Project[];

  return (
    <main className="min-h-screen bg-blueprint-dark">
      <ProfileHeader
        name={profileData?.name ?? "Beatriz Melo"}
        role={profileData?.role ?? "Arquiteta de TI"}
        bio={profileData?.bio}
      />

      <TagFilter tags={tagsData} activeTag={activeTag} />

      <section className="mx-auto max-w-5xl px-6 py-12">
        {projectsData.length === 0 ? (
          <div className="crop-mark border border-dashed border-blueprint-line/40 p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-blueprint-line">
              Nenhum card ainda
            </p>
            <p className="mt-2 text-paper/80">
              Cadastre a primeira iniciativa pelo botão "+ Novo card" acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projectsData.map((project: Project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                context={project.context ?? ""}
                execution={project.execution ?? ""}
                learning={project.learning ?? ""}
                tags={project.tags}
                links={project.links}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
