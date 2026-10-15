"use client";

import toast from "react-hot-toast";
import AddProductForm from "@/components/AddProductForm";
import { updateProduct } from "@/lib/apiClient";
import { getErrorMessage } from "@/lib/errors";
import type { Category, Product } from "@/lib/types";

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onUpdated: (product: Product) => void;
  onCancel: () => void;
}

/** PUT /products/:id, pre-filled with the current values. */
export default function EditProductForm({ product, categories, onUpdated, onCancel }: EditProductFormProps) {
  return (
    <AddProductForm
      // Remount when switching products so the fields reset to the new values.
      key={product.id}
      categories={categories}
      title={`Edit "${product.name}"`}
      submitLabel="Save changes"
      resetOnSuccess={false}
      onCancel={onCancel}
      initialValues={{
        name: product.name,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        description: product.description ?? "",
      }}
      onAddProduct={async (data) => {
        try {
          const updated = await updateProduct(product.id, data);
          toast.success(`"${updated.name}" updated.`);
          onUpdated(updated);
        } catch (error) {
          toast.error(getErrorMessage(error, "Couldn't update the product."));
          throw error;
        }
      }}
    />
  );
}
