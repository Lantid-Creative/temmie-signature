import { Star, Quote } from 'lucide-react';
import { reviews as fallbackReviews } from '@/lib/data';
import { useTestimonials } from '@/hooks/useProducts';
import { SectionReveal } from '@/components/home/SectionReveal';

export function TestimonialsSection() {
  const { data: dbTestimonials } = useTestimonials();

  const reviews = dbTestimonials?.length
    ? dbTestimonials.filter(t => t.is_active).map(t => ({
        id: t.id,
        author: t.author_name,
        avatar: t.author_avatar || '',
        rating: t.rating,
        date: t.date_label || '',
        content: t.content,
        productName: t.product_name || '',
        verified: t.is_verified,
      }))
    : fallbackReviews;

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary/70 to-transparent" />
      <div className="container mx-auto px-4 lg:px-8">
        <SectionReveal className="mb-12 text-center lg:mb-16">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            Real Reviews
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto lg:text-lg">
            Join thousands of satisfied customers who trust Temmie Signature
          </p>
        </SectionReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <SectionReveal key={review.id} delay={index * 0.08}>
              <div
                className="card-hover rounded-[1.75rem] border border-border/80 bg-card p-6 shadow-[0_24px_50px_hsl(var(--foreground)/0.04)]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <Quote className="h-8 w-8 text-accent/30" />
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    Client Note
                  </span>
                </div>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-3 border-t border-border/70 pt-4">
                  {review.avatar && (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/15"
                    />
                  )}
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {review.author}
                      {review.verified && (
                        <span className="text-xs text-accent">✓ Verified</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
