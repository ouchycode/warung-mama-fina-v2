import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    console.log(
      "🔔 Log Midtrans Masuk:",
      data.order_id,
      data.transaction_status,
    );

    const orderId = data.order_id;
    const transactionStatus = data.transaction_status;
    const grossAmount = data.gross_amount;

    // =========================
    // 1️⃣ VERIFY SIGNATURE MIDTRANS
    // =========================
    const signature = crypto
      .createHash("sha512")
      .update(orderId + data.status_code + grossAmount + serverKey)
      .digest("hex");

    if (signature !== data.signature_key) {
      console.log("❌ Signature Midtrans tidak valid");
      return NextResponse.json({ success: false });
    }

    // =========================
    // 2️⃣ CEK STATUS PEMBAYARAN
    // =========================
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      // =========================
      // 3️⃣ AMBIL ORDER
      // =========================
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.log("❌ Order tidak ditemukan:", orderId);
        return NextResponse.json({ success: false });
      }

      // cegah webhook ganda
      if (order.status === "success") {
        console.log("⚠️ Webhook duplikat diabaikan");
        return NextResponse.json({ success: true });
      }

      const items = order.items as any[];

      // =========================
      // 4️⃣ TRANSACTION DATABASE
      // =========================
      await prisma.$transaction(async (tx) => {
        // update order
        await tx.order.update({
          where: { id: orderId },
          data: { status: "success" },
        });

        // kurangi stok
        for (const item of items) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: Number(item.quantity),
              },
            },
          });
        }
      });

      console.log("✅ Stok berhasil dikurangi");

      // =========================
      // 5️⃣ KIRIM WHATSAPP
      // =========================
      const rawPhone = data.customer_details?.phone || "6281219334093";
      const formattedPhone = rawPhone.replace(/^0/, "62");

      const token = process.env.FONNTE_TOKEN;

      const sendWA = async (target: string, message: string) => {
        const formData = new URLSearchParams();
        formData.append("target", target);
        formData.append("message", message);

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: token!,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        return await response.json();
      };

      // notif penjual
      await sendWA(
        "6281219334093",
        `🚨 *PESANAN BARU LUNAS*\n\nOrder: ${orderId}\nTotal: Rp ${grossAmount}\n\nStok sudah otomatis berkurang.`,
      );

      // notif pembeli
      await sendWA(
        formattedPhone,
        `Halo! Pembayaran untuk Order *${orderId}* sebesar *Rp ${grossAmount}* sudah kami terima. Pesanan sedang disiapkan! 😊`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
