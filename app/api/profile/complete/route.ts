import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, about, avatarImage, socialMediaURL } = await req.json();

  if (!name || !about || !socialMediaURL) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const profile = await prisma.profile.create({
    data: {
      name,
      about,
      avatarImage: avatarImage || "",
      socialMediaURL,
      backgroundImage: "",
      // Left empty on purpose — the user fills this in the final onboarding
      // step (/success-message) before they go live.
      successMessage: "",
    },
  });

  await prisma.user.update({
    where: { id: auth.userId },
    data: { profileId: profile.id },
  });

  return NextResponse.json({ ok: true });
}
