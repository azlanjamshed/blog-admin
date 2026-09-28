"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TagModal({ isOpen, onClose, onSaved }: TagModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tag name is required");
      return;
    }

    try {
      setLoading(true);
      await api.tags.create(name.trim());
      showToast("Tag created successfully", "success");
      setName("");
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create tag";
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
      title="Create New Tag"
      description="Tags help readers filter content by specific keywords or themes."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tag Name"
          placeholder="e.g., React, AI, Architecture, Startups"
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
            Create Tag
          </Button>
        </div>
      </form>
    </Modal>
  );
}
