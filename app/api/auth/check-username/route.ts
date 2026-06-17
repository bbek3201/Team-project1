import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username || username.trim().length < 3) {
    return NextResponse.json(
      { available: false, error: "Username must be at least 3 characters" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    return NextResponse.json(
      { available: false, error: "The username is already taken" },
      { status: 409 },
    );
  }

  return NextResponse.json({ available: true });
}
