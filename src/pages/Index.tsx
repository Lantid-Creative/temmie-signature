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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Trazzie — Premium Wigs & Hair Extensions" description="Shop luxury human hair wigs, lace fronts & closures. Free shipping over $200. Handcrafted quality trusted by 50,000+ women worldwide." />
      <Header />
      <CartDrawer />
      <main>
        <HeroSection />
        <CollectionsSection />
        <BestsellersSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <InstagramSection />
        <NewsletterSection />
      </main>
      <Footer />
      
    </div>
  );
};

export default Index;
