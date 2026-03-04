import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { collections } from '@/lib/data';

export default function Collections() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Collections | Trazzie" description="Explore our curated wig collections — lace fronts, closures, and more. Find your perfect style and express your beauty." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: 'Collections' }]} />
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
              Curated For You
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">
              Our Collections
            </h1>
            <p className="text-muted-foreground">
              Explore our carefully curated collections, each designed to help you 
              find your perfect style and express your unique beauty.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="space-y-8">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                to={`/shop?collection=${collection.id}`}
                className={`group grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden image-zoom">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <span className="text-gold text-sm font-medium">
                    {collection.productCount} Products
                  </span>
                  <h2 className="font-serif text-3xl lg:text-4xl font-semibold mt-2 mb-4 group-hover:text-gold transition-colors">
                    {collection.name}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {collection.description}
                  </p>
                  <span className="inline-flex items-center text-foreground font-medium group-hover:text-gold group-hover:gap-3 transition-all">
                    Shop Collection
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
