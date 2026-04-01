import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { SectionReveal } from '@/components/home/SectionReveal';

const features = [
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'Fast, reliable delivery anywhere in the world.',
  },
  {
    icon: Shield,
    title: 'Refund Policy',
    description: 'Quality guaranteed. Terms and conditions apply.',
  },
  {
    icon: CreditCard,
    title: 'Secured Payment',
    description: 'Cards & bank transfer. Safe, encrypted transactions.',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Our team is always ready to help you.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="border-b border-border bg-background py-10 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-[1.75rem] border border-border/70 bg-card/80 px-5 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_50px_hsl(var(--accent)/0.08)] lg:px-6"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
                  <feature.icon className="h-5 w-5 shrink-0" />
                </div>
                <h3 className="text-sm font-medium text-foreground lg:text-base">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground lg:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
