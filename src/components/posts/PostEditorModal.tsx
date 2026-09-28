"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { ImageUploader } from "./ImageUploader";
import { Category, Tag, Post, PostFormData } from "../../lib/types";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Plus, Tag as TagIcon, Sparkles } from "lucide-react";

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: Post | null;
  categories: Category[];
  tags: Tag[];
  onSaved: () => void;
  onQuickAddCategory: () => void;
  onQuickAddTag: () => void;
}

const defaultFormData: PostFormData = {
  title: "",
  content: "",
  excerpt: "",
  coverImageUrl: "",
  categoryId: "",
  status: "DRAFT",
  tagIds: [],
};

export function PostEditorModal({
  isOpen,
  onClose,
  postToEdit,
  categories,
  tags,
  onSaved,
  onQuickAddCategory,
  onQuickAddTag,
}: PostEditorModalProps) {
  const [formData, setFormData] = useState<PostFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        title: postToEdit.title || "",
        content: postToEdit.content || "",
        excerpt: postToEdit.excerpt || "",
        coverImageUrl: postToEdit.coverImageUrl || "",
        categoryId: postToEdit.categoryId || postToEdit.category?.id || "",
        status: postToEdit.status || "DRAFT",
        tagIds: postToEdit.tags ? postToEdit.tags.map((t) => t.id) : [],
      });
    } else {
      setFormData({
        ...defaultFormData,
        categoryId: categories.length > 0 ? categories[0].id : "",
      });
    }
    setErrors({});
  }, [postToEdit, categories, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = "Title is required";
    } else if (formData.title.length > 150) {
      errs.title = "Title cannot exceed 150 characters";
    }

    if (!formData.content.trim()) {
      errs.content = "Story content is required";
    } else if (formData.content.trim().length < 50) {
      errs.content = `Content must be at least 50 characters (currently ${formData.content.trim().length})`;
    }

    if (formData.excerpt && formData.excerpt.length > 300) {
      errs.excerpt = "Excerpt cannot exceed 300 characters";
    }

    if (!formData.categoryId) {
      errs.categoryId = "Please select a category";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
        categoryId: formData.categoryId,
        status: formData.status,
        tagIds: formData.tagIds,
      };

      if (postToEdit) {
        await api.posts.update(postToEdit.id, payload);
        showToast("Story updated successfully!", "success");
      } else {
        await api.posts.create(payload);
        showToast("Story published successfully!", "success");
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save story";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: exists
          ? prev.tagIds.filter((id) => id !== tagId)
          : [...prev.tagIds, tagId],
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={postToEdit ? "Edit Story" : "Write a New Story"}
      description="Fill in your story details. Articles with clear categories and tags perform better."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g., The Architecture of Modern Microservices"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        {/* Excerpt */}
        <Textarea
          label="Short Excerpt (Optional)"
          placeholder="A brief 1-2 sentence preview to engage readers in the feed..."
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          error={errors.excerpt}
          showCount
          currentCount={formData.excerpt.length}
          maxCount={300}
        />

        {/* Story Content */}
        <Textarea
          label="Story Body (Markdown / Plain text)"
          placeholder="Write your article here... Minimum 50 characters required."
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          error={errors.content}
          showCount
          currentCount={formData.content.trim().length}
          minCount={50}
          required
        />

        {/* Category & Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Category
              </label>
              <button
                type="button"
                onClick={onQuickAddCategory}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="h-3 w-3" />
                Add Category
              </button>
            </div>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs font-medium text-rose-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
              Publishing Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" })
              }
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="DRAFT">Draft (Save privately)</option>
              <option value="PUBLISHED">Published (Visible to readers)</option>
            </select>
          </div>
        </div>

        {/* Tag selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Tags
            </label>
            <button
              type="button"
              onClick={onQuickAddTag}
              className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="h-3 w-3" />
              Add Tag
            </button>
          </div>

          {tags.length === 0 ? (
            <p className="text-xs text-zinc-400">No tags available. Click Add Tag to create one.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = formData.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    <TagIcon className="h-3 w-3" />
                    <span>{tag.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Cover image uploader */}
        <ImageUploader
          value={formData.coverImageUrl}
          onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
        />

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} icon={<Sparkles className="h-4 w-4" />}>
            {postToEdit ? "Save Changes" : formData.status === "PUBLISHED" ? "Publish Story" : "Save as Draft"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
