import { ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, Product } from '@/hooks/useProducts';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentActivityFeedProps {
  orders: Order[] | undefined;
  products: Product[] | undefined;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'low_stock';
  title: string;
  description: string;
  time: Date;
  icon: typeof ShoppingCart;
  iconColor: string;
}

export const RecentActivityFeed = ({ orders, products }: RecentActivityFeedProps) => {
  const activities: ActivityItem[] = [];

  // Recent orders
  orders?.slice(0, 5).forEach(order => {
    activities.push({
      id: `order-${order.id}`,
      type: 'order',
      title: `New order ${order.order_number}`,
      description: `$${Number(order.total).toFixed(2)} • ${order.email}`,
      time: new Date(order.created_at),
      icon: ShoppingCart,
      iconColor: 'text-blue-600 bg-blue-100',
    });
  });

  // Low stock alerts
  products
    ?.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5) && p.is_active)
    .slice(0, 3)
    .forEach(product => {
      activities.push({
        id: `stock-${product.id}`,
        type: 'low_stock',
        title: `Low stock: ${product.name}`,
        description: `Only ${product.stock_quantity} left in stock`,
        time: new Date(product.updated_at),
        icon: AlertTriangle,
        iconColor: 'text-amber-600 bg-amber-100',
      });
    });

  // Sort by time
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No recent activity
          </div>
        ) : (
          <div className="space-y-1">
            {activities.slice(0, 8).map((activity, i) => (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                  i < activities.length - 1 && 'border-b border-border/50'
                )}
              >
                <div className={cn('rounded-lg p-2 mt-0.5', activity.iconColor)}>
                  <activity.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
