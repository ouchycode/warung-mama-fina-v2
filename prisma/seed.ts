import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Memulai proses seeding...");

  // hapus data lama
  await prisma.product.deleteMany();

  // masukkan data produk
  await prisma.product.createMany({
    data: [
      {
        name: "Sambal Cumi Pedas",
        price: 35000,
        stock: 50,
        image:
          "https://vclmowmpxvlypueqzvbe.supabase.co/storage/v1/object/public/products/sambal-cumi.jpg",
      },
      {
        name: "Teri Kacang Balado",
        price: 30000,
        stock: 30,
        image:
          "https://vclmowmpxvlypueqzvbe.supabase.co/storage/v1/object/public/products/teri.jpg",
      },
      {
        name: "Bawang Goreng Crispy",
        price: 25000,
        stock: 100,
        image:
          "https://vclmowmpxvlypueqzvbe.supabase.co/storage/v1/object/public/products/bawang.jpg",
      },
    ],
  });

  console.log("✅ Data produk berhasil dimasukkan!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
