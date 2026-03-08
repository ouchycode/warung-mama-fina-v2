"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Loader2,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

// Deklarasi window.snap agar TypeScript tidak error
declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { items, removeItem, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const totalAmount = getTotal();
  useStaggerReveal(containerRef, ".animate-checkout");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Keranjang kosong!");

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Panggil Pop-up Midtrans
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            toast.success("Pembayaran Berhasil!");
            clearCart();
            window.location.href = "/sukses";
          },
          onPending: function (result: any) {
            toast.info("Menunggu Pembayaran...");
            clearCart();
            window.location.href = "/sukses";
          },
          onError: function (result: any) {
            toast.error("Pembayaran Gagal!");
          },
          onClose: function () {
            toast.error("Kamu menutup layar pembayaran sebelum selesai.");
            setIsLoading(false);
          },
        });
      } else {
        toast.error(data.message || "Gagal mendapatkan token transaksi.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md w-full animate-pulse">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Keranjang Kosong
          </h2>
          <p className="text-slate-500 mb-8">
            Belum ada barang yang kamu pilih.
          </p>
          <Link
            href="/katalog"
            className="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
          >
            Mulai Belanja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-slate-50 py-10 px-4 md:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="animate-checkout mb-8 flex items-center gap-4">
          <Link
            href="/katalog"
            className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout Pesanan
          </h1>
        </div>

        <div className="grid md:grid-cols-[1.3fr,1fr] gap-6 md:gap-8">
          <div className="animate-checkout bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Rincian
              Belanjaan
            </h2>
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-800">
                      {item.name}
                    </h3>
                    <p className="text-emerald-600 font-bold">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Jumlah: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-checkout">
            <form
              onSubmit={handleCheckout}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60 sticky top-24"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" /> Info Pengiriman
              </h2>

              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nama
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    No. WA
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Alamat Lengkap
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-8">
                <div className="flex justify-between items-center text-xl font-black text-slate-900">
                  <span>Total Bayar</span>
                  <span className="text-emerald-600">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Membuka
                    Kasir...
                  </>
                ) : (
                  "Bayar dengan Midtrans"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
