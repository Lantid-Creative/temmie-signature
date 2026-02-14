import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBlogPost, useUpdateBlogPost, useBlogPosts } from '@/hooks/useBlog';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string | null;
}

const blogCategories = ['Hair Care', 'Styling Tips', 'Product Guides', 'Trends', 'General'];

export function BlogFormDialog({ open, onOpenChange, postId }: BlogFormDialogProps) {
  const { user } = useAuth();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const { data: posts } = useBlogPosts();

  const existingPost = posts?.find((p) => p.id === postId);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'General',
    author_name: '',
    is_published: false,
    tags: '',
  });

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title,
        slug: existingPost.slug,
        content: existingPost.content || '',
        excerpt: existingPost.excerpt || '',
        featured_image: existingPost.featured_image || '',
        category: existingPost.category || 'General',
        author_name: existingPost.author_name || '',
        is_published: existingPost.is_published,
        tags: existingPost.tags?.join(', ') || '',
      });
    } else {
      setForm({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        category: 'General',
        author_name: '',
        is_published: false,
        tags: '',
      });
    }
  }, [existingPost, open]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = () => {
    const postData = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      content: form.content,
      excerpt: form.excerpt,
      featured_image: form.featured_image || null,
      category: form.category,
      author_id: user?.id || null,
      author_name: form.author_name || null,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData }, { onSuccess: () => onOpenChange(false) });
    } else {
      createPost.mutate(postData, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isLoading = createPost.isPending || updatePost.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{postId ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="post-slug" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Brief summary..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Write your blog post..." rows={10} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {blogCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author Name</Label>
              <Input value={form.author_name} onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))} placeholder="Author" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Featured Image URL</Label>
            <Input value={form.featured_image} onChange={(e) => setForm((p) => ({ ...p, featured_image: e.target.value }))} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="hair care, tips, styling" />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.is_published} onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))} />
            <Label>Publish immediately</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading || !form.title}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {postId ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
