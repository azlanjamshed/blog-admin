"use client";

import React, { useState } from "react";
import { Category, Post } from "../../lib/types";
import { Button } from "../ui/Button";
import { CategoryModal } from "./CategoryModal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Plus, FolderKanban, Edit2, Trash2 } from "lucide-react";

interface CategoriesManagerProps {
  categories: Category[];
  posts: Post[];
  onReload: () => void;
}

export function CategoriesManager({
  categories,
  posts,
  onReload,
}: CategoriesManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  const getPostCount = (catId: string) => {
    return posts.filter((p) => p.categoryId === catId || p.category?.id === catId).length;
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      setDeleteLoading(true);
      await api.categories.delete(deletingCategory.id);
      showToast("Category deleted successfully", "info");
      setDeletingCategory(null);
      onReload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category";
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 font-serif">Categories</h2>
          <p className="text-xs text-zinc-500">Curate content sections for your readers</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = getPostCount(cat.id);
          return (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-zinc-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-zinc-900">{cat.name}</h4>
                  <p className="truncate text-xs text-zinc-400 font-mono">/{cat.slug}</p>
                  <p className="text-[11px] font-medium text-emerald-700 mt-1">
                    {count} {count === 1 ? "story" : "stories"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                  title="Rename category"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingCategory(cat)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-2 text-sm font-semibold text-zinc-700">No categories created</p>
          <p className="text-xs text-zinc-400 mt-1">Create categories to organize your blog posts.</p>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categoryToEdit={editingCategory}
        onSaved={onReload}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deletingCategory?.name}"? Posts assigned to this category might be affected.`}
        confirmLabel="Delete Category"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
