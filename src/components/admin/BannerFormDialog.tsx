import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBanners, useCreateBanner, useUpdateBanner } from '@/hooks/useProducts';
import { useImageUpload } from '@/hooks/useImageUpload';

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerId?: string | null;
}

export const BannerFormDialog = ({ open, onOpenChange, bannerId }: BannerFormDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: banners } = useBanners();
  const existingBanner = banners?.find(b => b.id === bannerId);
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const { upload, isUploading } = useImageUpload('banners');

  const [form, setForm] = useState({ title: '', subtitle: '', description: '', image_url: '', link_url: '', button_text: '', position: 'hero', display_order: 0, is_active: true });

  useEffect(() => {
    if (existingBanner && bannerId) {
      setForm({ title: existingBanner.title, subtitle: existingBanner.subtitle || '', description: existingBanner.description || '', image_url: existingBanner.image_url, link_url: existingBanner.link_url || '', button_text: existingBanner.button_text || '', position: existingBanner.position, display_order: existingBanner.display_order, is_active: existingBanner.is_active });
    } else if (!bannerId) {
      setForm({ title: '', subtitle: '', description: '', image_url: '', link_url: '', button_text: '', position: 'hero', display_order: 0, is_active: true });
    }
  }, [existingBanner, bannerId, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await upload(file);
      if (url) setForm(f => ({ ...f, image_url: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, subtitle: form.subtitle || null, description: form.description || null, mobile_image_url: null, link_url: form.link_url || null, button_text: form.button_text || null, starts_at: null, ends_at: null };
    if (bannerId) updateBanner.mutate({ id: bannerId, ...data }, { onSuccess: () => onOpenChange(false) });
    else createBanner.mutate(data, { onSuccess: () => onOpenChange(false) });
  };

  const isSubmitting = createBanner.isPending || updateBanner.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-serif text-2xl">{bannerId ? 'Edit Banner' : 'Add New Banner'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Banner Image *</Label>
            {form.image_url ? (
              <div className="relative"><img src={form.image_url} alt="Banner" className="w-full h-40 object-cover rounded-lg" /><Button type="button" variant="secondary" size="sm" className="absolute top-2 right-2" onClick={() => fileInputRef.current?.click()}>Change</Button></div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors" disabled={isUploading}>
                {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <><Upload className="h-8 w-8 text-muted-foreground" /><span className="text-sm text-muted-foreground">Upload banner image</span></>}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Banner title" required /></div>
          <div className="space-y-2"><Label>Subtitle</Label><Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Banner subtitle" /></div>
          <div className="space-y-2"><Label>Position</Label><Select value={form.position} onValueChange={v => setForm(f => ({ ...f, position: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hero">Hero</SelectItem><SelectItem value="promo">Promo</SelectItem><SelectItem value="footer">Footer</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Link URL</Label><Input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} placeholder="/shop" /></div>
            <div className="space-y-2"><Label>Button Text</Label><Input value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} placeholder="Shop Now" /></div>
          </div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !form.image_url || !form.title}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : 'Save Banner'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
