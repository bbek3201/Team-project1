// Demo donation seeder — run with:
//   node --env-file=.env --env-file=.env.local prisma/seed-donations.mjs
// Seeds sample transactions for RECIPIENT_ID so the dashboard has data to show.
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const RECIPIENT_ID = 2; // myngaa — change to the account you log in as

const LONG =
  "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment. When I become successful I will be sure to buy you more gifts and donations. Thank you again.";

const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000);

const rows = [
  { amount: 1, donerId: 9001, socialURLOrBuyMeACoffee: "instagram.com/welesley", specialMessage: "Thank you for being so awesome everyday! You always manage to brighten up my day when I'm feeling down. Although $1 isn't that much money it's all I can contribute at the moment", createdAt: hoursAgo(10) },
  { amount: 10, donerId: 1, socialURLOrBuyMeACoffee: "buymeacoffee.com/bdsadas", specialMessage: "Thank you for being so awesome everyday!", createdAt: hoursAgo(10.2) },
  { amount: 2, donerId: 9002, socialURLOrBuyMeACoffee: "buymeacoffee.com/gkfgrew", specialMessage: "", createdAt: hoursAgo(10.4) },
  { amount: 5, donerId: 9003, socialURLOrBuyMeACoffee: "facebook.com/penelopeb", specialMessage: "", createdAt: hoursAgo(10.6) },
  { amount: 10, donerId: 3, socialURLOrBuyMeACoffee: "buymeacoffee.com/supporterone", specialMessage: LONG, createdAt: hoursAgo(10.8) },
  { amount: 1, donerId: 9001, socialURLOrBuyMeACoffee: "instagram.com/welesley", specialMessage: "", createdAt: hoursAgo(11) },
];

async function main() {
  await prisma.donation.deleteMany({ where: { recipientId: RECIPIENT_ID } });
  for (const r of rows) {
    await prisma.donation.create({ data: { ...r, recipientId: RECIPIENT_ID } });
  }
  const count = await prisma.donation.count({ where: { recipientId: RECIPIENT_ID } });
  console.log(`Seeded ${count} donations for recipientId=${RECIPIENT_ID}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
