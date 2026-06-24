import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "30"; // "30" | "90" | "all"
  const amountsParam = searchParams.get("amounts");
  const amounts = amountsParam
    ? amountsParam
        .split(",")
        .map((n) => parseInt(n, 10))
        .filter((n) => !Number.isNaN(n))
    : [];

  // Recipient (the logged in creator) for the header card
  const me = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { profile: true },
  });

  // Date range filter — only completed donations count (legacy rows have no transaction)
  const where: {
    recipientId: number;
    createdAt?: { gte: Date };
    OR: ({ transaction: { status: string } } | { transactionId: null })[];
  } = {
    recipientId: auth.userId,
    OR: [{ transaction: { status: "COMPLETED" } }, { transactionId: null }],
  };
  if (range !== "all") {
    const days = range === "90" ? 90 : 30;
    where.createdAt = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    };
  }

  const all = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Earnings = sum over the selected range, independent of the amount filter
  const earnings = all.reduce((sum, d) => sum + d.amount, 0);

  // The amount filter only narrows the transaction list
  const filtered = amounts.length
    ? all.filter((d) => amounts.includes(d.amount))
    : all;

  // Resolve donor names / avatars in one query
  const donorIds = [...new Set(filtered.map((d) => d.donerId))];
  const donors = donorIds.length
    ? await prisma.user.findMany({
        where: { id: { in: donorIds } },
        include: { profile: true },
      })
    : [];
  const donorMap = new Map(donors.map((u) => [u.id, u]));

  const transactions = filtered.map((d) => {
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

  return NextResponse.json({
    user: {
      name: me?.profile?.name ?? me?.username ?? "",
      avatar: me?.profile?.avatarImage ?? "",
      username: me?.username ?? "",
    },
    earnings,
    transactions,
  });
}
