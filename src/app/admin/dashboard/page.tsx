"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { AdminSidebar, AdminTab } from "../../../components/layout/AdminSidebar";
import { AdminHeader } from "../../../components/layout/AdminHeader";
import { MobileNav } from "../../../components/layout/MobileNav";
import { DashboardOverview } from "../../../components/dashboard/DashboardOverview";
import { PostsManager } from "../../../components/posts/PostsManager";
import { CategoriesManager } from "../../../components/categories/CategoriesManager";
import { TagsManager } from "../../../components/tags/TagsManager";
import { PostEditorModal } from "../../../components/posts/PostEditorModal";
import { CategoryModal } from "../../../components/categories/CategoryModal";
import { TagModal } from "../../../components/tags/TagModal";
import { LoadingScreen } from "../../../components/ui/Spinner";
import { Post, Category, Tag, DashboardMetrics } from "../../../lib/types";
import { api } from "../../../lib/api";
import { useToast } from "../../../context/ToastContext";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<AdminTab>("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modals
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [postsData, categoriesData, tagsData] = await Promise.all([
        api.posts.getAll().catch(() => []),
        api.categories.getAll().catch(() => []),
        api.tags.getAll().catch(() => []),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load studio data";
      showToast(msg, "error");
    } finally {
      setDataLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  // Compute metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;
    const draftPosts = posts.filter((p) => p.status === "DRAFT").length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    return {
      totalPosts: posts.length,
      publishedPosts,
      draftPosts,
      totalViews,
      totalCategories: categories.length,
      totalTags: tags.length,
    };
  }, [posts, categories, tags]);

  const handleOpenNewPost = () => {
    setPostToEdit(null);
    setPostEditorOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setPostEditorOpen(true);
  };

  if (authLoading || (!isAuthenticated && authLoading)) {
    return <LoadingScreen message="Checking authorization..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      {/* Desktop Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        className="hidden lg:flex"
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          currentTab={currentTab}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onNewPost={handleOpenNewPost}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {dataLoading && posts.length === 0 ? (
            <LoadingScreen message="Loading publication content..." />
          ) : (
            <>
              {currentTab === "Overview" && (
                <DashboardOverview
                  posts={posts}
                  metrics={metrics}
                  onNewPost={handleOpenNewPost}
                  onEditPost={handleEditPost}
                  onSelectTab={setCurrentTab}
                />
              )}

              {currentTab === "Posts" && (
                <PostsManager
                  posts={posts}
                  categories={categories}
                  tags={tags}
                  onNewPost={handleOpenNewPost}
                  onEditPost={handleEditPost}
                  onReload={loadDashboardData}
                />
              )}

              {currentTab === "Categories" && (
                <CategoriesManager
                  categories={categories}
                  posts={posts}
                  onReload={loadDashboardData}
                />
              )}

              {currentTab === "Tags" && (
                <TagsManager tags={tags} onReload={loadDashboardData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Post Editor Modal */}
      <PostEditorModal
        isOpen={postEditorOpen}
        onClose={() => setPostEditorOpen(false)}
        postToEdit={postToEdit}
        categories={categories}
        tags={tags}
        onSaved={loadDashboardData}
        onQuickAddCategory={() => setCategoryModalOpen(true)}
        onQuickAddTag={() => setTagModalOpen(true)}
      />

      {/* Quick Category Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={loadDashboardData}
      />

      {/* Quick Tag Modal */}
      <TagModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onSaved={loadDashboardData}
      />
    </div>
  );
}
