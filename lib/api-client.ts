import { IOrder } from "@/models/Order";
import { IProduct, ImageVariant } from "@/models/Product";
import { Types } from "mongoose";

export type ProductFormData = Omit<IProduct, "_id">;

export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

<<<<<<< HEAD
    return this.fetch<{ orderId: string; amount: number; currency: string; dbOrderId: string }>("/orders", {
=======
    return this.fetch<{ orderId: string; amount: number }>("/orders", {
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
      method: "POST",
      body: sanitizedOrderData,
    });
  }
<<<<<<< HEAD

  async verifyOrder(data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) {
    return this.fetch<{ success: boolean }>("/orders/verify", {
      method: "POST",
      body: data,
    });
  }
=======
>>>>>>> 96aa89a40aa094abbb670332ae6546d952b84300
}

export const apiClient = new ApiClient();
