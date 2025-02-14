import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const mockOrder = {
  _id: "6789abcdef",
  userId: {
    email: "test@example.com",
  },
  productId: {
    name: "Sample Nature Photo",
  },
  variant: {
    type: "WIDE",
    license: "commercial",
  },
  amount: 29.99,
};

try {
  await transporter.sendMail({
    from: '"ImageKit Shop" <noreply@imagekitshop.com>',
    to: mockOrder.userId.email,
    subject: "Payment Confirmation - ImageKit Shop",
    text: [
      "Thank you for your purchase!",
      "",
      "Order Details:",
      "- Order ID: " + mockOrder._id.toString().slice(-6),
      "- Product: " + mockOrder.productId.name,
      "- Version: " + mockOrder.variant.type,
      "- License: " + mockOrder.variant.license,
      "- Price: $" + mockOrder.amount.toFixed(2),
      "",
      "Your image is now available in your orders page.",
      "Thank you for shopping with ImageKit Shop!",
    ].join("\n"),
  });

  console.log("Email sent successfully!");
} catch (error) {
  console.error("Error sending email:", error);
}
