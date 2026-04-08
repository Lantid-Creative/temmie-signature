import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateCollection, useUpdateCollection, type CollectionItem } from '@/hooks/useProducts';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: CollectionItem | null;
}

export function CollectionFormDialog({ open, onOpenChange, collection }: Props) {
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const isEditing = !!collection;

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
      product_count: 0,
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (collection) {
      reset({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        image_url: collection.image_url || '',
        product_count: collection.product_count,
        display_order: collection.display_order,
        is_active: collection.is_active,
      });
    } else {
      reset({ name: '', slug: '', description: '', image_url: '', product_count: 0, display_order: 0, is_active: true });
    }
  }, [collection, reset]);

  const onSubmit = (data: any) => {
    if (isEditing && collection) {
      updateCollection.mutate({ id: collection.id, ...data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createCollection.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  const nameValue = watch('name');
  useEffect(() => {
    if (!isEditing && nameValue) {
      setValue('slug', nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [nameValue, isEditing, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register('name', { required: true })} placeholder="e.g. Urban Safari" />
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...register('slug', { required: true })} placeholder="urban-safari" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input {...register('image_url')} placeholder="https://..." />
            <p className="text-xs text-muted-foreground mt-1">Recommended: 800 × 1000px portrait. Max 5 MB.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Count</Label>
              <Input type="number" {...register('product_count', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" {...register('display_order', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
            <Label>Active</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createCollection.isPending || updateCollection.isPending}>
              {isEditing ? 'Save Changes' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
