import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/lib/data';

export function CollectionsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-accent text-sm font-medium tracking-[0.15em] uppercase mb-3">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-semibold">
              Shop by Collection
            </h2>
          </div>
          <Link to="/collections" className="hidden lg:inline-flex items-center text-sm font-medium text-foreground hover:text-accent transition-colors mt-4 lg:mt-0 group">
            View All Collections
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={`/shop?collection=${collection.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <span className="text-accent text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                  {collection.productCount} Products
                </span>
                <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-background mb-2">
                  {collection.name}
                </h3>
                <p className="text-background/60 text-sm mb-4 line-clamp-2">
                  {collection.description}
                </p>
                <span className="inline-flex items-center text-background text-sm font-medium group-hover:text-accent transition-colors">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
