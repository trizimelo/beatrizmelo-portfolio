import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackProfile, updateFallbackProfile } from "@/lib/fallback-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(getFallbackProfile());
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, role, bio } = body as {
      id: string;
      name: string;
      role: string;
      bio: string;
    };

    const profile = await prisma.profile.update({
      where: { id },
      data: { name, role, bio },
    });

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(updateFallbackProfile(await req.json()));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, bio } = body as {
      name?: string;
      role?: string;
      bio?: string;
    };

    if (!name || !role) {
      return NextResponse.json(
        { error: "Nome e função são obrigatórios." },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        name,
        role,
        bio: bio ?? null,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json(getFallbackProfile(), { status: 201 });
  }
}
