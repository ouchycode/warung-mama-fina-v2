import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Tangkap data laporan otomatis dari Midtrans
    const data = await request.json();

    console.log("🔔 ADA WEBHOOK MASUK DARI MIDTRANS:", data.transaction_status);

    // 2. Cek apakah statusnya BENAR-BENAR LUNAS (settlement / capture)
    if (
      data.transaction_status === "settlement" ||
      data.transaction_status === "capture"
    ) {
      const orderId = data.order_id;
      const grossAmount = data.gross_amount;

      // 3. Ambil token dari environment variable
      const fonnteToken = process.env.FONNTE_TOKEN;

      if (!fonnteToken) {
        console.error("❌ ERROR: Token Fonnte belum dipasang di .env.local");
        return NextResponse.json(
          { success: false, message: "Server configuration error" },
          { status: 500 },
        );
      }

      // 4. Kirim WA Otomatis melalui Fonnte
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: fonnteToken,
        },
        body: new URLSearchParams({
          target: "081219334093", // Nomor Mama Fina
          message: `🚨 *PESANAN BARU LUNAS (Sistem Otomatis)* 🚨\n\nOrder ID: ${orderId}\nTotal Bayar: Rp ${grossAmount}\n\nPembayaran via Midtrans telah divalidasi. Mohon segera siapkan barangnya, Ma! 📦✨`,
        }),
      });

      console.log("✅ WA OTOMATIS BERHASIL DIKIRIM KE MAMA FINA!");
    }

    // Wajib balas Midtrans dengan status 200 OK
    return NextResponse.json(
      { success: true, message: "Webhook received" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gagal memproses webhook:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
