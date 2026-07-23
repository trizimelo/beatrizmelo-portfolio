import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: "beatriz-melo" },
    update: {},
    create: {
      id: "beatriz-melo",
      name: "Beatriz Melo",
      role: "Arquiteta de TI",
      bio: "",
    },
  });

  const tags = ["UX Design", "Engenharia de Software", "Frontend", "IDP"];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
