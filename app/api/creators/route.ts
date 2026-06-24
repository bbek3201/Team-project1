import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);

  const users = await prisma.user.findMany({
    // only list users who finished the complete-profile onboarding step
    where: { profileId: { not: null } },
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
      socialMediaURL:
        u.profile?.socialMediaURL ?? `https://buymeacoffee.com/${u.username}`,
    }));

  return NextResponse.json({ creators });
}
