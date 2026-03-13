import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'Get your order delivered anywhere in the world. Fast and reliable shipping to your doorstep.',
  },
  {
    icon: Shield,
    title: 'Refund Policy',
    description: 'Terms and conditions apply. We stand behind the quality of every product we sell.',
  },
  {
    icon: CreditCard,
    title: 'Secured Payment',
    description: 'Payment via Cards & Bank Transfer accepted. Your transactions are safe and encrypted.',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'You can contact us anytime. Our team is always ready to help you with any questions.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-28 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            The Temmie Signature Difference
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold mb-4">
            Why Choose Us
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            We're committed to delivering the finest fashion with exceptional service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-lg bg-background/5 hover:bg-background/10 transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-6">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-background/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
