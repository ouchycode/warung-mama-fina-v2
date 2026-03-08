import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  try {
    const body = await request.json();
    const { items, customerName, customerPhone, customerAddress, amount } =
      body;

    const grossAmount = Math.round(Number(amount));
    const orderId = `MAMAFINA-${Date.now()}`;

    // ========================
    // 1️⃣ SIMPAN ORDER + ITEMS
    // ========================
    await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        customerPhone,
        totalAmount: grossAmount,
        status: "pending",
        items: items, // simpan items untuk webhook
      },
    });

    // ========================
    // 2️⃣ MIDTRANS PAYLOAD
    // ========================
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },

      item_details: items.map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),

      customer_details: {
        first_name: customerName,
        phone: customerPhone,
        billing_address: {
          address: customerAddress,
        },
      },
    };

    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const response = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ ERROR MIDTRANS:", data);
      throw new Error(data.error_messages?.[0] || "Gagal menghubungi Midtrans");
    }

    return NextResponse.json({
      success: true,
      token: data.token,
      orderId,
    });
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
