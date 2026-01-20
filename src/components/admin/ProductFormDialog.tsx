import { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProduct, useCreateProduct, useUpdateProduct, useCategories } from '@/hooks/useProducts';
import { useImageUpload } from '@/hooks/useImageUpload';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock_quantity: z.number().min(0, 'Stock must be positive'),
});

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string | null;
}

export const ProductFormDialog = ({ open, onOpenChange, productId }: ProductFormDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: existingProduct, isLoading: productLoading } = useProduct(productId || '');
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { upload, isUploading } = useImageUpload('products');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compare_at_price: null as number | null,
    cost_price: null as number | null,
    sku: '',
    stock_quantity: 0,
    low_stock_threshold: 5,
    category_id: null as string | null,
    hair_type: '',
    lace_type: '',
    length: '',
    density: '',
    cap_size: [] as string[],
    colors: [] as string[],
    images: [] as string[],
    featured_image: '',
    is_featured: false,
    is_active: true,
    is_bestseller: false,
    care_instructions: '',
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
  });

  const [newCapSize, setNewCapSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingProduct && productId) {
      setForm({
        name: existingProduct.name,
        slug: existingProduct.slug,
        description: existingProduct.description || '',
        price: Number(existingProduct.price),
        compare_at_price: existingProduct.compare_at_price ? Number(existingProduct.compare_at_price) : null,
        cost_price: existingProduct.cost_price ? Number(existingProduct.cost_price) : null,
        sku: existingProduct.sku || '',
        stock_quantity: existingProduct.stock_quantity,
        low_stock_threshold: existingProduct.low_stock_threshold || 5,
        category_id: existingProduct.category_id,
        hair_type: existingProduct.hair_type || '',
        lace_type: existingProduct.lace_type || '',
        length: existingProduct.length || '',
        density: existingProduct.density || '',
        cap_size: existingProduct.cap_size || [],
        colors: existingProduct.colors || [],
        images: existingProduct.images || [],
        featured_image: existingProduct.featured_image || '',
        is_featured: existingProduct.is_featured,
        is_active: existingProduct.is_active,
        is_bestseller: existingProduct.is_bestseller,
        care_instructions: existingProduct.care_instructions || '',
        meta_title: existingProduct.meta_title || '',
        meta_description: existingProduct.meta_description || '',
        tags: existingProduct.tags || [],
      });
    } else if (!productId) {
      setForm({
        name: '',
        slug: '',
        description: '',
        price: 0,
        compare_at_price: null,
        cost_price: null,
        sku: '',
        stock_quantity: 0,
        low_stock_threshold: 5,
        category_id: null,
        hair_type: '',
        lace_type: '',
        length: '',
        density: '',
        cap_size: [],
        colors: [],
        images: [],
        featured_image: '',
        is_featured: false,
        is_active: true,
        is_bestseller: false,
        care_instructions: '',
        meta_title: '',
        meta_description: '',
        tags: [],
      });
    }
  }, [existingProduct, productId, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: f.slug || generateSlug(name),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) {
        setForm((f) => ({
          ...f,
          images: [...f.images, url],
          featured_image: f.featured_image || url,
        }));
      }
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => {
      const newImages = f.images.filter((_, i) => i !== index);
      return {
        ...f,
        images: newImages,
        featured_image: newImages[0] || '',
      };
    });
  };

  const setFeaturedImage = (url: string) => {
    setForm((f) => ({ ...f, featured_image: url }));
  };

  const addItem = (field: 'cap_size' | 'colors' | 'tags', value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      setForm((f) => ({
        ...f,
        [field]: [...f[field], value.trim()],
      }));
      setValue('');
    }
  };

  const removeItem = (field: 'cap_size' | 'colors' | 'tags', index: number) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      productSchema.parse(form);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    const productData = {
      ...form,
      barcode: null,
      cap_size: form.cap_size.length > 0 ? form.cap_size : null,
      colors: form.colors.length > 0 ? form.colors : null,
      images: form.images.length > 0 ? form.images : null,
      tags: form.tags.length > 0 ? form.tags : null,
      category_id: form.category_id || null,
      compare_at_price: form.compare_at_price || null,
      cost_price: form.cost_price || null,
      sku: form.sku || null,
      hair_type: form.hair_type || null,
      lace_type: form.lace_type || null,
      length: form.length || null,
      density: form.density || null,
      featured_image: form.featured_image || null,
      care_instructions: form.care_instructions || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };

    if (productId) {
      updateProduct.mutate({ id: productId, ...productData }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {productId ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        {productLoading && productId ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Product name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="product-slug"
                  />
                  {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Product description..."
                  rows={4}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare at Price ($)</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={form.compare_at_price || ''}
                    onChange={(e) => setForm((f) => ({ ...f, compare_at_price: parseFloat(e.target.value) || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price ($)</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={form.cost_price || ''}
                    onChange={(e) => setForm((f) => ({ ...f, cost_price: parseFloat(e.target.value) || null }))}
                  />
                </div>
              </div>

              {/* Inventory */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock_quantity}
                    onChange={(e) => setForm((f) => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={form.low_stock_threshold}
                    onChange={(e) => setForm((f) => ({ ...f, low_stock_threshold: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category_id || 'none'}
                  onValueChange={(v) => setForm((f) => ({ ...f, category_id: v === 'none' ? null : v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wig Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hair_type">Hair Type</Label>
                  <Select
                    value={form.hair_type || 'none'}
                    onValueChange={(v) => setForm((f) => ({ ...f, hair_type: v === 'none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hair type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="Human Hair">Human Hair</SelectItem>
                      <SelectItem value="Synthetic">Synthetic</SelectItem>
                      <SelectItem value="Blend">Blend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lace_type">Lace Type</Label>
                  <Select
                    value={form.lace_type || 'none'}
                    onValueChange={(v) => setForm((f) => ({ ...f, lace_type: v === 'none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lace type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="13x4 HD Lace">13x4 HD Lace</SelectItem>
                      <SelectItem value="13x6 Frontal">13x6 Frontal</SelectItem>
                      <SelectItem value="4x4 Closure">4x4 Closure</SelectItem>
                      <SelectItem value="5x5 Closure">5x5 Closure</SelectItem>
                      <SelectItem value="Full Lace">Full Lace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    value={form.length}
                    onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))}
                    placeholder='e.g. 22"'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="density">Density</Label>
                  <Select
                    value={form.density || 'none'}
                    onValueChange={(v) => setForm((f) => ({ ...f, density: v === 'none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="130%">130%</SelectItem>
                      <SelectItem value="150%">150%</SelectItem>
                      <SelectItem value="180%">180%</SelectItem>
                      <SelectItem value="200%">200%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cap Sizes */}
              <div className="space-y-2">
                <Label>Cap Sizes</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.cap_size.map((size, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                    >
                      {size}
                      <button type="button" onClick={() => removeItem('cap_size', i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add cap size (e.g. Medium)"
                    value={newCapSize}
                    onChange={(e) => setNewCapSize(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('cap_size', newCapSize, setNewCapSize))}
                  />
                  <Button type="button" variant="outline" onClick={() => addItem('cap_size', newCapSize, setNewCapSize)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.colors.map((color, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                    >
                      {color}
                      <button type="button" onClick={() => removeItem('colors', i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add color (e.g. Natural Black)"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor, setNewColor))}
                  />
                  <Button type="button" variant="outline" onClick={() => addItem('colors', newColor, setNewColor)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Product ${i + 1}`}
                        className={`w-full h-full object-cover rounded-lg border-2 ${
                          url === form.featured_image ? 'border-accent' : 'border-transparent'
                        }`}
                        onClick={() => setFeaturedImage(url)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {url === form.featured_image && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-accent text-xs rounded text-foreground">
                          Featured
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Care Instructions */}
              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <Textarea
                  id="care"
                  value={form.care_instructions}
                  onChange={(e) => setForm((f) => ({ ...f, care_instructions: e.target.value }))}
                  placeholder="Enter care instructions..."
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {form.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button type="button" onClick={() => removeItem('tags', i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags', newTag, setNewTag))}
                  />
                  <Button type="button" variant="outline" onClick={() => addItem('tags', newTag, setNewTag)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* SEO */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={form.meta_title}
                    onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                    placeholder="SEO title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={form.meta_description}
                    onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                    placeholder="SEO description"
                    rows={2}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_bestseller"
                    checked={form.is_bestseller}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_bestseller: v }))}
                  />
                  <Label htmlFor="is_bestseller">Bestseller</Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {productId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    productId ? 'Update Product' : 'Create Product'
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
