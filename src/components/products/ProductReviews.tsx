import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please sign in to leave a review', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title: title.trim() || null,
      content: content.trim() || null,
    });

    if (error) {
      toast({ title: 'Failed to submit review', variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted!', description: 'It will appear once approved.' });
      setRating(0);
      setTitle('');
      setContent('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Customer Reviews</h3>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('w-4 h-4', i < Math.round(avgRating) ? 'text-gold fill-gold' : 'text-muted-foreground')} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary/50 rounded-xl p-6 mb-8 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Rating *</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star className={cn(
                    'w-6 h-6 transition-colors',
                    star <= (hoverRating || rating) ? 'text-gold fill-gold' : 'text-muted-foreground'
                  )} />
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="Review title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Tell others about your experience..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit Review'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this product!</p>
          {!user && (
            <Button variant="outline" asChild>
              <a href="/auth">Sign in to review</a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('w-4 h-4', i < review.rating ? 'text-gold fill-gold' : 'text-muted-foreground')} />
                ))}
              </div>
              {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
              {review.content && <p className="text-muted-foreground text-sm mb-3">{review.content}</p>}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {review.is_verified && <span className="text-primary font-medium">✓ Verified Purchase</span>}
                <span>{format(new Date(review.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
