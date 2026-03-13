import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/lib/data';

export function CollectionsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            Our Collections
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold mb-4">
            Shop by Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our signature collections designed for timeless elegance
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={`/shop?collection=${collection.id}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-background mb-2">
                  {collection.name}
                </h3>
                <p className="text-background/70 text-sm mb-4">
                  {collection.description}
                </p>
                <span className="inline-flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all">
                  View Collection
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
