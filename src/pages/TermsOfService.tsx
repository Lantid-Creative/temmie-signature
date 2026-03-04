import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';


export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Terms of Service | Trazzie" description="Read the terms and conditions that govern your use of the Trazzie website and services." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">Legal</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed">

            {/* Agreement */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Trazzie website at <span className="text-foreground font-medium">trazzie.com</span> (the "Site") and purchasing our products, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Site.
              </p>
              <p className="mt-3">
                These Terms apply to all visitors, users, and customers of the Site.
              </p>
            </section>

            {/* Products & Orders */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">2. Products & Orders</h2>
              <h3 className="font-semibold text-foreground mb-2">Product Descriptions</h3>
              <p>
                We make every effort to display our products as accurately as possible. However, we cannot guarantee that your device's display accurately reflects actual product colors. Product images are for illustrative purposes.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-5">Order Acceptance</h3>
              <p>
                Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including orders with pricing errors or suspected fraud. You will be notified promptly if your order is cancelled.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-5">Pricing</h3>
              <p>
                All prices are listed in USD. We reserve the right to change prices at any time without notice. Promotions and discount codes may be subject to additional terms and expiration dates.
              </p>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">3. Shipping & Delivery</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Free standard shipping on orders over $200</li>
                <li>Standard shipping: 5–10 business days</li>
                <li>Expedited shipping options available at checkout</li>
                <li>International shipping available to select countries</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss and title for products passes to you upon delivery</li>
              </ul>
            </section>

            {/* Returns & Refunds */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">4. Returns & Refunds</h2>
              <h3 className="font-semibold text-foreground mb-2">Return Policy</h3>
              <p>
                We offer a 30-day return policy for unused, unworn items in their original packaging with all tags attached. Items must be returned in the same condition they were received.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-4">Non-Returnable Items</h3>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Items that have been worn, altered, or washed</li>
                <li>Items without original packaging or tags</li>
                <li>Final sale items marked as non-returnable</li>
                <li>Custom or personalized orders</li>
              </ul>
              <h3 className="font-semibold text-foreground mb-2 mt-4">Refunds</h3>
              <p>
                Approved refunds will be processed within 5–10 business days to your original payment method. Shipping costs are non-refundable unless the return is due to our error.
              </p>
            </section>

            {/* Account */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">5. User Accounts</h2>
              <p>
                When you create an account with us, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Update your information to keep it accurate and current</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Not share your account credentials with others</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
              <p>
                All content on this Site — including text, images, logos, graphics, product descriptions, and software — is the property of Trazzie or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">7. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Use the Site for any unlawful purpose</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Attempt to gain unauthorized access to any part of the Site</li>
                <li>Use automated tools (bots, scrapers) to access the Site without permission</li>
                <li>Post harmful, offensive, or inappropriate content in reviews or messages</li>
                <li>Interfere with the Site's security or functionality</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">8. Disclaimers & Limitation of Liability</h2>
              <p>
                The Site and products are provided "as is" without warranties of any kind. To the fullest extent permitted by law, Trazzie disclaims all implied warranties. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our Site or products.
              </p>
              <p className="mt-3">
                Our total liability to you for any claims shall not exceed the amount you paid for the specific product or service giving rise to the claim.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration or in the courts of competent jurisdiction.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Site after changes are posted constitutes your acceptance of the new Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-secondary/30 rounded-2xl p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
              <p>If you have questions about these Terms, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><span className="text-foreground font-medium">Email:</span> <a href="mailto:legal@trazzie.com" className="text-accent hover:underline">legal@trazzie.com</a></p>
                <p><span className="text-foreground font-medium">Company:</span> Trazzie</p>
                <p><span className="text-foreground font-medium">Website:</span> <a href="https://trazzie.com" className="text-accent hover:underline">trazzie.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
