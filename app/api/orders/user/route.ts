import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({ userId: session.user.id })
      .populate({
        path: "productId",
        select: "imageUrl name",
        // Return null if product not found instead of throwing error
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 })
      .lean();

    const validOrders = orders.map((order) => ({
      ...order,
      productId: order.productId || {
        imageUrl: null,
        name: "Product no longer available",
      },
    }));

    return NextResponse.json(validOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
