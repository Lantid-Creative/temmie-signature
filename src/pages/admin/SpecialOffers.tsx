import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Percent, Search, Copy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type SpecialOffer = Tables<'special_offers'>;

interface OfferFormData {
  name: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order: number | null;
  max_uses: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

const SpecialOffers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<OfferFormData>({
    name: '',
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order: null,
    max_uses: null,
    starts_at: '',
    ends_at: '',
    is_active: true,
  });

  const queryClient = useQueryClient();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['admin-special-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SpecialOffer[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: OfferFormData) => {
      const insertData = {
        ...data,
        starts_at: data.starts_at || null,
        ends_at: data.ends_at || null,
      };
      const { error } = await supabase.from('special_offers').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-offers'] });
      toast.success('Special offer created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create offer: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OfferFormData> }) => {
      const updateData = {
        ...data,
        starts_at: data.starts_at || null,
        ends_at: data.ends_at || null,
      };
      const { error } = await supabase.from('special_offers').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-offers'] });
      toast.success('Special offer updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update offer: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('special_offers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-offers'] });
      toast.success('Special offer deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete offer: ' + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      minimum_order: null,
      max_uses: null,
      starts_at: '',
      ends_at: '',
      is_active: true,
    });
    setEditingOffer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      code: offer.code || '',
      description: offer.description || '',
      discount_type: offer.discount_type as 'percentage' | 'fixed',
      discount_value: offer.discount_value,
      minimum_order: offer.minimum_order,
      max_uses: offer.max_uses,
      starts_at: offer.starts_at ? format(new Date(offer.starts_at), "yyyy-MM-dd'T'HH:mm") : '',
      ends_at: offer.ends_at ? format(new Date(offer.ends_at), "yyyy-MM-dd'T'HH:mm") : '',
      is_active: offer.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const filteredOffers = offers?.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOfferStatus = (offer: SpecialOffer) => {
    if (!offer.is_active) return 'inactive';
    const now = new Date();
    if (offer.starts_at && new Date(offer.starts_at) > now) return 'scheduled';
    if (offer.ends_at && new Date(offer.ends_at) < now) return 'expired';
    if (offer.max_uses && offer.uses_count >= offer.max_uses) return 'exhausted';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'exhausted':
        return <Badge variant="secondary">Exhausted</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Special Offers & Coupons</h1>
            <p className="text-muted-foreground">Manage discounts and promotional codes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOffer ? 'Edit Special Offer' : 'Create New Offer'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Offer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Summer Sale 2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER20"
                    />
                    <Button type="button" variant="outline" onClick={generateCode}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Save 20% on all wigs this summer!"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_type">Discount Type</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value: 'percentage' | 'fixed') =>
                        setFormData({ ...formData, discount_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">Discount Value</Label>
                    <Input
                      id="discount_value"
                      type="number"
                      min="0"
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimum_order">Minimum Order ($)</Label>
                    <Input
                      id="minimum_order"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimum_order || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimum_order: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="No minimum"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_uses">Max Uses</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      min="1"
                      value={formData.max_uses || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_uses: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starts_at">Starts At</Label>
                    <Input
                      id="starts_at"
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ends_at">Ends At</Label>
                    <Input
                      id="ends_at"
                      type="datetime-local"
                      value={formData.ends_at}
                      onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingOffer ? 'Update' : 'Create'} Offer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading offers...
                  </TableCell>
                </TableRow>
              ) : filteredOffers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No offers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers?.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>
                      {offer.code ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">{offer.code}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCode(offer.code!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {offer.discount_type === 'percentage'
                          ? `${offer.discount_value}%`
                          : `$${offer.discount_value}`}
                      </span>
                      {offer.minimum_order && (
                        <span className="text-muted-foreground text-xs block">
                          Min: ${offer.minimum_order}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span>
                        {offer.uses_count}
                        {offer.max_uses ? ` / ${offer.max_uses}` : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {offer.starts_at
                          ? format(new Date(offer.starts_at), 'MMM d')
                          : 'Now'}
                        {' - '}
                        {offer.ends_at
                          ? format(new Date(offer.ends_at), 'MMM d')
                          : 'Forever'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(getOfferStatus(offer))}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(offer)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this offer?')) {
                              deleteMutation.mutate(offer.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SpecialOffers;
