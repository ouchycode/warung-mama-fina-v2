import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Logika: Hanya kirim WA jika statusnya settlement (Lunas)
    if (
      data.transaction_status === "settlement" ||
      data.transaction_status === "capture"
    ) {
      const orderId = data.order_id;
      const grossAmount = data.gross_amount;

      // MENGAMBIL NOMOR DARI MIDTRANS
      // Midtrans biasanya mengirim data pembeli di dalam objek customer_details
      const customerPhone = data.customer_details?.phone || "081219334093";

      const fonnteToken = process.env.FONNTE_TOKEN;

      if (!fonnteToken) {
        return NextResponse.json(
          { success: false, message: "Token missing" },
          { status: 500 },
        );
      }

      // 1. KIRIM KE MAMA FINA (PENJUAL)
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: fonnteToken },
        body: new URLSearchParams({
          target: "6281219334093", // Nomor tetap Mama Fina
          message: `🚨 *PESANAN BARU LUNAS* 🚨\n\nOrder ID: ${orderId}\nTotal: Rp ${grossAmount}\n\nMa, ada uang masuk! Segera siapkan pesanannya ya. ✨`,
        }).toString(),
      });

      // 2. KIRIM KE PEMBELI (OTOMATIS)
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: fonnteToken },
        body: new URLSearchParams({
          target: customerPhone, // Nomor dinamis yang diambil dari data Midtrans
          message: `Halo! Terima kasih sudah belanja di *Warung Mama Fina* 🙏✨\n\nPembayaran untuk Order *${orderId}* sebesar *Rp ${grossAmount}* sudah kami terima.\n\nSabar ya, pesanan kamu sedang kami siapkan! 😊📦`,
        }).toString(),
      });

      console.log("✅ Robot WA berhasil kirim pesan ke Penjual & Pembeli!");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
