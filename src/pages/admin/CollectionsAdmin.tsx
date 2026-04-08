import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { useCollections, useDeleteCollection, type CollectionItem } from '@/hooks/useProducts';
import { CollectionFormDialog } from '@/components/admin/CollectionFormDialog';
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

export default function CollectionsAdmin() {
  const { data: collections, isLoading } = useCollections();
  const deleteCollection = useDeleteCollection();
  const [editItem, setEditItem] = useState<CollectionItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Manage your signature collections displayed on the homepage and collections page.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Collection
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4">
          {collections?.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
              {c.image_url && (
                <img src={c.image_url} alt={c.name} className="w-20 h-20 rounded-lg object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{c.description}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{c.product_count} products</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setEditItem(c)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CollectionFormDialog open={showCreate} onOpenChange={setShowCreate} />
      <CollectionFormDialog open={!!editItem} onOpenChange={() => setEditItem(null)} collection={editItem} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteCollection.mutate(deleteId); setDeleteId(null); } }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
