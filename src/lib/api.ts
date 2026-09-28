import { Category, Post, PostFormData, Tag, User } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(data.message || `Request failed with status ${res.status}`, res.status);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error or server unreachable";
    throw new ApiError(message, 500);
  }
}

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return fetcher<{ success: boolean; message: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
    me: async () => {
      return fetcher<{ success: boolean; user: User }>("/api/auth/me");
    },
    logout: async () => {
      return fetcher<{ success: boolean; message: string }>("/api/auth/logout", {
        method: "POST",
      });
    },
  },

  posts: {
    getAll: async () => {
      const res = await fetcher<{ success: boolean; count: number; data: Post[] }>("/api/author/posts");
      return res.data || [];
    },
    create: async (data: Partial<PostFormData>) => {
      return fetcher<{ success: boolean; message: string; data: Post }>("/api/author/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<PostFormData>) => {
      return fetcher<{ success: boolean; message: string; data: Post }>(`/api/author/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return fetcher<{ success: boolean; message: string }>(`/api/author/posts/${id}`, {
        method: "DELETE",
      });
    },
  },

  categories: {
    getAll: async () => {
      const res = await fetcher<{ success: boolean; count: number; categories: Category[] }>("/api/categories");
      return res.categories || [];
    },
    create: async (name: string) => {
      return fetcher<{ success: boolean; message: string; category: Category }>("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    update: async (id: string, name: string) => {
      return fetcher<{ success: boolean; message: string; category: Category }>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
    },
    delete: async (id: string) => {
      return fetcher<{ success: boolean; message: string }>(`/api/categories/${id}`, {
        method: "DELETE",
      });
    },
  },

  tags: {
    getAll: async () => {
      const res = await fetcher<{ success: boolean; count: number; data: Tag[] }>("/api/tags");
      return res.data || [];
    },
    create: async (name: string) => {
      return fetcher<{ success: boolean; message: string; data: Tag }>("/api/author/tags", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
  },

  upload: {
    coverImage: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      return fetcher<{ success: boolean; message: string; url: string }>("/api/author/upload", {
        method: "POST",
        body: formData,
      });
    },
  },
};
