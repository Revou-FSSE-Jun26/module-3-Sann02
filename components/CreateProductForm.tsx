"use client";

import toast from "react-hot-toast";
import AddProductForm from "@/components/AddProductForm";
import { createProduct } from "@/lib/apiClient";
import { getErrorMessage } from "@/lib/errors";
import type { Category, Product } from "@/lib/types";

interface CreateProductFormProps {
  categories: Category[];
  /** Called with the API's new product so the table can show it. */
  onCreated: (product: Product) => void;
  onCancel?: () => void;
}

/** POST /products from the admin dashboard. */
export default function CreateProductForm({ categories, onCreated, onCancel }: CreateProductFormProps) {
  return (
    <AddProductForm
      categories={categories}
      title="New product"
      subtitle="Saved to the RevoShop API."
      submitLabel="Save product"
      onCancel={onCancel}
      onAddProduct={async (data) => {
        try {
          const product = await createProduct(data);
          toast.success(`"${product.name}" created.`);
          onCreated(product);
        } catch (error) {
          toast.error(getErrorMessage(error, "Couldn't create the product."));
          throw error; // keep the form filled in and show the message inline
        }
      }}
    />
  );
}
