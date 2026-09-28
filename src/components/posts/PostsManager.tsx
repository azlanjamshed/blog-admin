"use client";

import React, { useState, useMemo } from "react";
import { Post, Category, Tag } from "../../lib/types";
import { PostRow } from "./PostRow";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Plus, Search, Filter, FileText } from "lucide-react";

interface PostsManagerProps {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  onNewPost: () => void;
  onEditPost: (post: Post) => void;
  onReload: () => void;
}

export function PostsManager({
  posts,
  categories,
  tags,
  onNewPost,
  onEditPost,
  onReload,
}: PostsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory
        ? (post.categoryId === selectedCategory || post.category?.id === selectedCategory)
        : true;

      const matchesStatus =
        statusFilter === "ALL" ? true : post.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchQuery, selectedCategory, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    try {
      setDeleteLoading(true);
      await api.posts.delete(deletingPost.id);
      showToast("Story deleted successfully.", "info");
      setDeletingPost(null);
      onReload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete story";
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab === "ALL" ? "All Stories" : tab === "PUBLISHED" ? "Published" : "Drafts"}
              <span className="ml-1.5 text-[10px] opacity-70">
                {tab === "ALL"
                  ? posts.length
                  : posts.filter((p) => p.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Action button */}
        <Button onClick={onNewPost} size="sm" icon={<Plus className="h-4 w-4" />}>
          New Story
        </Button>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search stories by title or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs sm:text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/70 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Story</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Engagement</th>
                <th className="px-6 py-3.5">Updated</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onEdit={onEditPost}
                  onDelete={(p) => setDeletingPost(p)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-zinc-800">No stories found</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchQuery || selectedCategory || statusFilter !== "ALL"
                ? "Try adjusting your search filters to find what you're looking for."
                : "Get started by writing your first article for the journal."}
            </p>
            {posts.length === 0 && (
              <Button onClick={onNewPost} size="sm" className="mt-2">
                Draft First Story
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Story"
        message={`Are you sure you want to permanently delete "${deletingPost?.title}"? This cannot be undone.`}
        confirmLabel="Delete Story"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
