import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/hooks/useProducts';

interface TopProductsChartProps {
  orders: Order[] | undefined;
}

export const TopProductsChart = ({ orders }: TopProductsChartProps) => {
  const chartData = useMemo(() => {
    const productMap = new Map<string, { name: string; revenue: number; quantity: number }>();

    orders?.forEach(order => {
      order.order_items?.forEach(item => {
        const existing = productMap.get(item.product_name) || { name: item.product_name, revenue: 0, quantity: 0 };
        existing.revenue += Number(item.price) * item.quantity;
        existing.quantity += item.quantity;
        productMap.set(item.product_name, existing);
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
      .map(p => ({
        ...p,
        name: p.name.length > 18 ? p.name.substring(0, 18) + '…' : p.name,
        revenue: Math.round(p.revenue * 100) / 100,
      }));
  }, [orders]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Products</CardTitle>
          <CardDescription>By revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            No order data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Products</CardTitle>
        <CardDescription>By revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 15% 90%)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: 'hsl(270 10% 45%)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: 'hsl(270 10% 45%)' }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(270 15% 99%)',
                  border: '1px solid hsl(270 15% 90%)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(45 75% 55%)"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
