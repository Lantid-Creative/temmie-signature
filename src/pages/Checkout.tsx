import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Truck, Shield, Check, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<CheckoutStep>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const shipping = totalPrice >= 200 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  // Handle Stripe redirect
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      clearCart();
      setStep('confirmation');
    } else if (status === 'cancelled') {
      toast({ title: 'Payment cancelled', description: 'You can try again when ready.' });
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (step === 'information') {
      if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.email) {
        toast({ title: 'Please fill in all required fields', variant: 'destructive' });
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
        toast({ title: 'Please enter a valid email address', variant: 'destructive' });
        return false;
      }
    }
    if (step === 'shipping') {
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
        toast({ title: 'Please fill in all shipping details', variant: 'destructive' });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    const steps: CheckoutStep[] = ['information', 'shipping', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: CheckoutStep[] = ['information', 'shipping', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      const cartItems = items.map(item => ({
        product_name: item.product.name,
        product_image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        cap_size: item.selectedCapSize,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: cartItems,
          shippingAddress,
          shipping,
          tax,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Payment error',
        description: error.message || 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    const status = searchParams.get('status');
    if (status === 'success') {
      // Show confirmation even if cart is empty (it was cleared)
    } else {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-32 pb-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-serif text-3xl font-semibold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">Add some items to your cart to checkout.</p>
              <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
  }

  const stepIndicator = (
    <div className="flex items-center justify-center gap-4 mb-12">
      {['Information', 'Shipping', 'Payment'].map((label, index) => {
        const stepNames: CheckoutStep[] = ['information', 'shipping', 'payment'];
        const isActive = step === stepNames[index];
        const isCompleted = stepNames.indexOf(step) > index || step === 'confirmation';
        return (
          <div key={label} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2',
              (isActive || isCompleted) && 'text-primary',
              !isActive && !isCompleted && 'text-muted-foreground'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                (isActive || isCompleted) && 'bg-primary text-primary-foreground',
                !isActive && !isCompleted && 'bg-muted text-muted-foreground'
              )}>
                {isCompleted && !isActive ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{label}</span>
            </div>
            {index < 2 && (
              <div className={cn(
                'w-12 sm:w-20 h-0.5 mx-2',
                isCompleted ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {step !== 'confirmation' && (
            <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Cart
            </Link>
          )}

          <h1 className="font-serif text-4xl font-semibold text-center mb-8">
            {step === 'confirmation' ? 'Order Confirmed!' : 'Checkout'}
          </h1>

          {step !== 'confirmation' && stepIndicator}

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Information Step */}
              {step === 'information' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" value={shippingAddress.firstName} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" value={shippingAddress.lastName} onChange={handleInputChange} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={shippingAddress.email} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={shippingAddress.phone} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <Button onClick={nextStep} className="w-full h-12 bg-primary text-primary-foreground">
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold">Shipping Address</h2>
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" name="address" value={shippingAddress.address} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                    <Input id="apartment" name="apartment" value={shippingAddress.apartment} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" value={shippingAddress.city} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" name="state" value={shippingAddress.state} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input id="zipCode" name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12">Back</Button>
                    <Button onClick={nextStep} className="flex-1 h-12 bg-primary text-primary-foreground">Continue to Payment</Button>
                  </div>
                </div>
              )}

              {/* Payment Step - Stripe Checkout */}
              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold">Payment</h2>
                  
                  <div className="bg-secondary/50 rounded-xl p-8 text-center">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">Secure Payment via Stripe</h3>
                    <p className="text-muted-foreground mb-6">
                      You'll be redirected to Stripe's secure checkout to complete your payment. 
                      All major credit cards, debit cards, and digital wallets are accepted.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>256-bit SSL encryption • PCI compliant</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12">Back</Button>
                    <Button
                      onClick={processPayment}
                      disabled={isProcessing}
                      className="flex-1 h-12 bg-primary text-primary-foreground"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {step === 'confirmation' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-serif text-3xl font-semibold mb-4">Thank You!</h2>
                  <p className="text-muted-foreground mb-2">Your payment was successful and your order has been placed.</p>
                  <p className="text-muted-foreground mb-8">A confirmation email will be sent shortly.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                    {user && (
                      <Button variant="outline" asChild>
                        <Link to="/account">View Orders</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {step !== 'confirmation' && items.length > 0 && (
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedCapSize}`} className="flex gap-4">
                        <div className="relative">
                          <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.selectedColor} / {item.selectedCapSize}</p>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? <span className="text-primary">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="font-serif text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {shipping === 0 ? 'Free shipping on this order!' : `$${(200 - totalPrice).toFixed(2)} away from free shipping`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
