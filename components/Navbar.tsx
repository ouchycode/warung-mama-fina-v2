"use client";

import Link from "next/link";
import { ShoppingBag, Store } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo: Simpel dan Profesional */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-emerald-500 p-1.5 rounded-lg text-white group-hover:bg-emerald-600 transition-colors shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            Mama Fina
          </span>
        </Link>

        {/* Menu & Cart */}
        <div className="flex items-center gap-6">
          <Link
            href="/katalog"
            className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Katalog
          </Link>

          <Link
            href="/checkout"
            className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors group"
          >
            <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />

            {/* Indikator Angka */}
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
