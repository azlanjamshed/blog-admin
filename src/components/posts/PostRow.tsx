import React from "react";
import { Post } from "../../lib/types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../lib/utils";
import { Edit2, Trash2, Eye, ExternalLink, Clock } from "lucide-react";

interface PostRowProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostRow({ post, onEdit, onDelete }: PostRowProps) {
  return (
    <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/80">
      {/* Title & Cover */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt=""
              className="h-12 w-16 shrink-0 rounded-lg object-cover border border-zinc-200"
            />
          ) : (
            <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-semibold text-zinc-400 border border-zinc-200 uppercase">
              No Art
            </div>
          )}
          <div className="min-w-0 max-w-md">
            <p className="truncate font-semibold text-zinc-900 text-sm hover:text-emerald-700">
              {post.title}
            </p>
            {post.excerpt && (
              <p className="truncate text-xs text-zinc-400 mt-0.5">{post.excerpt}</p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {post.category?.name || "Uncategorized"}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>
          {post.status === "PUBLISHED" ? "Published" : "Draft"}
        </Badge>
      </td>

      {/* Views & Reading Time */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-zinc-400" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            {post.readingTime}m
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
        {formatDate(post.updatedAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex items-center justify-end gap-1">
          {post.status === "PUBLISHED" && (
            <a
              href={`http://localhost:3000/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-emerald-600 transition-colors"
              title="View on live journal"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => onEdit(post)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            title="Edit story"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(post)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Delete story"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
