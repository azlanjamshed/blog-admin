"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Button } from "../ui/Button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size cannot exceed 5MB", "error");
      return;
    }

    try {
      setUploading(true);
      const res = await api.upload.coverImage(file);
      if (res.success && res.url) {
        onChange(res.url);
        setUrlInput(res.url);
        showToast("Cover image uploaded successfully!", "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      showToast(msg, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      showToast("Image URL applied", "info");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Cover Image
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === "upload" ? "url" : "upload")}
            className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium"
          >
            {mode === "upload" ? (
              <>
                <LinkIcon className="h-3 w-3" />
                Or enter image URL
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
                Upload file
              </>
            )}
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 aspect-video max-h-48 w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 flex items-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Remove Image
            </button>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center cursor-pointer transition-all hover:border-emerald-600 hover:bg-emerald-50/20 ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-xs font-medium text-zinc-600">Uploading to ImageKit CDN...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-700">Click to upload story cover</p>
                <p className="text-[11px] text-zinc-400">PNG, JPG, or WEBP up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/cover.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
          <Button type="button" size="sm" onClick={handleApplyUrl}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
