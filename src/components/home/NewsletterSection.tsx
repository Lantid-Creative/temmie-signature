import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-6">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
            Join the Trazzie Family
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Subscribe for exclusive offers, styling tips, and be the first to know about new arrivals. 
            Get 15% off your first order!
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-14 px-6 bg-secondary border-border"
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
