// File: app/katalog/page.tsx (atau lokasi KatalogPage kamu)
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma"; // Mengambil instance Prisma [cite: 2026-03-08]

export default async function KatalogPage() {
  // Ambil data produk secara real-time dari Supabase [cite: 2026-02-08, 2026-03-08]
  const dataFromDb = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Katalog Produk</h2>
        <p className="text-slate-500">Pilih barang kebutuhanmu hari ini.</p>
      </div>

      {/* Kirim data dari database ke ProductGrid melalui props [cite: 2026-03-08] */}
      <ProductGrid initialProducts={dataFromDb} />
    </main>
  );
}
