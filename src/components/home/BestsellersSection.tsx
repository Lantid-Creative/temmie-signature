import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { products as mockProducts } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import { normalizeProduct, type UnifiedProduct } from '@/types/product';
import { ProductCardNew } from '@/components/products/ProductCardNew';
import { Button } from '@/components/ui/button';
import { SectionReveal } from '@/components/home/SectionReveal';

export function BestsellersSection() {
  const { data: dbProducts, isLoading } = useProducts({ bestseller: true, limit: 8 });

  const bestsellers: UnifiedProduct[] = useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(normalizeProduct);
    }
    return mockProducts
      .filter((p) => p.bestseller)
      .slice(0, 8)
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
    <section className="relative overflow-hidden bg-secondary/40 py-20 lg:py-28">
      <div className="absolute left-0 top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <SectionReveal className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-accent text-sm font-medium tracking-[0.15em] uppercase mb-3">
              Best Sellers
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-semibold leading-tight">
              Most Popular
            </h2>
            <p className="mt-4 text-muted-foreground lg:text-lg">
              A sharper edit of bestselling looks with standout tailoring, rich textures, and elevated occasionwear.
            </p>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <div className="rounded-full border border-border bg-background/80 px-5 py-3 text-sm text-muted-foreground backdrop-blur-sm">
              Curated for weddings, occasions, and bold everyday style.
            </div>
            <Button variant="outline" size="lg" className="group mt-4 rounded-full lg:mt-0" asChild>
              <Link to="/shop">
                Shop All
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </SectionReveal>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <SectionReveal>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {bestsellers.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCardNew product={product} />
                </div>
              ))}
            </div>
          </SectionReveal>
        )}

        <div className="text-center mt-10 lg:hidden">
          <Button variant="outline" size="lg" className="group rounded-full" asChild>
            <Link to="/shop">
              Shop All
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
