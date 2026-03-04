import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Sparkles, Heart, Award, Users } from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'We source only the finest 100% virgin human hair, ensuring each wig looks and feels completely natural.',
  },
  {
    icon: Heart,
    title: 'Confidence First',
    description: 'We believe every woman deserves to feel beautiful. Our wigs are designed to enhance your natural beauty and boost confidence.',
  },
  {
    icon: Award,
    title: 'Expert Craftsmanship',
    description: 'Each wig is handcrafted by skilled artisans with decades of experience in hair construction and styling.',
  },
  {
    icon: Users,
            title: 'Community',
            description: 'Join our community of 50,000+ women who have transformed their look and confidence with Trazzie.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="About Trazzie — Our Story" description="Founded in 2020, Trazzie empowers women through premium quality wigs. Trusted by 50,000+ customers worldwide with a 4.9 average rating." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
              Our Story
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl font-semibold mb-6">
              Empowering Women Through Beautiful Hair
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trazzie was founded with a simple yet powerful mission: to help every woman 
              feel confident and beautiful. We believe that great hair isn't just about 
              appearance—it's about how you feel when you look in the mirror.
            </p>
          </div>
        </section>

        {/* Image Section */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Beautiful woman with luxurious hair"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden lg:mt-16">
              <img
                src="https://images.unsplash.com/photo-1595959183082-7b570b7e1dfa?w=800&q=80"
                alt="Woman with natural looking wig"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-6">
                  Where It All Began
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2020, Trazzie started as a small passion project by founder 
                    Amara Johnson. After struggling to find quality wigs that looked natural 
                    and felt comfortable, she decided to create her own.
                  </p>
                  <p>
                    What began in her apartment has grown into a globally recognized brand, 
                    trusted by over 50,000 women worldwide. Our commitment to quality, 
                    customer service, and empowerment remains at the heart of everything we do.
                  </p>
                  <p>
                    Today, Trazzie offers the finest selection of human hair wigs, 
                    each piece carefully crafted to deliver the natural look and feel 
                    that our customers deserve.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-gold">50K+</p>
                  <p className="text-sm text-muted-foreground mt-2">Happy Customers</p>
                </div>
                <div className="bg-background rounded-xl p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-gold">4.9</p>
                  <p className="text-sm text-muted-foreground mt-2">Average Rating</p>
                </div>
                <div className="bg-background rounded-xl p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-gold">200+</p>
                  <p className="text-sm text-muted-foreground mt-2">Wig Styles</p>
                </div>
                <div className="bg-background rounded-xl p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-gold">30+</p>
                  <p className="text-sm text-muted-foreground mt-2">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                Our Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-4">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
    </div>
  );
}
