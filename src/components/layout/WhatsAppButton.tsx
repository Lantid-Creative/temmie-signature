import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useProducts';

export function WhatsAppButton() {
  const { data: settings } = useSiteSettings();
  
  // Get WhatsApp number from settings or use default
  const whatsappNumber = settings?.whatsapp_number || '+254700000000';
  const welcomeMessage = settings?.whatsapp_message || 'Hello! I have a question about Trazzy Beauty products.';
  
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanNumber = whatsappNumber.toString().replace(/[\s-()]/g, '');
  const encodedMessage = encodeURIComponent(welcomeMessage.toString());
  
  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
