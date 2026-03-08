import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log awal untuk memastikan Midtrans berhasil memanggil server
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
      const rawPhone = data.customer_details?.phone || "081219334093";
      const formattedPhone = rawPhone.replace(/^0/, "62");

      const token = process.env.FONNTE_TOKEN;
      if (!token) throw new Error("FONNTE_TOKEN is missing in Vercel!");

      // 1. Notif Penjual
      const resPenjual = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: token },
        body: new URLSearchParams({
          target: "6281219334093",
          message: `🚨 *PESANAN BARU LUNAS*\nOrder: ${orderId}\nTotal: Rp ${grossAmount}`,
        }).toString(),
      });

      // TARO DI SINI: Console log untuk cek respon Fonnte buat penjual
      const hasilPenjual = await resPenjual.json();
      console.log("🤖 Status Kirim WA Penjual:", hasilPenjual);

      // 2. Notif Pembeli
      const resPembeli = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: token },
        body: new URLSearchParams({
          target: formattedPhone,
          message: `Halo! Pembayaran ${orderId} sudah kami terima. Pesanan sedang disiapkan! 😊`,
        }).toString(),
      });

      // TARO DI SINI: Console log untuk cek respon Fonnte buat pembeli
      const hasilPembeli = await resPembeli.json();
      console.log("🤖 Status Kirim WA Pembeli:", hasilPembeli);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
