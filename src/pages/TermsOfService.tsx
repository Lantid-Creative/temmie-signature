import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';


export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Terms of Service | Temmie Signature" description="Read the terms and conditions that govern your use of the Temmie Signature website and services." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">Legal</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 2026</p>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Temmie Signature website at <span className="text-foreground font-medium">temmiesignature.com</span> (the "Site") and purchasing our products, you agree to be bound by these Terms of Service ("Terms").
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">2. Products & Orders</h2>
              <h3 className="font-semibold text-foreground mb-2">Product Descriptions</h3>
              <p>We make every effort to display our products as accurately as possible. However, we cannot guarantee that your device's display accurately reflects actual product colors.</p>
              <h3 className="font-semibold text-foreground mb-2 mt-5">Pricing</h3>
              <p>All prices are listed in Nigerian Naira (₦). We reserve the right to change prices at any time without notice. Promotions and discount codes may be subject to additional terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">3. Shipping & Delivery</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Worldwide shipping available</li>
                <li>Standard shipping: 5–10 business days (domestic)</li>
                <li>International shipping: 10–21 business days</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss and title for products passes to you upon delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">4. Returns & Refunds</h2>
              <p>We offer a 14-day return policy for unused, unworn items in their original packaging with all tags attached.</p>
              <h3 className="font-semibold text-foreground mb-2 mt-4">Non-Returnable Items</h3>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Items that have been worn, altered, or washed</li>
                <li>Items without original packaging or tags</li>
                <li>Custom or personalized orders</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">5. User Accounts</h2>
              <p>When you create an account with us, you are responsible for maintaining the confidentiality of your account credentials.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
              <p>All content on this Site — including text, images, logos, graphics, and product descriptions — is the property of Temmie Signature or its licensors and is protected by applicable intellectual property laws.</p>
            </section>

            <section className="bg-secondary/30 rounded-2xl p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>If you have questions about these Terms, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><span className="text-foreground font-medium">Email:</span> <a href="mailto:hello@temmiesignature.com" className="text-accent hover:underline">hello@temmiesignature.com</a></p>
                <p><span className="text-foreground font-medium">Company:</span> Temmie Signature</p>
                <p><span className="text-foreground font-medium">Website:</span> <a href="https://temmiesignature.com" className="text-accent hover:underline">temmiesignature.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}