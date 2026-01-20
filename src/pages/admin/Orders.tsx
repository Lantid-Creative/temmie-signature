import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useOrders, useUpdateOrder } from '@/hooks/useProducts';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [search, setSearch] = useState('');
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();

  const filteredOrders = orders?.filter(o => o.order_number.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()));

  const handleStatusChange = (id: string, status: string) => {
    updateOrder.mutate({ id, status });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-serif">Orders</h1><p className="text-muted-foreground mt-1">Manage customer orders</p></div>
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border rounded-lg overflow-hidden bg-background">
          {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading orders...</div> : filteredOrders?.length === 0 ? <div className="text-center py-12 text-muted-foreground"><Package className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No orders found</p></div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredOrders?.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell><div><p>{order.email}</p>{order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}</div></TableCell>
                    <TableCell>{order.order_items?.length || 0} items</TableCell>
                    <TableCell className="font-medium">${Number(order.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={v => handleStatusChange(order.id, v)}>
                        <SelectTrigger className="w-32"><Badge className={statusColors[order.status] || 'bg-gray-100'}>{order.status}</Badge></SelectTrigger>
                        <SelectContent>{['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
