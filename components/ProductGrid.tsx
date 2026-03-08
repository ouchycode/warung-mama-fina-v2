"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Hapus import products lama, biarkan categories jika masih manual
import { categories } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";

// Tambahkan Interface untuk tipe data produk dari database [cite: 2026-02-08]
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category?: string; // Opsional jika belum ada di schema
}

export default function ProductGrid({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const handleAddToCart = (product: Product) => {
    // Cek stok sebelum tambah [cite: 2026-02-08]
    if (product.stock <= 0) {
      toast.error("Stok habis!");
      return;
    }

    addItem(product);
    toast.success(`${product.name} dimasukkan ke keranjang!`);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const getQty = (id: string) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  // Gunakan initialProducts yang datang dari database [cite: 2026-03-08]
  const filteredProducts =
    activeCategory === "Semua"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* ... (Bagian Header & Filter tetap sama) ... */}

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const qtyInCart = getQty(product.id);
            const isOutOfStock = product.stock <= 0; // Logika stok habis [cite: 2026-02-08]

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
                className={`group flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-shadow overflow-hidden ${
                  isOutOfStock ? "opacity-60" : "hover:border-emerald-200"
                }`}
              >
                {/* Gambar Produk */}
                <div className="relative w-full aspect-square bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
                  {isOutOfStock && (
                    <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-xs">
                        Habis
                      </span>
                    </div>
                  )}
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
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-emerald-600 font-bold text-lg">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Stok: {product.stock}
                    </span>
                  </div>
                  <h3 className="font-medium text-slate-700 text-sm line-clamp-2 leading-snug mb-5">
                    {product.name}
                  </h3>

                  {/* Tombol Tambah */}
                  <div className="mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(product)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                        isOutOfStock
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          : qtyInCart > 0
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
                        {isOutOfStock
                          ? "Stok Habis"
                          : qtyInCart > 0
                            ? `${qtyInCart} di keranjang`
                            : "Tambah"}
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
