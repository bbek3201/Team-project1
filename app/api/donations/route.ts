import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { recipientUsername, amount, specialMessage, socialURLOrBuyMeACoffee } =
    await req.json();

  if (!recipientUsername || !amount || !socialURLOrBuyMeACoffee) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const amt = parseInt(String(amount), 10);
  if (Number.isNaN(amt) || amt <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const recipient = await prisma.user.findUnique({
    where: { username: recipientUsername },
  });
  if (!recipient) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }
  if (recipient.id === auth.userId) {
    return NextResponse.json(
      { error: "You can't donate to yourself" },
      { status: 400 },
    );
  }

  const donation = await prisma.donation.create({
    data: {
      amount: amt,
      specialMessage: specialMessage ?? "",
      socialURLOrBuyMeACoffee,
      donerId: auth.userId,
      recipientId: recipient.id,
    },
  });

  await prisma.user.update({
    where: { id: recipient.id },
    data: { receivedDonations: { increment: amt } },
  });

  return NextResponse.json({ ok: true, donation });
}
