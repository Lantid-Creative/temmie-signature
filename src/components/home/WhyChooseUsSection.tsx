import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

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
    <section className="py-6 border-b border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 px-6 py-4"
            >
              <feature.icon className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground hidden lg:block">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
