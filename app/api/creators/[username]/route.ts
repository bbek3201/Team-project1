import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    name: user.profile?.name ?? user.username,
    avatar: user.profile?.avatarImage ?? "",
    about: user.profile?.about ?? "",
    socialMediaURL: user.profile?.socialMediaURL ?? "",
    backgroundImage: user.profile?.backgroundImage ?? "",
    successMessage: user.profile?.successMessage ?? "",
  });
}
