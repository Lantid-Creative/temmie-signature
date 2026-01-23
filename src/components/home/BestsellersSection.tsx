import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { products as mockProducts } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import { normalizeProduct, type UnifiedProduct } from '@/types/product';
import { ProductCardNew } from '@/components/products/ProductCardNew';
import { Button } from '@/components/ui/button';

export function BestsellersSection() {
  const { data: dbProducts, isLoading } = useProducts({ bestseller: true, limit: 4 });

  const bestsellers: UnifiedProduct[] = useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(normalizeProduct);
    }
    // Fallback to mock data
    return mockProducts
      .filter((p) => p.bestseller)
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
  }, [dbProducts]);

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">
              Customer Favorites
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-semibold">
              Bestselling Wigs
            </h2>
          </div>
          <Button
            variant="outline"
            className="self-start lg:self-auto border-2 group"
            asChild
          >
            <Link to="/shop">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {bestsellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCardNew product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
