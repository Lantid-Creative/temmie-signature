import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { useProducts, useDeleteProduct, useUpdateProduct } from '@/hooks/useProducts';
import { exportToCsv } from '@/lib/exportCsv';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const { toast } = useToast();

  const filteredProducts = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateProduct.mutate({ id, is_active: !isActive });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts?.map(p => p.id)));
    }
  };

  const handleBulkDeactivate = () => {
    selectedIds.forEach(id => updateProduct.mutate({ id, is_active: false }));
    setSelectedIds(new Set());
    toast({ title: `${selectedIds.size} products deactivated` });
  };

  const handleExport = () => {
    const toExport = selectedIds.size > 0
      ? products?.filter(p => selectedIds.has(p.id))
      : filteredProducts;
    if (!toExport?.length) return;
    exportToCsv('products', toExport.map(p => ({
      name: p.name,
      sku: p.sku || '',
      price: p.price,
      compare_at_price: p.compare_at_price || '',
      stock_quantity: p.stock_quantity,
      category: p.category?.name || '',
      is_active: p.is_active,
      is_featured: p.is_featured,
    })));
    toast({ title: 'Products exported successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Products</h1>
            <p className="text-muted-foreground mt-1">
              {products?.length || 0} products • {products?.filter(p => p.is_active).length || 0} active
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search + Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                Deactivate
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg overflow-hidden bg-background"
        >
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products found</p>
              <Button variant="link" onClick={() => setFormOpen(true)} className="mt-2">
                Add your first product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === filteredProducts?.length && filteredProducts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <TableRow key={product.id} className={selectedIds.has(product.id) ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.featured_image ? (
                          <img
                            src={product.featured_image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category?.name || 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku || '—'}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">${Number(product.price).toFixed(2)}</span>
                        {product.compare_at_price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${Number(product.compare_at_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock_quantity <= (product.low_stock_threshold || 5)
                            ? 'text-destructive font-medium'
                            : ''
                        }
                      >
                        {product.stock_quantity}
                        {product.stock_quantity <= (product.low_stock_threshold || 5) && (
                          <span className="text-xs ml-1">⚠</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.is_active ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">Draft</Badge>
                        )}
                        {product.is_featured && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleActive(product.id, product.is_active)}>
                          {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditProduct(product.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* Count */}
        {filteredProducts && filteredProducts.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products?.length} products
          </p>
        )}
      </div>

      <ProductFormDialog
        open={formOpen || !!editProduct}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditProduct(null);
        }}
        productId={editProduct}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Products;
