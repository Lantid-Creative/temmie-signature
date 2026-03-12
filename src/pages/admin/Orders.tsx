import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useOrders, useUpdateOrder } from '@/hooks/useProducts';
import { exportToCsv } from '@/lib/exportCsv';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const { toast } = useToast();

  const filteredOrders = orders?.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateOrder.mutate({ id, status });
  };

  const handleExport = () => {
    if (!filteredOrders?.length) {
      toast({ title: 'No orders to export', variant: 'destructive' });
      return;
    }
    exportToCsv('orders', filteredOrders.map(o => ({
      order_number: o.order_number,
      email: o.email,
      phone: o.phone || '',
      status: o.status,
      items: o.order_items?.length || 0,
      subtotal: o.subtotal,
      discount: o.discount_amount || 0,
      shipping: o.shipping_amount || 0,
      total: o.total,
      date: format(new Date(o.created_at), 'yyyy-MM-dd HH:mm'),
    })));
    toast({ title: 'Orders exported successfully' });
  };

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'processing').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track customer orders
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: orderStats.total, color: 'bg-muted' },
            { label: 'Pending', value: orderStats.pending, color: 'bg-yellow-100' },
            { label: 'Processing', value: orderStats.processing, color: 'bg-blue-100' },
            { label: 'Delivered', value: orderStats.delivered, color: 'bg-green-100' },
          ].map(stat => (
            <Card key={stat.label} className="border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg overflow-hidden bg-background"
        >
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
          ) : filteredOrders?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No orders found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map(order => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-medium font-mono text-sm">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.email}</p>
                        {order.phone && <p className="text-xs text-muted-foreground">{order.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{order.order_items?.length || 0} items</span>
                    </TableCell>
                    <TableCell className="font-medium">${Number(order.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={v => handleStatusChange(order.id, v)}>
                        <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent p-0">
                          <Badge className={statusColors[order.status] || 'bg-muted text-muted-foreground'}>
                            {order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* Count */}
        {filteredOrders && filteredOrders.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders?.length} orders
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
