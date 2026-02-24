import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">Legal</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <div className="prose-content space-y-10 text-muted-foreground leading-relaxed">

            {/* Introduction */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to Trazzie ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and share information about you when you use our website at <span className="text-foreground font-medium">trazzie.com</span> (the "Site") and purchase our products.
              </p>
              <p className="mt-3">
                Please read this policy carefully. If you disagree with its terms, please discontinue use of our Site.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <h3 className="font-semibold text-foreground mb-2">Personal Information You Provide</h3>
              <p>We collect personal information that you voluntarily provide when:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Creating an account (name, email address, password)</li>
                <li>Placing an order (name, shipping address, billing address, phone number)</li>
                <li>Subscribing to our newsletter (email address)</li>
                <li>Contacting our customer support (name, email, message content)</li>
                <li>Submitting a product review (name, review content)</li>
              </ul>

              <h3 className="font-semibold text-foreground mb-2 mt-6">Information Collected Automatically</h3>
              <p>When you visit our Site, we automatically collect:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Device information (browser type, IP address, operating system)</li>
                <li>Usage data (pages visited, time spent, referring URLs)</li>
                <li>Cookie and tracking data</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations, shipping updates, and receipts</li>
                <li>Provide customer support</li>
                <li>Send promotional emails and offers (with your consent)</li>
                <li>Improve our website, products, and services</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            {/* Sharing Your Information */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">4. Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share your data with trusted third parties only as necessary:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li><span className="text-foreground font-medium">Payment Processors:</span> To securely process payments.</li>
                <li><span className="text-foreground font-medium">Shipping Partners:</span> To deliver your orders.</li>
                <li><span className="text-foreground font-medium">Email Service Providers:</span> To send transactional and marketing emails.</li>
                <li><span className="text-foreground font-medium">Analytics Providers:</span> To understand how our Site is used.</li>
                <li><span className="text-foreground font-medium">Legal Authorities:</span> When required by law or to protect our rights.</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">5. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our Site. Cookies help us remember your preferences, keep items in your cart, and understand how visitors use our Site.
              </p>
              <p className="mt-3">
                You can control cookie settings through your browser settings. Note that disabling cookies may affect the functionality of our Site.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">6. Data Security</h2>
              <p>
                We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Data portability (receive your data in a structured format)</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at <a href="mailto:privacy@trazzie.com" className="text-accent hover:underline">privacy@trazzie.com</a>.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
              <p>
                Our Site is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-secondary/30 rounded-2xl p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><span className="text-foreground font-medium">Email:</span> <a href="mailto:privacy@trazzie.com" className="text-accent hover:underline">privacy@trazzie.com</a></p>
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
