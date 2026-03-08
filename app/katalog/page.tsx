import ProductGrid from "@/components/ProductGrid";

export default function KatalogPage() {
  return (
    <main className="px-4 py-8 max-w-6xl mx-auto pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Katalog Produk</h2>
        <p className="text-slate-500">Pilih barang kebutuhanmu hari ini.</p>
      </div>

      {/* Panggil komponen di sini */}
      <ProductGrid />
    </main>
  );
}
