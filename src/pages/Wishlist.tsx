import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const wishlistProducts = wishlistItems
    .map(item => products.find(p => p.id === item.productId))
    .filter(Boolean) as typeof products;

  if (!user) {
    return (
      <>
        <PageMeta title="My Wishlist | Trazzie" description="Sign in to view and manage your saved products on Trazzie." />
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-serif mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your wishlist.
            </p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <>
        <PageMeta title="My Wishlist | Trazzie" description="Browse your saved wigs and add them to cart when you're ready." />
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-serif mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding items you love to your wishlist!
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </>
    );
  }

  return (
      <>
        <PageMeta title="My Wishlist | Trazzie" description="Your saved wigs and accessories. Add to cart anytime." />
        <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif mb-2">Your Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-card rounded-xl overflow-hidden border"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {product.hairType} • {product.laceType}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3.5 h-3.5',
                          i < Math.floor(product.rating)
                            ? 'text-gold fill-gold'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        addToCart(product, 1, product.colors[0], product.capSize[0])
                      }
                      disabled={!product.inStock}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>

                  {!product.inStock && (
                    <p className="text-xs text-destructive mt-2">Out of Stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      
    </>
  );
}
