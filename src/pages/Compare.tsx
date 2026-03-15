import { Link } from 'react-router-dom';
import { X, ShoppingBag, Star, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const compareProducts = compareItems
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  const specs = [
    { key: 'hairType', label: 'Hair Type' },
    { key: 'laceType', label: 'Lace Type' },
    { key: 'length', label: 'Length' },
    { key: 'density', label: 'Density' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'inStock', label: 'Availability' },
  ] as const;

  if (compareProducts.length === 0) {
    return (
      <>
        <PageMeta title="Compare Products | Temmie Signature" description="Compare fashion items side by side — style, material, size, price and more." />
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl font-serif mb-4">Compare Products</h1>
            <p className="text-muted-foreground mb-8">
              You haven't added any products to compare yet.
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Products
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
        <PageMeta title="Compare Products | Temmie Signature" description="Compare fashion items side by side to find your perfect match." />
        <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif mb-2">Compare Products</h1>
              <p className="text-muted-foreground">
                Compare up to 4 products side by side
              </p>
            </div>
            <Button variant="outline" onClick={clearCompare}>
              Clear All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="w-40 p-4 text-left font-medium text-muted-foreground">
                    Product
                  </th>
                  {compareProducts.map((product) => (
                    <th key={product.id} className="p-4 text-left">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-t">
                  <td className="p-4 font-medium text-muted-foreground">Price</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Specs Rows */}
                {specs.map((spec) => (
                  <tr key={spec.key} className="border-t">
                    <td className="p-4 font-medium text-muted-foreground">
                      {spec.label}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        {spec.key === 'rating' ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-gold text-gold" />
                            <span>{product.rating}</span>
                          </div>
                        ) : spec.key === 'reviews' ? (
                          `${product.reviews} reviews`
                        ) : spec.key === 'inStock' ? (
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              product.inStock
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            )}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        ) : (
                          product[spec.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Colors Row */}
                <tr className="border-t">
                  <td className="p-4 font-medium text-muted-foreground">Colors</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.colors.map((color) => (
                          <span
                            key={color}
                            className="px-2 py-0.5 bg-muted rounded-full text-xs"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cap Sizes Row */}
                <tr className="border-t">
                  <td className="p-4 font-medium text-muted-foreground">Cap Sizes</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      {product.capSize.join(', ')}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="border-t">
                  <td className="p-4 font-medium text-muted-foreground">Action</td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <Button
                        onClick={() =>
                          addToCart(product, 1, product.colors[0], product.capSize[0])
                        }
                        disabled={!product.inStock}
                        className="w-full"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      
    </>
  );
}
