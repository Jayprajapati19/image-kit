import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
<<<<<<< HEAD
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Webhook error: RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Server misconfigured (secret)" }, { status: 500 });
    }

    if (/^https?:\/\//i.test(webhookSecret)) {
      console.error("Webhook error: RAZORPAY_WEBHOOK_SECRET appears to be a URL, must be a secret string");
      return NextResponse.json({ error: "Invalid webhook secret configuration" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (!signature) {
      console.warn("Webhook warning: Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (signature !== expectedSignature) {
      console.warn("Webhook warning: Signature mismatch", {
        received: signature,
        expectedPrefix: expectedSignature.slice(0, 8),
        bodyLength: body.length,
        eventPreview: body.slice(0, 120).replace(/\n/g, " ") + (body.length > 120 ? "..." : ""),
      });
=======

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await connectToDatabase();

<<<<<<< HEAD
  if (event.event === "payment.captured") {
=======
    if (event.event === "payment.captured") {
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
      const payment = event.payload.payment.entity;

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          razorpayPaymentId: payment.id,
          status: "completed",
        }
      ).populate([
        { path: "userId", select: "email" },
        { path: "productId", select: "name" },
      ]);

      if (order) {
        // Send email only after payment is confirmed
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        });

<<<<<<< HEAD
  const baseUrl = process.env.NEXTAUTH_URL || process.env.PUBLIC_SITE_URL || "http://localhost:3000";
  await transporter.sendMail({
=======
        await transporter.sendMail({
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
          from: '"ImageKit Shop" <noreply@imagekitshop.com>',
          to: order.userId.email,
          subject: "Payment Confirmation - ImageKit Shop",
          text: `
Thank you for your purchase!

Order Details:
- Order ID: ${order._id.toString().slice(-6)}
- Product: ${order.productId.name}
- Version: ${order.variant.type}
- License: ${order.variant.license}
- Price: $${order.amount.toFixed(2)}

<<<<<<< HEAD
Your image is now available in your orders page:\n${baseUrl}/orders
=======
Your image is now available in your orders page.
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
Thank you for shopping with ImageKit Shop!
          `.trim(),
        });
      }
<<<<<<< HEAD
    } else if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      await connectToDatabase();
      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "failed" }
      );
      console.warn("Payment failed for order", payment.order_id, payment.error_description);
    }

  return NextResponse.json({ received: true });
=======
    }

    return NextResponse.json({ received: true });
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
