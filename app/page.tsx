"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct } from "@/models/Product";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
      <ImageGallery products={products} />
    </main>
  );
}
