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
          <h1 id="dashboard-heading" className="text-3xl font-bold text-slate-900">
            Products
          </h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{currentUser?.username}</span>{" "}
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
              {currentUser?.role}
            </span>
          </p>
        </div>
        <Link
          href="/dashboard/categories"
          className="text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-800"
        >
          Manage categories
        </Link>
        <button
          type="button"
          onClick={() => {
            setShowCreate((open) => !open);
            setEditing(null);
          }}
          aria-expanded={showCreate}
          className="min-h-11 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700"
        >
          {showCreate ? "Close form" : "+ New product"}
        </button>
      </div>

      {data && <InventoryStats products={data.products} />}

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
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="px-4 py-3 font-semibold">Price</th>
                <th scope="col" className="px-4 py-3 font-semibold">Stock</th>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No products yet. Create the first one.
                  </td>
                </tr>
              )}
              {data?.products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100" data-testid="product-row">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className="mr-2 tabular-nums">{product.stock_quantity}</span>
                    <Badge variant={getStockStatus(product.stock_quantity)} />
                  </td>
                  <td className="px-4 py-3">{categoryName(product.category_id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(product);
                          setShowCreate(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100"
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
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

/** Overview cards derived from the product list (no extra requests). */
function InventoryStats({ products }: { products: Product[] }) {
  const lowStock = products.filter((p) => getStockStatus(p.stock_quantity) === "low-stock").length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const value = products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0);

  const stats = [
    { label: "Total items", value: String(products.length), tone: "text-slate-900" },
    { label: "Low stock", value: String(lowStock), tone: "text-accent-700" },
    { label: "Sold out", value: String(outOfStock), tone: "text-rose-700" },
    { label: "Inventory value", value: formatPrice(value), tone: "text-slate-900" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</dt>
          <dd className={`mt-1 font-display text-2xl font-bold tabular-nums ${stat.tone}`}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
