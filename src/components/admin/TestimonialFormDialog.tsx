import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateTestimonial, useUpdateTestimonial, type Testimonial } from '@/hooks/useProducts';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
}

export function TestimonialFormDialog({ open, onOpenChange, testimonial }: Props) {
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const isEditing = !!testimonial;

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      author_name: '',
      author_avatar: '',
      rating: 5,
      content: '',
      product_name: '',
      date_label: '',
      is_verified: false,
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        author_name: testimonial.author_name,
        author_avatar: testimonial.author_avatar || '',
        rating: testimonial.rating,
        content: testimonial.content,
        product_name: testimonial.product_name || '',
        date_label: testimonial.date_label || '',
        is_verified: testimonial.is_verified,
        is_active: testimonial.is_active,
        display_order: testimonial.display_order,
      });
    } else {
      reset({ author_name: '', author_avatar: '', rating: 5, content: '', product_name: '', date_label: '', is_verified: false, is_active: true, display_order: 0 });
    }
  }, [testimonial, reset]);

  const onSubmit = (data: any) => {
    if (isEditing && testimonial) {
      updateTestimonial.mutate({ id: testimonial.id, ...data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createTestimonial.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Author Name</Label>
              <Input {...register('author_name', { required: true })} placeholder="e.g. Adeola T." />
            </div>
            <div>
              <Label>Date Label</Label>
              <Input {...register('date_label')} placeholder="e.g. 2 weeks ago" />
            </div>
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input {...register('author_avatar')} placeholder="https://..." />
          </div>
          <div>
            <Label>Review Content</Label>
            <Textarea {...register('content', { required: true })} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input {...register('product_name')} placeholder="Related product" />
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} {...register('rating', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" {...register('display_order', { valueAsNumber: true })} />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={watch('is_verified')} onCheckedChange={(v) => setValue('is_verified', v)} />
              <Label>Verified</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
              <Label>Active</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createTestimonial.isPending || updateTestimonial.isPending}>
              {isEditing ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
