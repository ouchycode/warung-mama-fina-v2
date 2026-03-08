import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan file lib/prisma.ts sudah ada [cite: 2026-03-08]

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log untuk memantau status dari Midtrans
    console.log(
      "🔔 Log Midtrans Masuk:",
      data.order_id,
      data.transaction_status,
    );

    if (
      data.transaction_status === "settlement" ||
      data.transaction_status === "capture"
    ) {
      const orderId = data.order_id;
      const grossAmount = data.gross_amount;

      // --- 1. UPDATE DATABASE (Status & Stok) --- [cite: 2026-02-08, 2026-03-08]

      // Update status pesanan di tabel Order [cite: 2026-02-08]
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "success" },
      });

      // Potong stok barang berdasarkan item yang dibeli [cite: 2026-02-08, 2026-03-08]
      // Midtrans mengirim detail barang di metadata atau custom_field jika kamu mengaturnya di frontend
      // Jika kamu mengirim item_details saat create transaction, gunakan loop ini:
      if (data.item_details) {
        for (const item of data.item_details) {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: parseInt(item.quantity), // Potong stok sesuai jumlah beli [cite: 2026-02-08]
              },
            },
          });
        }
      }

      // --- 2. KIRIM NOTIFIKASI WHATSAPP (Fonnte) --- [cite: 2026-02-08]

      const rawPhone = data.customer_details?.phone || "6281219334093";
      const formattedPhone = rawPhone.replace(/^0/, "62");

      const token = process.env.FONNTE_TOKEN;
      if (!token) throw new Error("FONNTE_TOKEN is missing in Vercel!");

      const sendWA = async (target: string, message: string) => {
        const formData = new URLSearchParams();
        formData.append("target", target);
        formData.append("message", message);

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });
        return await response.json();
      };

      // Notif ke Mama Fina
      const resPenjual = await sendWA(
        "6281219334093",
        `🚨 *PESANAN BARU LUNAS*\n\nOrder: ${orderId}\nTotal: Rp ${grossAmount}\n\nStok sudah otomatis berkurang. Segera siapkan pesanannya ya, Ma! ✨`,
      );
      console.log("🤖 Status WA Penjual:", resPenjual);

      // Notif ke Pembeli
      const resPembeli = await sendWA(
        formattedPhone,
        `Halo! Pembayaran untuk Order *${orderId}* sebesar *Rp ${grossAmount}* sudah kami terima. Pesanan sedang disiapkan! 😊📦`,
      );
      console.log("🤖 Status WA Pembeli:", resPembeli);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
