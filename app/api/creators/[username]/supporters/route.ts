import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const creator = await prisma.user.findUnique({
    where: { username },
  });
  if (!creator) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  const donations = await prisma.donation.findMany({
    where: {
      recipientId: creator.id,
      OR: [{ transaction: { status: "COMPLETED" } }, { transactionId: null }],
    },
    orderBy: { createdAt: "desc" },
  });

  // Donation has a loose `donerId` FK with no Prisma relation, so resolve
  // donor profiles in one extra query.
  const donorIds = [...new Set(donations.map((d) => d.donerId))];
  const donors = donorIds.length
    ? await prisma.user.findMany({
        where: { id: { in: donorIds } },
        include: { profile: true },
      })
    : [];
  const donorMap = new Map(donors.map((u) => [u.id, u]));

  const supporters = donations.map((d) => {
    const donor = donorMap.get(d.donerId);
    return {
      id: d.id,
      name: donor?.profile?.name ?? "Guest",
      avatar: donor?.profile?.avatarImage ?? "",
      socialURL: d.socialURLOrBuyMeACoffee,
      amount: d.amount,
      message: d.specialMessage,
      createdAt: d.createdAt,
    };
  });

  return NextResponse.json({ supporters });
}
