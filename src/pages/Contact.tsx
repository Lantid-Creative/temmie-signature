import { Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@trazzie.com',
    href: 'mailto:hello@trazzie.com',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '123 Beauty Avenue, New York, NY 10001',
    href: '#',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: 'Mon - Fri: 9AM - 6PM EST',
    href: '#',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Contact Us | Trazzie" description="Get in touch with the Trazzie team. Email us at hello@trazzie.com for questions about products, orders, or styling advice." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-muted-foreground">
              Have questions about our products? Need styling advice? 
              Our team is here to help you find your perfect look.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                  />
                </div>
                <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="space-y-6 mb-12">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium">{info.title}</p>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-accent-foreground transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-accent-foreground transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
