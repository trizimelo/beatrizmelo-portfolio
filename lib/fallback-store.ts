import { randomUUID } from "crypto";

type FallbackProfile = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FallbackTag = {
  id: string;
  name: string;
};

type FallbackLink = {
  id: string;
  label: string;
  url: string;
  projectId: string;
};

type FallbackProject = {
  id: string;
  name: string;
  context: string | null;
  execution: string | null;
  learning: string | null;
  tags: FallbackTag[];
  links: FallbackLink[];
  createdAt: Date;
  updatedAt: Date;
};

const fallbackProfile: FallbackProfile = {
  id: "fallback-profile",
  name: "Beatriz Melo",
  role: "Arquiteta de TI",
  bio: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const fallbackProjects: FallbackProject[] = [];
const fallbackTagNames = new Set<string>();

export function getFallbackProfile(): FallbackProfile {
  return fallbackProfile;
}

export function updateFallbackProfile(next: Partial<FallbackProfile>) {
  Object.assign(fallbackProfile, next);
  fallbackProfile.updatedAt = new Date();
  return fallbackProfile;
}

export function getFallbackTags(): FallbackTag[] {
  return Array.from(fallbackTagNames)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ id: randomUUID(), name }));
}

export function addFallbackTags(names: string[]) {
  names
    .map((name) => name.trim())
    .filter(Boolean)
    .forEach((name) => fallbackTagNames.add(name));
}

export function getFallbackProjects(): FallbackProject[] {
  return fallbackProjects;
}

export function addFallbackProject(input: {
  name: string;
  context: string;
  execution: string;
  learning: string;
  tags?: string[];
  links?: { label: string; url: string }[];
}): FallbackProject {
  const now = new Date();
  const projectId = randomUUID();
  const tags = (input.tags || [])
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ id: randomUUID(), name }));

  const links = (input.links || [])
    .filter((link) => link.label && link.url)
    .map((link) => ({
      id: randomUUID(),
      label: link.label,
      url: link.url,
      projectId,
    }));

  const project: FallbackProject = {
    id: projectId,
    name: input.name,
    context: input.context,
    execution: input.execution,
    learning: input.learning,
    tags,
    links,
    createdAt: now,
    updatedAt: now,
  };

  addFallbackTags(tags.map((tag) => tag.name));
  fallbackProjects.unshift(project);
  return project;
}
