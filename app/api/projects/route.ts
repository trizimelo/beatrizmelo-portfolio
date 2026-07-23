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
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, context, execution, learning, tags, links } = body as {
      name: string;
      context: string;
      execution: string;
      learning: string;
      tags: string[];
      links: { label: string; url: string }[];
    };

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
    return NextResponse.json({ error: "Falha ao criar o projeto." }, { status: 500 });
  }
}
