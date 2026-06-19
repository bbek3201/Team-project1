import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { del } from "@vercel/blob";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

async function deleteBlobIfReplaced(oldUrl?: string | null, newUrl?: string) {
  if (
    !oldUrl ||
    oldUrl === newUrl ||
    !oldUrl.includes(".blob.vercel-storage.com")
  ) {
    return;
  }
  try {
    await del(oldUrl);
  } catch (e) {
    console.error("Failed to delete old avatar blob", e);
  }
}

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const me = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { profile: true, bankCard: true },
  });

  if (!me) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const expiry = me.bankCard?.expiryDate;

  return NextResponse.json({
    profile: {
      name: me.profile?.name ?? "",
      about: me.profile?.about ?? "",
      avatarImage: me.profile?.avatarImage ?? "",
      socialMediaURL: me.profile?.socialMediaURL ?? "",
      successMessage: me.profile?.successMessage ?? "",
    },
    payment: {
      country: me.bankCard?.country ?? "",
      firstName: me.bankCard?.firstName ?? "",
      lastName: me.bankCard?.lastName ?? "",
      cardNumber: me.bankCard?.cardNumber ?? "",
      month: expiry ? expiry.getMonth() + 1 : "",
      year: expiry ? expiry.getFullYear() : "",
    },
  });
}

export async function PATCH(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const section = body.section as string;

  const me = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!me) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (section === "profile" || section === "success") {
    const { name, about, avatarImage, socialMediaURL, successMessage } = body;

    if (me.profileId) {
      const existing = await prisma.profile.findUnique({
        where: { id: me.profileId },
        select: { avatarImage: true },
      });
      await prisma.profile.update({
        where: { id: me.profileId },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(about !== undefined ? { about } : {}),
          ...(avatarImage !== undefined ? { avatarImage } : {}),
          ...(socialMediaURL !== undefined ? { socialMediaURL } : {}),
          ...(successMessage !== undefined ? { successMessage } : {}),
        },
      });
      if (avatarImage !== undefined) {
        await deleteBlobIfReplaced(existing?.avatarImage, avatarImage);
      }
    } else {
      const profile = await prisma.profile.create({
        data: {
          name: name ?? "",
          about: about ?? "",
          avatarImage: avatarImage ?? "",
          socialMediaURL: socialMediaURL ?? "",
          backgroundImage: "",
          successMessage: successMessage ?? "Thank you for your support!",
        },
      });
      await prisma.user.update({
        where: { id: me.id },
        data: { profileId: profile.id },
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (section === "password") {
    const { newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: me.id },
      data: { password: hashed },
    });
    return NextResponse.json({ ok: true });
  }

  if (section === "payment") {
    const { country, firstName, lastName, cardNumber, month, year } = body;
    if (!country || !firstName || !lastName || !cardNumber || !month || !year) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const expiryDate = new Date(Number(year), Number(month) - 1, 1);

    if (me.bankCardId) {
      await prisma.bankCard.update({
        where: { id: me.bankCardId },
        data: { country, firstName, lastName, cardNumber, expiryDate },
      });
    } else {
      const bankCard = await prisma.bankCard.create({
        data: { country, firstName, lastName, cardNumber, expiryDate },
      });
      await prisma.user.update({
        where: { id: me.id },
        data: { bankCardId: bankCard.id },
      });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown section" }, { status: 400 });
}
