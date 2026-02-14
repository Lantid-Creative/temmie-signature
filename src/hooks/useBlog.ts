import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string | null;
  author_name: string | null;
  category: string;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = (publishedOnly = false) => {
  return useQuery({
    queryKey: ['blog-posts', publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: 'Blog post created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating post', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...post }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: 'Blog post updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating post', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({ title: 'Blog post deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting post', description: error.message, variant: 'destructive' });
    },
  });
};
