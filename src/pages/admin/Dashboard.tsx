import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { toast } = useToast();

  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const lowStockCount = products?.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5) && p.is_active).length || 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
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
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      subtitle: lowStockCount > 0 ? 'Needs attention' : 'All stocked',
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

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RevenueChart orders={orders} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TopProductsChart orders={orders} />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <OrderStatusChart orders={orders} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <RecentActivityFeed orders={orders} products={products} />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
