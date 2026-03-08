"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Home, Receipt } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  // Efek Confetti Meledak saat halaman dibuka
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti dari kiri
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      // Confetti dari kanan
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  // Format Pesan WhatsApp Otomatis
  const waMessage = encodeURIComponent(
    "Halo Mama Fina! 🙋‍♂️\n\nSaya baru saja melakukan pembayaran pesanan via Web (Midtrans). Mohon segera dicek dan diproses ya pesanannya. Terima kasih! 📦✨",
  );
  // Ganti nomor ini dengan nomor WA yang mau di-demo-kan (Gunakan 62 sebagai pengganti 0)
  const waLink = `https://wa.me/6281219334093?text=${waMessage}`;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center relative overflow-hidden border border-slate-100">
        {/* Ikon Sukses Animasi */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Hore! Berhasil 🎉
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Pembayaran kamu telah diverifikasi oleh sistem. Pesanan sedang
          disiapkan oleh Warung Mama Fina.
        </p>

        {/* Kotak Resi Sederhana */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 text-left">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-slate-800">
              Status Pembayaran
            </span>
          </div>
          <p className="text-sm text-slate-500 ml-8">
            LUNAS via Midtrans Secure Pay
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            Kabari Mama Fina (WhatsApp)
          </a>

          <Link
            href="/katalog"
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </main>
  );
}
