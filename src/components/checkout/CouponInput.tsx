import { useState } from 'react';
import { Tag, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppliedCoupon {
  id: string;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
}

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}

export function CouponInput({ subtotal, appliedCoupon, onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .ilike('code', code.trim())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      toast({ title: 'Invalid coupon code', variant: 'destructive' });
      setIsValidating(false);
      return;
    }

    // Check date validity
    const now = new Date();
    if (data.starts_at && new Date(data.starts_at) > now) {
      toast({ title: 'This coupon is not yet active', variant: 'destructive' });
      setIsValidating(false);
      return;
    }
    if (data.ends_at && new Date(data.ends_at) < now) {
      toast({ title: 'This coupon has expired', variant: 'destructive' });
      setIsValidating(false);
      return;
    }

    // Check usage limit
    if (data.max_uses && data.uses_count >= data.max_uses) {
      toast({ title: 'This coupon has reached its usage limit', variant: 'destructive' });
      setIsValidating(false);
      return;
    }

    // Check minimum order
    if (data.minimum_order && subtotal < Number(data.minimum_order)) {
      toast({ title: `Minimum order of $${Number(data.minimum_order).toFixed(2)} required`, variant: 'destructive' });
      setIsValidating(false);
      return;
    }

    onApply({
      id: data.id,
      code: data.code!,
      name: data.name,
      discount_type: data.discount_type,
      discount_value: Number(data.discount_value),
    });
    toast({ title: `Coupon "${data.code}" applied!` });
    setIsValidating(false);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{appliedCoupon.code}</span>
          <span className="text-xs text-muted-foreground">
            ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% off` : `$${appliedCoupon.discount_value} off`})
          </span>
        </div>
        <button onClick={onRemove} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Coupon code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="flex-1"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <Button variant="outline" onClick={handleApply} disabled={isValidating || !code.trim()}>
        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
      </Button>
    </div>
  );
}

export function calculateDiscount(coupon: AppliedCoupon | null, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.discount_type === 'percentage') {
    return subtotal * (coupon.discount_value / 100);
  }
  return Math.min(coupon.discount_value, subtotal);
}
