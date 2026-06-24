import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Opening the QR link hits this endpoint, which simulates a successful QPay
// payment: it marks the transaction COMPLETED and credits the recipient once.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { donation: true },
  });
  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (transaction.status === "COMPLETED") {
    return NextResponse.json({ status: "COMPLETED" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    if (transaction.donation) {
      await tx.user.update({
        where: { id: transaction.donation.recipientId },
        data: { receivedDonations: { increment: transaction.donation.amount } },
      });
    }
  });

  return NextResponse.json({ status: "COMPLETED" });
}
