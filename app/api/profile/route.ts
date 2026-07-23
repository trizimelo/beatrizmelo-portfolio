import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
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
}
