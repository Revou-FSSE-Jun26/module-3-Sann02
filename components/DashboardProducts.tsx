"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CreateProductForm from "@/components/CreateProductForm";
import EditProductForm from "@/components/EditProductForm";
import { FormError } from "@/components/FormField";
import LoadError from "@/components/LoadError";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { deleteProduct, fetchCategories, fetchProducts } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { Category, Product } from "@/lib/types";
import { formatPrice, getStockStatus } from "@/lib/utils";

async function loadDashboardData(): Promise<{ products: Product[]; categories: Category[] }> {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  return { products: [...products].sort((a, b) => a.id - b.id), categories };
}

/** /dashboard: product table with create, edit and guarded delete. */
export default function DashboardProducts() {
  const { currentUser } = useAuth();
  const { data, error, loading, reload } = useApiData(loadDashboardData);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const categoryName = useCallback(
    (id: number) => data?.categories.find((c) => c.id === id)?.name ?? `#${id}`,
    [data],
  );

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleteError("");
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      toast.success(`"${product.name}" deleted.`);
      if (editing?.id === product.id) setEditing(null);
      await reload();
    } catch (err) {
      // Deletion guard: the API answers 409 while the product is in an active order.
      const message =
        err instanceof ApiError && err.status === 409
          ? `Cannot delete "${product.name}": it is part of an active order.`
          : getErrorMessage(err, `Couldn't delete "${product.name}".`);
      setDeleteError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 id="dashboard-heading" className="text-2xl font-bold">
            Products
          </h1>
          <p className="text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{currentUser?.username}</span>{" "}
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
              {currentUser?.role}
            </span>
          </p>
        </div>
        <Link href="/dashboard/categories" className="text-sm font-medium text-blue-600 hover:underline">
          Manage categories
        </Link>
        <button
          type="button"
          onClick={() => {
            setShowCreate((open) => !open);
            setEditing(null);
          }}
          aria-expanded={showCreate}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          {showCreate ? "Close form" : "+ New product"}
        </button>
      </div>

      {data && showCreate && (
        <CreateProductForm
          categories={data.categories}
          onCancel={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            void reload(); // the new product appears in the table
          }}
        />
      )}

      {data && editing && (
        <EditProductForm
          product={editing}
          categories={data.categories}
          onCancel={() => setEditing(null)}
          onUpdated={() => {
            setEditing(null);
            void reload();
          }}
        />
      )}

      <FormError message={deleteError} />

      {loading && !data ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm" aria-label="Products">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th scope="col" className="p-3 font-semibold">Name</th>
                <th scope="col" className="p-3 font-semibold">Price</th>
                <th scope="col" className="p-3 font-semibold">Stock</th>
                <th scope="col" className="p-3 font-semibold">Category</th>
                <th scope="col" className="p-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No products yet. Create the first one.
                  </td>
                </tr>
              )}
              {data?.products.map((product) => (
                <tr key={product.id} className="border-t border-gray-100" data-testid="product-row">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 tabular-nums">{formatPrice(product.price)}</td>
                  <td className="p-3">
                    <span className="mr-2 tabular-nums">{product.stock_quantity}</span>
                    <Badge variant={getStockStatus(product.stock_quantity)} />
                  </td>
                  <td className="p-3">{categoryName(product.category_id)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(product);
                          setShowCreate(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-100"
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        {deletingId === product.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </section>
  );
}
