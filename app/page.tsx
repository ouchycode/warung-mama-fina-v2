// File: app/page.tsx
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma"; // Pastikan kamu sudah buat file lib/prisma.ts [cite: 2026-03-08]

export default async function Home() {
  // Ambil data produk asli dari database Supabase [cite: 2026-02-08, 2026-03-08]
  const dataFromDb = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc", // Urutkan dari yang terbaru [cite: 2026-03-08]
    },
  });

  return (
    <div>
      <Hero />
      {/* Kirim data hasil query ke komponen ProductGrid [cite: 2026-03-08] */}
      <ProductGrid initialProducts={dataFromDb} />
    </div>
  );
}
