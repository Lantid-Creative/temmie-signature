import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Download,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/DashboardStats';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { TopProductsChart } from '@/components/admin/TopProductsChart';
import { OrderStatusChart } from '@/components/admin/OrderStatusChart';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { useProducts, useOrders } from '@/hooks/useProducts';
import { exportToCsv } from '@/lib/exportCsv';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const lowStockProducts = products?.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5) && p.is_active) || [];

  const stats = [
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      accent: true,
      subtitle: `From ${totalOrders} orders`,
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      subtitle: `${pendingOrders} pending`,
    },
    {
      title: 'Products',
      value: totalProducts.toString(),
      icon: Package,
      subtitle: `${products?.filter(p => p.is_active).length || 0} active`,
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      subtitle: lowStockProducts.length > 0 ? 'Needs attention' : 'All stocked',
    },
  ];

  const handleExportOrders = () => {
    if (!orders?.length) {
      toast({ title: 'No orders to export', variant: 'destructive' });
      return;
    }
    exportToCsv('orders', orders.map(o => ({
      order_number: o.order_number,
      email: o.email,
      status: o.status,
      subtotal: o.subtotal,
      total: o.total,
      created_at: o.created_at,
    })));
    toast({ title: 'Orders exported successfully' });
  };

  const handleExportProducts = () => {
    if (!products?.length) {
      toast({ title: 'No products to export', variant: 'destructive' });
      return;
    }
    exportToCsv('products', products.map(p => ({
      name: p.name,
      sku: p.sku || '',
      price: p.price,
      stock_quantity: p.stock_quantity,
      category: p.category?.name || '',
      is_active: p.is_active,
    })));
    toast({ title: 'Products exported successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your store overview.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportOrders}>
              <Download className="h-4 w-4" />
              Export Orders
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportProducts}>
              <Download className="h-4 w-4" />
              Export Products
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.title} {...stat} index={i} />
          ))}
        </div>

        {/* Low Stock Alert Table */}
        {lowStockProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="border-destructive/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Products ({lowStockProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.slice(0, 5).map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="font-mono text-sm">{product.sku || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{product.stock_quantity}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.low_stock_threshold || 5}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                            <Eye className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {lowStockProducts.length > 5 && (
                  <Button variant="link" className="mt-2" onClick={() => navigate('/admin/products')}>
                    View all {lowStockProducts.length} low stock products →
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <RevenueChart orders={orders} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <TopProductsChart orders={orders} />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <OrderStatusChart orders={orders} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
            <RecentActivityFeed orders={orders} products={products} />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
