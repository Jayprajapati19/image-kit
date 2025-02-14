import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variant } = await req.json();
    await connectToDatabase();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(variant.price * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: productId.toString(),
      },
    });

    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      variant,
      razorpayOrderId: order.id,
      amount: variant.price,
      status: "pending",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
