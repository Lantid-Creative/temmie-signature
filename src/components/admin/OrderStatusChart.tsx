import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface OrderStatusChartProps {
  orders: Order[] | undefined;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500', bg: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Processing', color: 'bg-blue-500', bg: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Shipped', color: 'bg-purple-500', bg: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-500', bg: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', bg: 'bg-red-100 text-red-700' },
};

export const OrderStatusChart = ({ orders }: OrderStatusChartProps) => {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders?.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    const total = orders?.length || 1;
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100),
      ...statusConfig[status] || { label: status, color: 'bg-gray-500', bg: 'bg-gray-100 text-gray-700' },
    }));
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Status</CardTitle>
        <CardDescription>Distribution of current orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusData.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">No orders yet</div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {statusData.map((s) => (
                <div
                  key={s.status}
                  className={cn('h-full transition-all', s.color)}
                  style={{ width: `${s.percentage}%` }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {statusData.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded-full', s.color)} />
                    <span className="text-sm font-medium capitalize">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs font-medium rounded-full px-2 py-0.5', s.bg)}>
                      {s.count}
                    </span>
                    <span className="text-xs text-muted-foreground w-8 text-right">{s.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
