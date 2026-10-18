// src/components/ui/ModalsAndDrawers.tsx
'use client';
import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';
import { useVeloraStore } from '@/store/useVeloraStore';

export const ModalsAndDrawers: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setCartOpen,
    wishlist,
    removeFromWishlist = () => {},
    toggleWishlist,
    isWishlistOpen,
    setWishlistOpen,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useVeloraStore() as any;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [checkoutFinished, setCheckoutFinished] = useState(false);

  // Cart Calculations
  const subtotal = cart.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const shipping = subtotal >= 3500 || subtotal === 0 ? 0 : 350;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleCheckout = () => {
    setCheckoutFinished(true);
    setTimeout(() => {
      clearCart();
      setCheckoutFinished(false);
      setCartOpen(false);
    }, 3500);
  };

  return (
    <>
      {/* 1. QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-[#FDFBF7] max-w-3xl w-full border border-[#E8E2D9] shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 overflow-hidden max-h-[90vh]">
            <div className="relative aspect-[3/4] bg-[#F5EFEB]">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A882] font-semibold">
                    {quickViewProduct.brand}
                  </span>
                  <button onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
                    <X className="w-5 h-5 text-[#121212] hover:text-[#C8A882]" />
                  </button>
                </div>

                <h3 className="font-serif text-2xl font-light mt-1 mb-2 text-[#121212]">
                  {quickViewProduct.title}
                </h3>

                <div className="flex items-center gap-3 pb-4 border-b border-[#E8E2D9]">
                  <span className="text-xl font-medium">₹{quickViewProduct.price.toLocaleString()}</span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-[#8C857B] line-through">₹{quickViewProduct.originalPrice.toLocaleString()}</span>
                  )}
                  {quickViewProduct.discount > 0 && (
                    <span className="text-[10px] bg-[#C8A882] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                      -{quickViewProduct.discount}%
                    </span>
                  )}
                </div>

                <div className="py-4">
                  <span className="text-xs uppercase tracking-[0.1em] font-medium block mb-2">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((sz: string) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[40px] h-10 px-3 border text-xs tracking-wider transition-all ${
                          (selectedSize || quickViewProduct.sizes[0]) === sz
                            ? 'bg-[#121212] text-white border-[#121212]'
                            : 'border-[#E8E2D9] text-[#121212] hover:border-[#121212]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-[#8C857B] space-y-1.5 pt-2">
                  <p><strong className="text-[#121212]">Material:</strong> {quickViewProduct.material}</p>
                  <p><strong className="text-[#121212]">Fit Guide:</strong> {quickViewProduct.fitGuide}</p>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, selectedSize || quickViewProduct.sizes[0]);
                    setQuickViewProduct(null);
                  }}
                  className="w-full bg-[#121212] text-[#FDFBF7] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C8A882] transition-colors"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            {checkoutFinished ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#C8A882] animate-bounce" />
                <h3 className="font-serif text-3xl font-light">Acquisition Reserved</h3>
                <p className="text-xs text-[#8C857B] leading-relaxed">
                  Your bespoke consignment order has been registered. White-glove logistics itinerary dispatched.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                    <h3 className="font-serif text-2xl font-light">Shopping Bag ({cart.length})</h3>
                    <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                      <X className="w-5 h-5 text-[#121212]" />
                    </button>
                  </div>

                  {/* Free shipping bar */}
                  <div className="bg-[#F5EFEB] p-3 my-4 border border-[#E8E2D9] text-xs">
                    {subtotal >= 3500 ? (
                      <span className="text-[#121212] font-semibold">Unlocked Complimentary Express Logistics</span>
                    ) : (
                      <span className="text-[#8C857B]">
                        Add ₹{(3500 - subtotal).toLocaleString()} for Complimentary Shipping
                      </span>
                    )}
                  </div>

                  {/* Items list */}
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-xs text-[#8C857B]">
                      Your shopping bag is currently empty.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E8E2D9] max-h-[48vh] overflow-y-auto pr-1">
                      {cart.map((item: any) => (
                        <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-16 aspect-[3/4] object-cover bg-[#F5EFEB]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <h4 className="text-xs font-medium text-[#121212] line-clamp-1">{item.product.title}</h4>
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                  className="text-[#8C857B] hover:text-red-700"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-[10px] text-[#8C857B]">Size: {item.selectedSize}</span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center border border-[#E8E2D9]">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                                  className="px-2 py-0.5 text-xs hover:bg-[#F5EFEB]"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                                  className="px-2 py-0.5 text-xs hover:bg-[#F5EFEB]"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs font-semibold">
                                ₹{(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal, Coupon & Checkout */}
                {cart.length > 0 && (
                  <div className="border-t border-[#E8E2D9] pt-4 space-y-3">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 border border-[#E8E2D9] px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[#121212]"
                      />
                      <button type="submit" className="bg-[#121212] text-white px-3 py-1.5 text-xs uppercase tracking-wider">
                        Apply
                      </button>
                    </form>

                    {couponMsg && (
                      <p className={`text-[10px] ${couponMsg.success ? 'text-green-800' : 'text-red-700'}`}>
                        {couponMsg.text}
                      </p>
                    )}

                    <div className="text-xs space-y-1.5 pt-2 border-t border-[#E8E2D9]">
                      <div className="flex justify-between text-[#8C857B]">
                        <span>Bag Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-[#C8A882] font-semibold">
                          <span>Privilege Discount ({appliedCoupon.discountPercent}%)</span>
                          <span>-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#8C857B]">
                        <span>Express Logistics</span>
                        <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#E8E2D9]">
                        <span>Total Payable</span>
                        <span>₹{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-[#121212] text-[#FDFBF7] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C8A882] transition-colors"
                    >
                      Conclude Acquisition
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                <h3 className="font-serif text-2xl font-light">Saved Archive ({wishlist.length})</h3>
                <button onClick={() => setWishlistOpen(false)} aria-label="Close wishlist">
                  <X className="w-5 h-5 text-[#121212]" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#8C857B]">
                  No pieces saved in your archive yet.
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D9] max-h-[70vh] overflow-y-auto pr-1">
                  {wishlist.map((product: any) => (
                    <div key={product.id} className="py-4 flex gap-4 items-center">
                      <img src={product.image} alt={product.title} className="w-16 aspect-[3/4] object-cover bg-[#F5EFEB]" />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#8C857B]">{product.brand}</span>
                        <h4 className="text-xs font-medium text-[#121212] line-clamp-1">{product.title}</h4>
                        <span className="text-xs font-semibold block mt-1">₹{product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            addToCart(product, product.sizes[0]);
                            toggleWishlist(product);
                          }}
                          className="text-[10px] bg-[#121212] text-white px-2.5 py-1.5 uppercase tracking-wider hover:bg-[#C8A882]"
                        >
                          Move To Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-[10px] text-[#8C857B] hover:text-red-700 underline text-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};