import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addFallbackProject, getFallbackProjects } from "@/lib/fallback-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const tag = req.nextUrl.searchParams.get("tag");

    const projects = await prisma.project.findMany({
      where: tag
        ? { tags: { some: { name: tag } } }
        : undefined,
      include: { tags: true, links: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(getFallbackProjects());
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, context, execution, learning, tags, links } = (body ?? {}) as {
    name?: string;
    context?: string;
    execution?: string;
    learning?: string;
    tags?: string[];
    links?: { label: string; url: string }[];
  };

  try {
    if (!name || !context || !execution || !learning) {
      return NextResponse.json(
        { error: "Nome, contexto, execução e aprendizado são obrigatórios." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        context,
        execution,
        learning,
        tags: {
          connectOrCreate: (tags || [])
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => ({
              where: { name: t },
              create: { name: t },
            })),
        },
        links: {
          createMany: {
            data: (links || []).filter((l) => l.label && l.url),
          },
        },
      },
      include: { tags: true, links: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    const fallbackProject = addFallbackProject({
      name: name ?? "",
      context: context ?? "",
      execution: execution ?? "",
      learning: learning ?? "",
      tags,
      links,
    });

    return NextResponse.json(fallbackProject, { status: 201 });
  }
}
