"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Category } from "../../lib/types";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  onSaved: () => void;
}

export function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  onSaved,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName("");
    }
    setError("");
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      if (categoryToEdit) {
        await api.categories.update(categoryToEdit.id, name.trim());
        showToast("Category updated successfully", "success");
      } else {
        await api.categories.create(name.trim());
        showToast("Category created successfully", "success");
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={categoryToEdit ? "Edit Category" : "New Category"}
      description="Categories help group related stories together for readers."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g., Technology, Design, Philosophy"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          error={error}
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={loading}>
            {categoryToEdit ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
