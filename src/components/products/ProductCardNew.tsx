import { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { UnifiedProduct } from '@/types/product';

interface ProductCardProps {
  product: UnifiedProduct;
  className?: string;
}

const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

export const ProductCardNew = forwardRef<HTMLDivElement, ProductCardProps>(function ProductCardNew({ product, className }, ref) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { user } = useAuth();
  const { toast } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const isComparing = isInCompare(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  const isBestseller = product.bestseller || product.is_bestseller;
  const isNew = product.new || product.is_featured;

  const productUrl = `/product/${product.slug || product.id}`;

  return (
    <div
      ref={ref}
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[3/4]">
        <Link to={productUrl} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestseller && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
              Bestseller
            </span>
          )}
          {isNew && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={cn(
          'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300',
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        )}>
          <button
            onClick={handleWishlistClick}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md',
              isWishlisted
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-background/90 text-foreground hover:bg-background'
            )}
          >
            <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </button>
          <button
            onClick={handleCompareClick}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md',
              isComparing
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/90 text-foreground hover:bg-background'
            )}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Button
            className="w-full bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary transition-colors rounded-xl h-11"
            asChild
          >
            <Link to={productUrl}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick View
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category.replace('-', ' ')}
        </p>
        <Link to={productUrl}>
          <h3 className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < Math.floor(product.rating)
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-serif text-lg font-semibold text-foreground">
            {formatNaira(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatNaira(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
