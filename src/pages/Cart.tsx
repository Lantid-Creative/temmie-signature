import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';
import { CouponInput, calculateDiscount } from '@/components/checkout/CouponInput';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  const discount = calculateDiscount(appliedCoupon, totalPrice);
  const shipping = totalPrice >= 200 ? 0 : 15;
  const total = totalPrice - discount + shipping;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Shopping Cart | Trazzie" description="Review your selected wigs and accessories. Enjoy free shipping on orders over $200." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 text-center">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
              <h2 className="font-serif text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any items yet. 
                Explore our collection and find your perfect wig!
              </p>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/shop">
                  Start Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedCapSize}`}
                    className="flex gap-6 p-6 bg-card rounded-xl border border-border"
                  >
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-28 h-28 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-medium hover:text-gold transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.selectedColor} / {item.selectedCapSize}
                      </p>
                      <p className="font-serif text-lg font-semibold text-gold mt-2">
                        ${item.product.price}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <CouponInput
                      subtotal={totalPrice}
                      appliedCoupon={appliedCoupon}
                      onApply={setAppliedCoupon}
                      onRemove={() => setAppliedCoupon(null)}
                    />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-gold">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(200 - totalPrice).toFixed(2)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="font-serif text-gold">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base mb-4" asChild>
                    <Link to={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ''}`}>Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full h-12 text-base" asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-border">
                    <span className="text-xs text-muted-foreground">🔒 Secure Payment</span>
                    <span className="text-xs text-muted-foreground">🚚 Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
