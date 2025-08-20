import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";

// Verifies payment signature immediately after checkout success (client callback)
export async function POST(req: NextRequest) {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.warn("Invalid signature", { expectedSignature, received: razorpaySignature, razorpayOrderId });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, status: "completed" },
      { new: true }
    );
    if (!updated) {
      console.warn("Order not found for verification", razorpayOrderId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify order error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
