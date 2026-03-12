import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  index: number;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, accent, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
  >
    <Card className={cn(
      'relative overflow-hidden border transition-all hover:shadow-md',
      accent && 'bg-primary text-primary-foreground border-primary'
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              'text-sm font-medium',
              accent ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}>
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className={cn(
                'text-xs',
                accent ? 'text-primary-foreground/60' : 'text-muted-foreground'
              )}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs font-medium">
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5',
                  trend.positive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                  accent && trend.positive && 'bg-green-500/20 text-green-200',
                  accent && !trend.positive && 'bg-red-500/20 text-red-200',
                )}>
                  {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
                <span className={accent ? 'text-primary-foreground/50' : 'text-muted-foreground'}>
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            'rounded-xl p-3',
            accent ? 'bg-primary-foreground/10' : 'bg-muted'
          )}>
            <Icon className={cn(
              'h-5 w-5',
              accent ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
