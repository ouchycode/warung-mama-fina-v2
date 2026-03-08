"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { products, categories } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

export default function ProductGrid() {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} dimasukkan ke keranjang!`);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const getQty = (id: string) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  // Filter produk berdasarkan kategori aktif
  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* Header & Filter */}
      <div className="mb-10 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Katalog Produk
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pilih barang yang Anda butuhkan hari ini.
          </p>
        </div>

        {/* Tombol Kategori (Bisa di-scroll menyamping di HP) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Produk dengan Animasi Layout Framer Motion */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const qtyInCart = getQty(product.id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-shadow overflow-hidden"
              >
                {/* Gambar Produk */}
                <div className="relative w-full aspect-square bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>

                {/* Detail Produk */}
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-emerald-600 font-bold text-lg mb-1">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <h3 className="font-medium text-slate-700 text-sm line-clamp-2 leading-snug mb-5">
                    {product.name}
                  </h3>

                  {/* Tombol Tambah */}
                  <div className="mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                        qtyInCart > 0
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white"
                      }`}
                    >
                      {addedId === product.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>
                        {qtyInCart > 0 ? `${qtyInCart} di keranjang` : "Tambah"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
