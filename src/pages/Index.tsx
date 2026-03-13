import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { HeroSection } from '@/components/home/HeroSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Temmie Signature — Best Feet, Best Fits" description="Discover Temmie Signature's luxury fashion collections. Agbada, Kaftan, Casual Wears, Shoes & Accessories. Worldwide shipping." />
      <Header />
      <CartDrawer />
      <main>
        <HeroSection />
        <WhyChooseUsSection />
        <CollectionsSection />
        <BestsellersSection />
        <CategoriesSection />
        <TestimonialsSection />
        <InstagramSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
