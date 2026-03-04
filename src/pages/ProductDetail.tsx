import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, Star, Truck, Shield, RotateCcw, Check, Loader2, GitCompare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';
import { ProductReviews } from '@/components/products/ProductReviews';

import { ProductCardNew } from '@/components/products/ProductCardNew';
import { products as mockProducts } from '@/lib/data';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { normalizeProduct, type UnifiedProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { user } = useAuth();
  const { toast } = useToast();

  // Try to fetch from database first
  const { data: dbProduct, isLoading: dbLoading } = useProduct(id || '');
  const { data: allDbProducts } = useProducts();

  // Normalize the product
  const product: UnifiedProduct | null = useMemo(() => {
    if (dbProduct) {
      return normalizeProduct(dbProduct);
    }
    // Fallback to mock data
    const mockProduct = mockProducts.find((p) => p.id === id);
    if (mockProduct) {
      return {
        ...mockProduct,
        slug: mockProduct.id,
        originalPrice: mockProduct.originalPrice,
        compare_at_price: mockProduct.originalPrice || null,
        featured_image: mockProduct.image,
        category_id: null,
        hair_type: mockProduct.hairType,
        lace_type: mockProduct.laceType,
        cap_size: mockProduct.capSize,
        care_instructions: mockProduct.careInstructions.join('\n'),
        stock_quantity: mockProduct.inStock ? 10 : 0,
        is_bestseller: mockProduct.bestseller,
        is_featured: mockProduct.new,
      };
    }
    return null;
  }, [dbProduct, id]);

  // Related products
  const relatedProducts: UnifiedProduct[] = useMemo(() => {
    if (!product) return [];
    
    if (allDbProducts && allDbProducts.length > 0) {
      return allDbProducts
        .filter(p => p.id !== product.id && p.category_id === product.category_id)
        .slice(0, 4)
        .map(normalizeProduct);
    }
    
    return mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
      .map(p => ({
        ...p,
        slug: p.id,
        originalPrice: p.originalPrice,
        compare_at_price: p.originalPrice || null,
        featured_image: p.image,
        category_id: null,
        hair_type: p.hairType,
        lace_type: p.laceType,
        cap_size: p.capSize,
        care_instructions: p.careInstructions.join('\n'),
        stock_quantity: p.inStock ? 10 : 0,
        is_bestseller: p.bestseller,
        is_featured: p.new,
      }));
  }, [product, allDbProducts]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCapSize, setSelectedCapSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Set defaults when product loads
  useMemo(() => {
    if (product) {
      if (!selectedColor && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (!selectedCapSize && product.capSize.length > 0) {
        setSelectedCapSize(product.capSize[0]);
      }
    }
  }, [product, selectedColor, selectedCapSize]);

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isWishlisted = isInWishlist(product.id);
  const isComparing = isInCompare(product.id);
  const isBestseller = product.bestseller || product.is_bestseller;
  const isNew = product.new || product.is_featured;

  const handleAddToCart = () => {
    // Convert to format expected by cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      images: product.images,
      category: product.category,
      hairType: product.hairType as 'Human Hair' | 'Synthetic',
      laceType: product.laceType,
      length: product.length,
      density: product.density,
      capSize: product.capSize,
      colors: product.colors,
      description: product.description,
      careInstructions: product.careInstructions,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      bestseller: product.bestseller,
      new: product.new,
    };
    addToCart(cartProduct, quantity, selectedColor, selectedCapSize);
  };

  const handleWishlistClick = () => {
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

  const handleCompareClick = () => {
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <PageMeta title={`${product.name} | Trazzie`} description={product.description.slice(0, 155)} />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[
            { label: 'Shop', href: '/shop' },
            { label: product.name }
          ]} />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                        selectedImage === index ? 'border-gold' : 'border-transparent'
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {isBestseller && (
                  <span className="px-3 py-1 bg-gold text-accent-foreground text-xs font-semibold rounded-full">
                    Bestseller
                  </span>
                )}
                {isNew && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    New Arrival
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif text-3xl font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-sm font-semibold rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl mb-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Hair Type</p>
                  <p className="font-medium">{product.hairType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Lace Type</p>
                  <p className="font-medium">{product.laceType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Length</p>
                  <p className="font-medium">{product.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Density</p>
                  <p className="font-medium">{product.density}</p>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <p className="font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm transition-all',
                        selectedColor === color
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-border hover:border-gold'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cap Size Selection */}
              <div className="mb-8">
                <p className="font-medium mb-3">Cap Size: <span className="text-muted-foreground">{selectedCapSize}</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.capSize.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedCapSize(size)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm transition-all',
                        selectedCapSize === size
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-border hover:border-gold'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={cn('h-12 w-12', isWishlisted && 'text-rose border-rose')}
                  onClick={handleWishlistClick}
                >
                  <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={cn('h-12 w-12', isComparing && 'text-primary border-primary')}
                  onClick={handleCompareClick}
                >
                  <GitCompare className="w-5 h-5" />
                </Button>
              </div>

              {/* Buy Now */}
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gold text-gold hover:bg-gold hover:text-accent-foreground mb-8"
                asChild
              >
                <Link to="/checkout">Buy Now</Link>
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-muted-foreground">Quality Guarantee</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Care Instructions */}
          <div className="grid lg:grid-cols-2 gap-12 mt-16 pt-16 border-t border-border">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Care Instructions</h3>
              <ul className="space-y-3">
                {product.careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h3 className="font-serif text-2xl font-semibold mb-8">You May Also Like</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCardNew key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
