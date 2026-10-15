"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import CreateCategoryForm from "@/components/CreateCategoryForm";
import { FormError } from "@/components/FormField";
import LoadError from "@/components/LoadError";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { createCategory, deleteCategory, fetchCategories, fetchProducts, updateCategory } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { Category, CategoryFormData } from "@/lib/types";

async function loadCategoryData(): Promise<{ categories: Category[]; counts: Record<number, number> }> {
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
  const counts: Record<number, number> = {};
  for (const product of products) counts[product.category_id] = (counts[product.category_id] ?? 0) + 1;
  return { categories: [...categories].sort((a, b) => a.id - b.id), counts };
}

/** /dashboard/categories: create, edit and delete (blocked while products are linked). */
export default function DashboardCategories() {
  const { data, error, loading, reload } = useApiData(loadCategoryData);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleCreate(form: CategoryFormData) {
    try {
      const category = await createCategory(form);
      toast.success(`Category "${category.name}" created.`);
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create the category."));
      throw err;
    }
  }

  async function handleUpdate(category: Category, form: CategoryFormData) {
    try {
      const updated = await updateCategory(category.id, form);
      toast.success(`Category "${updated.name}" updated.`);
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update the category."));
      throw err;
    }
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    setDeleteError("");
    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      toast.success(`Category "${category.name}" deleted.`);
      if (editing?.id === category.id) setEditing(null);
      await reload();
    } catch (err) {
      // Deletion guard: the API answers 409 while products still use this category.
      const count = data?.counts[category.id] ?? 0;
      const message =
        err instanceof ApiError && err.status === 409
          ? `Cannot delete "${category.name}": ${count || "some"} product${count === 1 ? " is" : "s are"} still linked to it.`
          : getErrorMessage(err, `Couldn't delete "${category.name}".`);
      setDeleteError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="categories-admin-heading" className="space-y-4">
      <div>
        <h1 id="categories-admin-heading" className="text-2xl font-bold">
          Categories
        </h1>
        <p className="text-sm text-gray-500">A category can only be deleted once no products use it.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <FormError message={deleteError} />
          {loading && !data ? (
            <ListSkeleton rows={4} />
          ) : error ? (
            <LoadError message={error} onRetry={reload} />
          ) : (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[520px] text-sm" aria-label="Categories">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th scope="col" className="p-3 font-semibold">Name</th>
                    <th scope="col" className="p-3 font-semibold">Description</th>
                    <th scope="col" className="p-3 font-semibold">Products</th>
                    <th scope="col" className="p-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.categories.map((category) => (
                    <tr key={category.id} className="border-t border-gray-100" data-testid="category-row">
                      <td className="p-3 font-medium">{category.name}</td>
                      <td className="p-3 text-gray-600">{category.description || "-"}</td>
                      <td className="p-3 tabular-nums">{data.counts[category.id] ?? 0}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(category)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-100"
                            aria-label={`Edit ${category.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
                            disabled={deletingId === category.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Delete ${category.name}`}
                          >
                            {deletingId === category.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {editing ? (
            <CreateCategoryForm
              key={editing.id}
              title={`Edit "${editing.name}"`}
              submitLabel="Save changes"
              initialValues={{ name: editing.name, description: editing.description ?? "" }}
              onCancel={() => setEditing(null)}
              onSubmit={(form) => handleUpdate(editing, form)}
            />
          ) : (
            <CreateCategoryForm onSubmit={handleCreate} />
          )}
        </div>
      </div>
    </section>
  );
}
