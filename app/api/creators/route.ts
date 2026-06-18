import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);

  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  const creators = users
    // don't list yourself — you can't donate to your own page
    .filter((u) => u.id !== auth?.userId)
    .map((u) => ({
      username: u.username,
      name: u.profile?.name ?? u.username,
      avatar: u.profile?.avatarImage ?? "",
      about: u.profile?.about ?? "",
    }));

  return NextResponse.json({ creators });
}
