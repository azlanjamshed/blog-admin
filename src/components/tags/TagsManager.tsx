"use client";

import React, { useState } from "react";
import { Tag } from "../../lib/types";
import { Button } from "../ui/Button";
import { TagModal } from "./TagModal";
import { Plus, Tag as TagIcon, Hash } from "lucide-react";

interface TagsManagerProps {
  tags: Tag[];
  onReload: () => void;
}

export function TagsManager({ tags, onReload }: TagsManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 font-serif">Tag Cloud</h2>
          <p className="text-xs text-zinc-500">Keywords and metadata tags used across articles</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
          Add Tag
        </Button>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2 text-xs font-semibold text-zinc-800 transition-all hover:border-emerald-600 hover:bg-emerald-50/50"
            >
              <Hash className="h-3.5 w-3.5 text-zinc-400" />
              <span>{tag.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">/{tag.slug}</span>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="py-12 text-center">
            <TagIcon className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-2 text-sm font-semibold text-zinc-700">No tags created yet</p>
            <p className="text-xs text-zinc-400 mt-1">Create tags to help readers discover topic niches.</p>
          </div>
        )}
      </div>

      <TagModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSaved={onReload} />
    </div>
  );
}
