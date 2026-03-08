export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import prisma from "@/lib/prisma";

export default async function Home() {
  try {
    const dataFromDb = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div>
        <Hero />
        <ProductGrid initialProducts={dataFromDb} />
      </div>
    );
  } catch (error) {
    console.error("DB ERROR:", error);

    return (
      <div>
        <Hero />
        <p style={{ textAlign: "center" }}>Produk sedang tidak tersedia.</p>
      </div>
    );
  }
}
