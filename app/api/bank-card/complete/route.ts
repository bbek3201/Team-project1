import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { country, firstName, lastName, cardNumber, month, year } =
    await req.json();

  if (!country || !firstName || !lastName || !cardNumber || !month || !year) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const expiryDate = new Date(Number(year), Number(month) - 1, 1);

  const bankCard = await prisma.bankCard.create({
    data: { country, firstName, lastName, cardNumber, expiryDate },
  });

  await prisma.user.update({
    where: { id: auth.userId },
    data: { bankCardId: bankCard.id },
  });

  return NextResponse.json({ ok: true });
}
