import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Shield, Check, Loader2 } from 'lucide-react';
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
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<CheckoutStep>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
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
  const tax = totalPrice * 0.08; // 8% tax
  const total = totalPrice + shipping + tax;

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

  const processOrder = async () => {
    setIsProcessing(true);
    try {
      // Generate order number
      const orderNum = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNum,
          user_id: user?.id || null,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          status: 'pending',
          subtotal: totalPrice,
          shipping_amount: shipping,
          discount_amount: 0,
          total: total,
          shipping_address: JSON.parse(JSON.stringify(shippingAddress)),
          billing_address: JSON.parse(JSON.stringify(shippingAddress)),
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id.length === 36 ? item.product.id : null, // Only if valid UUID
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
        color: item.selectedColor,
        cap_size: item.selectedCapSize,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(orderNum);
      setStep('confirmation');
      clearCart();
      
      toast({ title: 'Order placed successfully!' });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({ 
        title: 'Error processing order', 
        description: 'Please try again or contact support.',
        variant: 'destructive' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
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
              isActive && 'text-primary',
              isCompleted && 'text-primary',
              !isActive && !isCompleted && 'text-muted-foreground'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                isActive && 'bg-primary text-primary-foreground',
                isCompleted && 'bg-primary text-primary-foreground',
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
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Information Step */}
              {step === 'information' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold">Contact Information</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
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
                    <Input
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                    <Input
                      id="apartment"
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
                      Back
                    </Button>
                    <Button onClick={nextStep} className="flex-1 h-12 bg-primary text-primary-foreground">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold">Payment</h2>
                  
                  <div className="bg-secondary/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <span className="font-medium">Credit / Debit Card</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
                      Back
                    </Button>
                    <Button 
                      onClick={processOrder} 
                      disabled={isProcessing}
                      className="flex-1 h-12 bg-primary text-primary-foreground"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
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
                  <p className="text-muted-foreground mb-2">
                    Your order has been successfully placed.
                  </p>
                  <p className="text-lg font-medium mb-8">
                    Order Number: <span className="text-primary">{orderNumber}</span>
                  </p>
                  
                  <p className="text-muted-foreground mb-8">
                    A confirmation email has been sent to <strong>{shippingAddress.email}</strong>
                  </p>

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
            {step !== 'confirmation' && (
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedCapSize}`} className="flex gap-4">
                        <div className="relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
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
