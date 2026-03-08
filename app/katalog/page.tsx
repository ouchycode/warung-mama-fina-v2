export const dynamic = "force-dynamic";

import ProductGrid from "@/components/ProductGrid";
import prisma from "@/lib/prisma";

export default async function KatalogPage() {
  try {
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

        <ProductGrid initialProducts={dataFromDb} />
      </main>
    );
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return (
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold">Katalog Produk</h2>
        <p className="text-red-500">Gagal memuat produk. Silakan refresh.</p>
      </main>
    );
  }
}
