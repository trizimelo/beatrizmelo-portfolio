import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  } catch (error) {
    console.error("Failed to load projects", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os projetos." },
      { status: 500 }
    );
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

    const uniqueTags = [
      ...new Set((tags || []).map((t) => t?.trim()).filter(Boolean)),
    ];

    const safeLinks = Array.isArray(links)
      ? links.filter((l) => l?.label && l?.url)
      : [];

    const project = await prisma.project.create({
      data: {
        name,
        context,
        execution,
        learning,
        tags: {
          connectOrCreate: uniqueTags.map((t) => ({
            where: { name: t },
            create: { name: t },
          })),
        },
        links: {
          createMany: {
            data: safeLinks,
          },
        },
      },
      include: { tags: true, links: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project", error);
    return NextResponse.json(
      {
        error: "Não foi possível salvar o projeto no banco. Verifique a conexão do banco.",
        ...(process.env.NODE_ENV === "development" && { detail: String(error) }),
      },
      { status: 500 }
    );
  }
}