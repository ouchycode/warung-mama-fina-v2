import { useEffect, RefObject } from "react";
import { gsap } from "gsap";

export function useStaggerReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector: string = ".animate-item",
) {
  useEffect(() => {
    // Pastikan elemennya ada sebelum menjalankan animasi
    if (!containerRef.current) return;

    // Gunakan gsap.context agar animasi mudah di-cleanup (wajib untuk React/Next.js)
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // Jeda antar elemen
        ease: "power3.out",
      });
    }, containerRef); // Scope animasinya dibatasi hanya di dalam container ini

    // Cleanup function saat komponen unmount
    return () => ctx.revert();
  }, [containerRef, selector]);
}
