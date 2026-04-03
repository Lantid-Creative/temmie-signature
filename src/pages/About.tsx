import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Sparkles, Heart, Award, Users } from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Premium Craftsmanship',
    description: 'Every piece is handcrafted with meticulous attention to detail, ensuring the finest quality for our customers.',
  },
  {
    icon: Heart,
    title: 'African Heritage',
    description: 'We celebrate African fashion and culture, blending traditional aesthetics with contemporary design.',
  },
  {
    icon: Award,
    title: 'Best Fits & Feet',
    description: 'From agbadas to shoes, we ensure every product fits perfectly and makes you stand out.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join our growing community of fashion-forward individuals who trust Temmie Signature for their wardrobe.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="About Us | Temmie Signature" description="Temmie Signature — crafted for those who value strength, style, and sophistication. Best Feet, Best Fits." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
              Our Story
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl font-semibold mb-6">
              Best Feet, Best Fits
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Temmie Signature was founded with a passion for African fashion and 
              a mission to deliver premium quality clothing, shoes, and accessories 
              that celebrate style, culture, and individuality.
            </p>
          </div>
        </section>

        {/* Image Section */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://uyupxiwhdvrhwtipanrm.supabase.co/storage/v1/object/public/site-assets/images/2025_11_5.png"
                alt="Temmie Signature Adedotun Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden lg:mt-16">
              <img
                src="https://uyupxiwhdvrhwtipanrm.supabase.co/storage/v1/object/public/site-assets/images/2025_11_DSC03812.jpg"
                alt="Temmie Signature Urban Safari Collection"
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
                    Temmie Signature was born from a deep love for African fashion and 
                    the desire to bring world-class quality to traditional and contemporary styles.
                  </p>
                  <p>
                    Based in Osogbo, Osun State, Nigeria, we've grown into a trusted fashion 
                    brand known for our signature collections — TMS GM01 for unforgettable weddings, 
                    Adedotun for regal traditional styles, and Urban Safari for modern street fashion.
                  </p>
                  <p>
                    Every piece we create is a testament to our commitment to quality, style, and 
                    the celebration of African heritage. From handcrafted shoes to bespoke agbadas, 
                    we put our heart into every stitch.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-accent">3</p>
                  <p className="text-sm text-muted-foreground mt-2">Collections</p>
                </div>
                <div className="bg-background rounded-lg p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-accent">24/7</p>
                  <p className="text-sm text-muted-foreground mt-2">Support</p>
                </div>
                <div className="bg-background rounded-lg p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-accent">🌍</p>
                  <p className="text-sm text-muted-foreground mt-2">Worldwide Shipping</p>
                </div>
                <div className="bg-background rounded-lg p-6 text-center">
                  <p className="font-serif text-4xl font-semibold text-accent">✨</p>
                  <p className="text-sm text-muted-foreground mt-2">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                Our Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
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
