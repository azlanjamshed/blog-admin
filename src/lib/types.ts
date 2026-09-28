export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export type PostStatus = "DRAFT" | "PUBLISHED";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  status: PostStatus;
  views: number;
  readingTime: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author: {
    id?: string;
    name: string;
    email?: string;
  };
  categoryId?: string;
  category: Category;
  tags?: Tag[];
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  categoryId: string;
  status: PostStatus;
  tagIds: string[];
}

export interface DashboardMetrics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
}
