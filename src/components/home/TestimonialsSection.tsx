import { Star, Quote } from 'lucide-react';
import { reviews } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            Real Reviews
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Temmie Signature
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-card rounded-lg p-6 border border-border card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{review.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm flex items-center gap-2">
                    {review.author}
                    {review.verified && (
                      <span className="text-xs text-accent">✓ Verified</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
