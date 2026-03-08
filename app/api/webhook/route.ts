import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("🔔 ADA WEBHOOK MASUK DARI MIDTRANS:", data.transaction_status);

    // 1. Logika: Hanya kirim WA jika statusnya settlement atau capture (Lunas)
    if (
      data.transaction_status === "settlement" ||
      data.transaction_status === "capture"
    ) {
      const orderId = data.order_id;
      const grossAmount = data.gross_amount;

      // 2. MENGAMBIL NOMOR DARI MIDTRANS
      const rawPhone = data.customer_details?.phone || "081219334093";

      // 3. LOGIKA MEMBERSIHKAN NOMOR (Ubah 0 ke 62 agar Fonnte lancar)
      const formattedPhone = rawPhone.replace(/^0/, "62");

      const fonnteToken = process.env.FONNTE_TOKEN;

      if (!fonnteToken) {
        console.error(
          "❌ ERROR: FONNTE_TOKEN tidak ditemukan di Environment Variables",
        );
        return NextResponse.json(
          { success: false, message: "Token missing" },
          { status: 500 },
        );
      }

      // 4. KIRIM KE MAMA FINA (PENJUAL)
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: fonnteToken },
        body: new URLSearchParams({
          target: "6281219334093", // Nomor tetap Mama Fina
          message: `🚨 *PESANAN BARU LUNAS* 🚨\n\nOrder ID: ${orderId}\nTotal: Rp ${grossAmount}\n\nMa, ada uang masuk! Segera siapkan pesanannya ya. ✨`,
        }).toString(),
      });

      // 5. KIRIM KE PEMBELI (OTOMATIS)
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: { Authorization: fonnteToken },
        body: new URLSearchParams({
          target: formattedPhone, // Nomor pembeli yang sudah diformat
          message: `Halo! Terima kasih sudah belanja di *Warung Mama Fina* 🙏✨\n\nPembayaran untuk Order *${orderId}* sebesar *Rp ${grossAmount}* sudah kami terima.\n\nSabar ya, pesanan kamu sedang kami siapkan! 😊📦`,
        }).toString(),
      });

      console.log("✅ Robot WA berhasil kirim pesan ke Penjual & Pembeli!");
    }

    // Wajib balas Midtrans dengan status 200 OK agar tidak dianggap Gagal
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
