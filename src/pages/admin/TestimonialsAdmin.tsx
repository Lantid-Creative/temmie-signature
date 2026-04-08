import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useTestimonials, useDeleteTestimonial, type Testimonial } from '@/hooks/useProducts';
import { TestimonialFormDialog } from '@/components/admin/TestimonialFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TestimonialsAdmin() {
  const { data: testimonials, isLoading } = useTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer testimonials displayed on the homepage.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials?.map((t) => (
            <div key={t.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.author_avatar && (
                    <img src={t.author_avatar} alt={t.author_name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{t.author_name}</p>
                    <p className="text-xs text-muted-foreground">{t.date_label}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(t)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(t.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">"{t.content}"</p>
              {t.product_name && <p className="text-xs text-accent mt-2">Re: {t.product_name}</p>}
              <div className="flex gap-2 mt-3">
                <span className={`text-xs px-2 py-0.5 rounded ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {t.is_active ? 'Active' : 'Inactive'}
                </span>
                {t.is_verified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Verified</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialFormDialog open={showCreate} onOpenChange={setShowCreate} />
      <TestimonialFormDialog open={!!editItem} onOpenChange={() => setEditItem(null)} testimonial={editItem} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteTestimonial.mutate(deleteId); setDeleteId(null); } }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
