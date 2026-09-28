import React from "react";
import { Post } from "../../lib/types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../lib/utils";
import { Edit3, Eye, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

interface RecentPostsListProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
  onViewAll: () => void;
}

export function RecentPostsList({ posts, onEditPost, onViewAll }: RecentPostsListProps) {
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-serif">Recent Stories</h3>
          <p className="text-xs text-zinc-500">Your latest written articles and updates</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} icon={<ArrowRight className="h-4 w-4" />}>
          View all
        </Button>
      </div>

      {recentPosts.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No stories written yet. Start drafting your first article.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-zinc-50/70"
            >
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-zinc-900 hover:text-emerald-700">
                    {post.title}
                  </span>
                  <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>
                    {post.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span>{post.category?.name || "Uncategorized"}</span>
                  <span>•</span>
                  <span>{formatDate(post.updatedAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views} views
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEditPost(post)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                  title="Edit story"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
