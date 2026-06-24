import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const me = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { profile: true },
  });

  if (!me) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: me.id,
      name: me.profile?.name ?? me.username,
      avatar: me.profile?.avatarImage ?? "",
      username: me.username,
      email: me.email,
      hasProfile: !!me.profileId,
      hasBankCard: !!me.bankCardId,
    },
  });
}
