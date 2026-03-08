"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

// Import Custom Hook kita
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // 1 Baris ini saja untuk memanggil semua animasi GSAP!
  useStaggerReveal(containerRef, ".hero-element");

  return (
    <section
      ref={containerRef}
      className="relative pt-24 pb-20 px-4 flex flex-col items-center text-center overflow-hidden bg-slate-50"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-gradient-to-b from-emerald-100/50 to-transparent blur-3xl -z-10 rounded-full"></div>

      <div className="max-w-3xl flex flex-col items-center z-10">
        <div className="hero-element inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Pengiriman Instan di Bawah 15 Menit</span>
        </div>

        <h1 className="hero-element text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.15]">
          Belanja Harian, <br />
          <span className="text-emerald-600">Tanpa Antre & Repot.</span>
        </h1>

        <p className="hero-element text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Penuhi kebutuhan dapur Anda hari ini. Mulai dari beras, gas, hingga
          galon, diantar langsung ke depan pintu rumah Anda dengan aman.
        </p>

        <div className="hero-element flex flex-col sm:flex-row gap-4">
          <Link
            href="/katalog"
            className="group flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-full font-semibold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
          >
            Mulai Belanja
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
