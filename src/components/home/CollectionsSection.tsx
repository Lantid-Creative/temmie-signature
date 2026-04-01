import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/lib/data';
import { SectionReveal } from '@/components/home/SectionReveal';

export function CollectionsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary/70 to-transparent" />
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <SectionReveal className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-accent text-sm font-medium tracking-[0.15em] uppercase mb-3">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-semibold leading-tight">
              Shop by Collection
            </h2>
            <p className="mt-4 text-muted-foreground lg:text-lg">
              Distinct signatures for ceremonies, elevated casual wear, and modern cultural dressing.
            </p>
          </div>
          <Link to="/collections" className="story-link group mt-4 hidden items-center text-sm font-medium text-foreground transition-colors hover:text-accent lg:mt-0 lg:inline-flex">
            View All Collections
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionReveal>

        {/* Collections Grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-[1.05fr_0.95fr_1fr] lg:gap-6">
          {collections.map((collection, index) => (
            <SectionReveal key={collection.id} delay={index * 0.08}>
              <Link
                to={`/shop?collection=${collection.id}`}
                className="card-hover group relative block aspect-[3/4] overflow-hidden rounded-[2rem] border border-border/60 bg-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/18 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--foreground)/0.08)_55%,hsl(var(--foreground)/0.88)_100%)]" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-8">
                  <div className="flex justify-end">
                    <span className="rounded-full border border-background/20 bg-background/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-background/85 backdrop-blur-sm">
                      Signature Edit
                    </span>
                  </div>

                  <div>
                    <span className="mb-3 inline-flex text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                      {collection.productCount} Products
                    </span>
                    <h3 className="mb-2 font-serif text-2xl font-semibold text-background lg:text-3xl">
                      {collection.name}
                    </h3>
                    <p className="mb-5 max-w-xs line-clamp-2 text-sm leading-relaxed text-background/68">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-background transition-colors group-hover:text-accent">
                      Shop Now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
