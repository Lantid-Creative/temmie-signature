import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Agbada', href: '/shop?category=agbada' },
    { name: 'Kaftan', href: '/shop?category=kaftan' },
    { name: 'Casual Wears', href: '/shop?category=casual-wears' },
    { name: 'Shoes', href: '/shop?category=shoes' },
    { name: 'Accessories', href: '/shop?category=accessories' },
  ],
  collections: [
    { name: 'TMS GM01', href: '/shop?collection=tms-gm01' },
    { name: 'Adedotun', href: '/shop?collection=adedotun' },
    { name: 'Urban Safari', href: '/shop?collection=urban-safari' },
  ],
  help: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/officialtemmiesignature', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

const trustBadges = [
  { text: 'Worldwide Shipping', icon: '🚚' },
  { text: 'Refund Policy', icon: '↩️' },
  { text: 'Secured Payment', icon: '🔒' },
  { text: 'Support 24/7', icon: '💬' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust Badges */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center justify-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/images/temmie-logo.png" 
                alt="Temmie Signature" 
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              Crafted for those who value strength, style, and sophistication. 
              Best Feet, Best Fits.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-serif text-lg font-semibold mb-4 mt-8">Company</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-accent" />
                <span className="text-background/70 text-sm">3, Gbongan - Ibadan Rd, beside old Jaiz Bank Building, Olaiya, Osogbo, Osun.</span>
              </div>
              <a
                href="tel:+2348169850284"
                className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span className="text-sm">+234 816 985 0284</span>
              </a>
              <a
                href="mailto:hello@temmiesignature.com"
                className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-sm">hello@temmiesignature.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © 2026 Temmie Signature. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-background/50 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-background/50 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
