import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBlog } from "@shared/routes";

export function useBlogs() {
  return useQuery({
    queryKey: [api.blogs.list.path],
    queryFn: async () => {
      const res = await fetch(api.blogs.list.path);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return api.blogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useBlog(slugOrId: string | number) {
  // Check if it's likely an ID (number) or slug (string)
  const isSlug = typeof slugOrId === 'string' && Number.isNaN(Number(slugOrId));
  const id = isSlug ? undefined : Number(slugOrId);
  const slug = isSlug ? slugOrId : undefined;

  // The API supports slug lookup for public view, but we might need id for admin edit
  // Assuming the get endpoint handles slug primarily for public view
  // If we are in admin edit mode, we might fetch list and filter or use a specific by-id logic if API supported it
  // Based on routes, GET /api/blogs/:slug is defined. Let's assume slug works for both or ID works if numeric.

  return useQuery({
    queryKey: [api.blogs.get.path, slugOrId],
    queryFn: async () => {
      const url = buildUrl(api.blogs.get.path, { slug: slugOrId }); 
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch blog");
      return api.blogs.get.responses[200].parse(await res.json());
    },
    enabled: !!slugOrId,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBlog) => {
      const res = await fetch(api.blogs.create.path, {
        method: api.blogs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create blog");
      return api.blogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<InsertBlog> & { id: number }) => {
      const url = buildUrl(api.blogs.update.path, { id });
      const res = await fetch(url, {
        method: api.blogs.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update blog");
      return api.blogs.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.blogs.delete.path, { id });
      const res = await fetch(url, { 
        method: api.blogs.delete.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete blog");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] }),
  });
}
