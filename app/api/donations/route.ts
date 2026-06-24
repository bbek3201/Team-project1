import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const {
    recipientUsername,
    amount,
    specialMessage,
    socialURLOrBuyMeACoffee,
    paymentType,
  } = await req.json();

  if (!recipientUsername || !amount || !socialURLOrBuyMeACoffee) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const method = paymentType === "QPAY" ? "QPAY" : "CARD";

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

  // Card payments succeed immediately; QPay stays pending until the QR link is opened.
  const status = method === "CARD" ? "COMPLETED" : "PENDING";

  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.transaction.create({
      data: { amount: amt, status, paymentType: method },
    });
    await tx.donation.create({
      data: {
        amount: amt,
        specialMessage: specialMessage ?? "",
        socialURLOrBuyMeACoffee,
        donerId: auth.userId,
        recipientId: recipient.id,
        transactionId: created.id,
      },
    });
    if (status === "COMPLETED") {
      await tx.user.update({
        where: { id: recipient.id },
        data: { receivedDonations: { increment: amt } },
      });
    }
    return created;
  });

  return NextResponse.json({
    ok: true,
    transactionId: transaction.id,
    status: transaction.status,
  });
}
