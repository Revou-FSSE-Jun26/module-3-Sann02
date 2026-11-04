"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import {
  BarChart3Icon,
  PackageIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
  TrendingUpIcon,
  XIcon,
} from "@/components/Icons";
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
import { cn, formatPrice, getStockStatus } from "@/lib/utils";

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
    <section aria-labelledby="dashboard-heading" className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 id="dashboard-heading" className="font-display text-3xl font-extrabold text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as{" "}
            <span className="font-semibold text-slate-700">{currentUser?.username}</span>{" "}
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
            >
              {currentUser?.role}
            </span>
          </p>
        </div>

        <Link
          href="/dashboard/categories"
          className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition-all duration-200 hover:bg-brand-100"
        >
          <TagIcon size={15} aria-hidden="true" />
          Manage categories
        </Link>

        <button
          type="button"
          onClick={() => {
            setShowCreate((open) => !open);
            setEditing(null);
          }}
          aria-expanded={showCreate}
          className={cn(
            "btn-shine inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
          )}
          style={{ background: showCreate ? "#64748b" : "linear-gradient(135deg, #2448e0, #3866f5)" }}
        >
          {showCreate ? (
            <>
              <XIcon size={16} aria-hidden="true" />
              Close form
            </>
          ) : (
            <>
              <PlusIcon size={16} aria-hidden="true" />
              New product
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      {data && <InventoryStats products={data.products} />}

      {/* Create form */}
      {data && showCreate && (
        <CreateProductForm
          categories={data.categories}
          onCancel={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            void reload();
          }}
        />
      )}

      {/* Edit form */}
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

      {/* Table */}
      {loading && !data ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <Card className="relative min-w-0 overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm" aria-label="Products">
            <thead>
              <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white text-left text-xs font-semibold text-slate-500">
                <th scope="col" className="px-5 py-4">Product</th>
                <th scope="col" className="px-4 py-4">Price</th>
                <th scope="col" className="px-4 py-4">Stock</th>
                <th scope="col" className="px-4 py-4">Category</th>
                <th scope="col" className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    <PackageIcon size={32} className="mx-auto mb-3 text-slate-300" aria-hidden="true" />
                    No products yet. Create the first one.
                  </td>
                </tr>
              )}
              {data?.products.map((product) => (
                <tr
                  key={product.id}
                  className="group border-t border-slate-100 transition-colors duration-150 hover:bg-brand-50/30"
                  data-testid="product-row"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900">{product.name}</span>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-600">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-slate-900">
                        {product.stock_quantity}
                      </span>
                      <Badge variant={getStockStatus(product.stock_quantity)} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{categoryName(product.category_id)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(product);
                          setShowCreate(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                        aria-label={`Edit ${product.name}`}
                      >
                        <PencilIcon size={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                        aria-label={`Delete ${product.name}`}
                      >
                        {deletingId === product.id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
                        ) : (
                          <Trash2Icon size={14} aria-hidden="true" />
                        )}
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

/** Inventory stats with gradient icon circles */
function InventoryStats({ products }: { products: Product[] }) {
  const lowStock = products.filter((p) => getStockStatus(p.stock_quantity) === "low-stock").length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const value = products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0);

  const stats = [
    {
      label: "Total items",
      value: String(products.length),
      icon: PackageIcon,
      gradient: "from-brand-500 to-brand-400",
      glow: "shadow-[0_0_16px_-4px_rgb(56_102_245/0.5)]",
      textColor: "text-brand-700",
    },
    {
      label: "Low stock",
      value: String(lowStock),
      icon: TrendingUpIcon,
      gradient: "from-accent-500 to-accent-400",
      glow: "shadow-[0_0_16px_-4px_rgb(249_115_22/0.5)]",
      textColor: "text-accent-700",
    },
    {
      label: "Sold out",
      value: String(outOfStock),
      icon: TagIcon,
      gradient: "from-rose-500 to-rose-400",
      glow: "shadow-[0_0_16px_-4px_rgb(244_63_94/0.5)]",
      textColor: "text-rose-700",
    },
    {
      label: "Inventory value",
      value: formatPrice(value),
      icon: BarChart3Icon,
      gradient: "from-emerald-500 to-teal-400",
      glow: "shadow-[0_0_16px_-4px_rgb(16_185_129/0.5)]",
      textColor: "text-emerald-700",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, gradient, glow, textColor }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <dt className="text-xs font-semibold text-slate-500">{label}</dt>
              <dd className={cn("mt-1.5 font-display text-2xl font-extrabold tabular-nums", textColor)}>
                {value}
              </dd>
            </div>
            <span
              className={cn(
                `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white ${glow}`,
              )}
            >
              <Icon size={18} />
            </span>
          </div>
        </div>
      ))}
    </dl>
  );
}
