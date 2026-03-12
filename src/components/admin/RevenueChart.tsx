import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/hooks/useProducts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface RevenueChartProps {
  orders: Order[] | undefined;
  days?: number;
}

export const RevenueChart = ({ orders, days = 30 }: RevenueChartProps) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const start = subDays(now, days - 1);
    const interval = eachDayOfInterval({ start: startOfDay(start), end: startOfDay(now) });

    return interval.map(date => {
      const dayStr = format(date, 'yyyy-MM-dd');
      const dayOrders = orders?.filter(o => format(new Date(o.created_at), 'yyyy-MM-dd') === dayStr) || [];
      const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total), 0);
      const count = dayOrders.length;

      return {
        date: format(date, 'MMM dd'),
        revenue: Math.round(revenue * 100) / 100,
        orders: count,
      };
    });
  }, [orders, days]);

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270 50% 30%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(270 50% 30%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 15% 90%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'hsl(270 10% 45%)' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(270 10% 45%)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v}`}
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(270 50% 30%)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
