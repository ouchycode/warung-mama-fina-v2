import { NextResponse } from "next/server";

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

      // Ambil nomor pembeli, bersihkan angka 0 di depan jadi 62
      const rawPhone = data.customer_details?.phone || "081219334093";
      const formattedPhone = rawPhone.replace(/^0/, "62");

      const token = process.env.FONNTE_TOKEN;
      if (!token) throw new Error("FONNTE_TOKEN is missing in Vercel!");

      // FUNGSI HELPER UNTUK KIRIM WA (Mencegah 'empty body' error)
      const sendWA = async (target: string, message: string) => {
        const formData = new URLSearchParams();
        formData.append("target", target);
        formData.append("message", message);

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: token,
            // Header ini penting agar Fonnte tahu ada isi datanya
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });
        return await response.json();
      };

      // 1. Kirim ke Mama Fina (Penjual)
      const resPenjual = await sendWA(
        "6281219334093",
        `🚨 *PESANAN BARU LUNAS*\n\nOrder: ${orderId}\nTotal: Rp ${grossAmount}\n\nSegera siapkan pesanannya ya, Ma! ✨`,
      );
      console.log("🤖 Status WA Penjual:", resPenjual);

      // 2. Kirim ke Pembeli (Otomatis)
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
