import { prisma } from "@/lib/prisma";
import { getFallbackProfile, getFallbackProjects, getFallbackTags } from "@/lib/fallback-store";
import ProfileHeader from "@/components/ProfileHeader";
import TagFilter from "@/components/TagFilter";
import ProjectCard from "@/components/ProjectCard";

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

async function loadHomeData(activeTag?: string) {
  const [profileResult, tagsResult, projectsResult] = await Promise.allSettled([
    prisma.profile.findFirst(),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findMany({
      where: activeTag ? { tags: { some: { name: activeTag } } } : undefined,
      include: { tags: true, links: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (profileResult.status === "rejected") {
    console.error("Failed to load profile", profileResult.reason);
  }

  if (tagsResult.status === "rejected") {
    console.error("Failed to load tags", tagsResult.reason);
  }

  if (projectsResult.status === "rejected") {
    console.error("Failed to load projects", projectsResult.reason);
  }

  return {
    profile: profileResult.status === "fulfilled" ? profileResult.value : null,
    tags: tagsResult.status === "fulfilled" ? tagsResult.value : null,
    projects: projectsResult.status === "fulfilled" ? projectsResult.value : null,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const activeTag = searchParams.tag;
  const { profile, tags, projects } = await loadHomeData(activeTag);

  const profileData = (profile ?? getFallbackProfile()) as Profile | null;
  const tagsData = ((tags ?? getFallbackTags()) as Tag[]).filter(Boolean);
  const projectsData = ((projects ?? getFallbackProjects()) as Project[]).filter(Boolean);

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
