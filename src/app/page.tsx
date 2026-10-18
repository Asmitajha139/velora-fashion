// src/app/page.tsx
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Eye,
  X,
  Truck,
  ShieldCheck,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Menu,
  Ruler
} from 'lucide-react';
import { VERIFIED_CATALOG, ProductItem, auditCatalog } from '@/data/catalog';

export default function VeloraStorefront() {
  useEffect(() => {
    const audit = auditCatalog();
    if (!audit.valid) {
      console.error('VELORA Catalog Audit Failure:', audit.errors);
    } else {
      console.log(`VELORA Catalog Verified: ${VERIFIED_CATALOG.length} luxury products loaded.`);
    }
  }, []);

  const [cart, setCart] = useState<{ product: ProductItem; size: string; qty: number }[]>([]);
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  // Cart & Promo
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Modal Interactive Form States
  const [modalSelectedSize, setModalSelectedSize] = useState<string>('');
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Local Storage Hydration
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('velora_cart');
      const savedWishlist = localStorage.getItem('velora_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('velora_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Cart Actions
  const addToBag = (product: ProductItem, size?: string) => {
    const chosenSize = size || modalSelectedSize || product.sizes[0] || 'Standard';
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id && item.size === chosenSize);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].qty += 1;
        return copy;
      }
      return [...prev, { product, size: chosenSize, qty: 1 }];
    });
    showToast(`Added ${product.title} (${chosenSize}) to Shopping Bag`);
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  };

  const toggleWishlist = (product: ProductItem) => {
    const exists = wishlist.some((w) => w.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((w) => w.id !== product.id));
      showToast('Removed from saved archive');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to personal archive');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'VELORA10') {
      setAppliedDiscount(10);
      setCouponMessage('10% Privilege atelier discount activated');
    } else if (clean === 'FIRSTLUXE') {
      setAppliedDiscount(15);
      setCouponMessage('15% First Luxury Order discount activated');
    } else {
      setCouponMessage('Invalid invitation code. Try VELORA10 or FIRSTLUXE');
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode)) {
      setPincodeMessage('Delivery available: 2 Business Days via Velora Concierge Express.');
    } else {
      setPincodeMessage('Please enter a valid 6-digit postal code.');
    }
  };

  const openProductModal = (product: ProductItem) => {
    setActiveModalProduct(product);
    setModalSelectedSize(product.sizes[0] || 'Standard');
    setPincode('');
    setPincodeMessage(null);
    setShowSizeGuide(false);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const discountTotal = Math.round((cartSubtotal * appliedDiscount) / 100);
  const shippingFee = cartSubtotal >= 3500 || cartSubtotal === 0 ? 0 : 350;
  const grandTotal = Math.max(0, cartSubtotal - discountTotal + shippingFee);
  const totalBagCount = cart.reduce((a, b) => a + b.qty, 0);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return VERIFIED_CATALOG.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) return false;
      if (p.price > maxPrice) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, selectedOccasion, searchQuery, sortOption, maxPrice]);

  // Adaptive Grid Column Calculator (Fixes empty space on the right)
  const gridDistributionClass = useMemo(() => {
    const count = filteredProducts.length;
    if (count === 0) return 'w-full';
    if (count === 1) return 'grid grid-cols-1 max-w-sm mx-auto gap-8';
    if (count === 2) return 'grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-8 sm:gap-10';
    if (count === 3) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-6 sm:gap-8';
    return 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full';
  }, [filteredProducts.length]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return VERIFIED_CATALOG.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4);
  }, [searchQuery]);

  const categories = ['All', 'Women', 'Men', 'Footwear', 'Bags', 'Accessories', 'Lifestyle'];
  const occasions = ['All', 'Casual', 'Office', 'Party', 'Wedding', 'Vacation'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212] font-sans antialiased selection:bg-[#C8A882] selection:text-white">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-[#FDFBF7] px-6 py-3.5 shadow-2xl rounded text-xs tracking-[0.15em] uppercase border border-[#C8A882]/40 animate-pulse">
          {toast}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#121212] text-[#FDFBF7] text-[10px] md:text-[11px] tracking-[0.2em] uppercase py-2.5 px-4 text-center flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping On Orders Above ₹3,500</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline text-[#C8A882] font-semibold">CODE: VELORA10 FOR 10% OFF</span>
      </div>

      {/* Responsive Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#121212] hover:text-[#C8A882] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.14em] font-medium text-[#121212]">
              {['Women', 'Men', 'Footwear', 'Bags', 'Accessories', 'Editorial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'Editorial') {
                      document.getElementById('editorial')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setSelectedCategory(cat);
                      document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#C8A882] transition-colors py-2 relative group cursor-pointer"
                >
                  {cat}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A882] group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>
          </div>

          <div className="text-center">
            <a href="/" className="inline-block group">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#121212] block font-light">
                VELORA
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-[#8C857B] block -mt-1 group-hover:text-[#C8A882] transition-colors">
                HAUTE ÉDITION
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 text-[#121212]">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#121212] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalBagCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A882] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalBagCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Drawer */}
        {isSearchOpen && (
          <div className="border-t border-[#E8E2D9] bg-[#F5EFEB] px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 border-b border-[#8C857B]/40 pb-2">
                <Search className="w-5 h-5 text-[#8C857B]" />
                <input
                  type="text"
                  placeholder="Search silk gowns, linen shirts, cashmere, loafers, Chelsea boots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#121212] placeholder-[#8C857B] focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Clear query">
                    <X className="w-4 h-4 text-[#8C857B] hover:text-[#121212]" />
                  </button>
                )}
              </div>

              {searchSuggestions.length > 0 && (
                <div className="mt-3 bg-white border border-[#E8E2D9] divide-y divide-[#E8E2D9] shadow-xl">
                  {searchSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        openProductModal(item);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 flex items-center justify-between hover:bg-[#F5EFEB] cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover bg-[#F5EFEB]"
                        />
                        <div>
                          <p className="font-medium text-[#121212]">{item.title}</p>
                          <p className="text-[10px] text-[#8C857B] uppercase">{item.brand} • {item.subcategory}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#C8A882]">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Editorial Hero */}
      <section className="relative h-[85vh] w-full bg-[#121212] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="Velora High Summer Campaign"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 max-w-7xl mx-auto text-[#FDFBF7]">
          <span className="text-[#C8A882] tracking-[0.2em] uppercase text-xs md:text-sm font-semibold mb-3">
            Spring / Summer 2026 Haute Drop
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-light tracking-wide max-w-3xl leading-[1.05] mb-8">
            Quiet Tailoring & Natural Italian Fibres
          </h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setSelectedCategory('All');
                document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FDFBF7] text-[#121212] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C8A882] hover:text-white transition-all duration-300 cursor-pointer"
            >
              Explore Collection ({VERIFIED_CATALOG.length} Distinct Pieces)
            </button>
            <button
              onClick={() => document.getElementById('editorial')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-[#FDFBF7]/60 text-[#FDFBF7] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FDFBF7] hover:text-[#121212] transition-all duration-300 cursor-pointer"
            >
              View The Lookbook
            </button>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="border-b border-[#E8E2D9] bg-[#F5EFEB] py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <Truck className="w-5 h-5 text-[#C8A882]" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.1em]">Express Logistics</h4>
              <p className="text-[11px] text-[#8C857B]">Complimentary shipping on orders above ₹3,500</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <ShieldCheck className="w-5 h-5 text-[#C8A882]" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.1em]">Atelier Verification</h4>
              <p className="text-[11px] text-[#8C857B]">Pure Italian silks, Normandy linens, and worsted wool</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <RefreshCw className="w-5 h-5 text-[#C8A882]" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.1em]">15-Day Concierge Exchange</h4>
              <p className="text-[11px] text-[#8C857B]">Doorstep try-on and reverse collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 🚀 RESPONSIVE PRODUCT GRID & COMPLETE TITLE PRESENTATION */}
      {/* ========================================================= */}
      <section id="catalog-grid" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E2D9] pb-6 mb-8 w-full">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C8A882] font-semibold block mb-1">
              Verified Collection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light">The Atelier Archive</h2>
          </div>
          <p className="text-xs text-[#8C857B] mt-2 md:mt-0 tracking-wide font-sans">
            Displaying {filteredProducts.length} Genuinely Unique Creations
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#F5EFEB] border border-[#E8E2D9] p-4 mb-8 space-y-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8C857B] mr-2 font-medium">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#121212] text-white'
                    : 'bg-white border border-[#E8E2D9] text-[#121212] hover:border-[#121212]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8C857B]">Occasion:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="bg-white border border-[#E8E2D9] py-1.5 px-3 text-xs focus:outline-none"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#8C857B]">Max Price:</span>
              <input
                type="range"
                min={2500}
                max={20000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#121212] cursor-pointer"
              />
              <span className="font-semibold">₹{maxPrice.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8C857B]">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-white border border-[#E8E2D9] py-1.5 px-3 text-xs focus:outline-none"
              >
                <option value="recommended">Curated Rank</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic & Balanced Product Grid Container */}
        <div className={gridDistributionClass}>
          {filteredProducts.map((p) => {
            const isWish = wishlist.some((w) => w.id === p.id);

            return (
              <div
                key={p.id}
                onClick={() => openProductModal(p)}
                className="group flex flex-col justify-between h-full bg-[#FDFBF7] cursor-pointer"
              >
                {/* 1. Image Container with Aspect Ratio */}
                <div className="relative aspect-[3/4] w-full bg-[#F5EFEB] overflow-hidden mb-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {p.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-[#121212] text-white text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium z-10">
                      {p.tag}
                    </span>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-[#C8A882] text-white text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 font-bold z-10">
                      -{p.discount}%
                    </span>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(p);
                      }}
                      className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md text-[#121212] hover:bg-[#C8A882] hover:text-white transition-colors cursor-pointer"
                      aria-label="Quick View Product"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md text-[#121212] hover:text-red-600 transition-colors cursor-pointer"
                      aria-label="Save to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-red-600 text-red-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* 2. Metadata & Complete Wrapped Product Title */}
                <div className="flex-1 flex flex-col justify-between pt-1">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#8C857B] block font-medium mb-1">
                      {p.brand}
                    </span>

                    {/* Full unwrapped title with minimum height to lock button alignment */}
                    <h3 className="text-xs font-medium text-[#121212] leading-snug group-hover:text-[#C8A882] transition-colors min-h-[2.75rem]">
                      {p.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-[#121212]">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-[#8C857B] line-through">₹{p.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Add to Bag Button Fixed at Card Bottom */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBag(p);
                    }}
                    className="mt-4 w-full bg-[#121212] text-[#FDFBF7] py-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-semibold hover:bg-[#C8A882] transition-colors duration-200 cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Section */}
      <section id="editorial" className="bg-[#F5EFEB] py-24 border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] bg-[#E8E2D9] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
              alt="Editorial Atelier"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C8A882] font-semibold block">Editorial Volume IV</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#121212] leading-tight">
              Quiet Architecture & Honest Fibres
            </h2>
            <p className="text-sm text-[#8C857B] leading-relaxed">
              VELORA was conceived with one conviction: luxury is quiet. We eliminate superfluous ornament in favor of razor-sharp silhouettes, 100% natural Mulberry silks, and unbleached Italian linens.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('Women');
                  document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block border-b-2 border-[#121212] pb-1 text-xs uppercase tracking-[0.2em] font-semibold hover:border-[#C8A882] hover:text-[#C8A882] transition-colors cursor-pointer"
              >
                Shop The Capsule Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VIEW & DETAILED MODAL */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveModalProduct(null)}
          />

          <div className="relative bg-[#FDFBF7] max-w-4xl w-full border border-[#E8E2D9] shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 overflow-hidden max-h-[92vh]">
            <div className="md:col-span-6 relative w-full h-[380px] md:h-auto min-h-[380px] md:min-h-[580px] bg-[#EBE5DE] overflow-hidden flex items-center justify-center">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.title}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A882] font-semibold">
                    {activeModalProduct.brand}
                  </span>
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    aria-label="Close modal"
                    className="p-1 hover:text-[#C8A882] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-[#121212]" />
                  </button>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-light text-[#121212] mb-3 leading-snug">
                  {activeModalProduct.title}
                </h2>

                <div className="flex items-center gap-3 pb-4 border-b border-[#E8E2D9]">
                  <span className="text-2xl font-light">₹{activeModalProduct.price.toLocaleString()}</span>
                  {activeModalProduct.originalPrice > activeModalProduct.price && (
                    <span className="text-sm text-[#8C857B] line-through">
                      ₹{activeModalProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {activeModalProduct.discount > 0 && (
                    <span className="text-xs bg-[#C8A882] text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                      Save {activeModalProduct.discount}%
                    </span>
                  )}
                </div>

                <div className="py-4 border-b border-[#E8E2D9]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold">Select Size</span>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-xs text-[#8C857B] underline flex items-center gap-1 hover:text-[#121212] cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeModalProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setModalSelectedSize(sz)}
                        className={`min-w-[44px] h-11 px-3 border text-xs tracking-wider transition-all cursor-pointer ${
                          modalSelectedSize === sz
                            ? 'bg-[#121212] text-white border-[#121212]'
                            : 'border-[#E8E2D9] text-[#121212] hover:border-[#121212]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {showSizeGuide && (
                    <div className="mt-3 p-3 bg-[#F5EFEB] border border-[#E8E2D9] text-[11px] text-[#8C857B] space-y-1">
                      <p>• <strong>XS / 36:</strong> Bust 32-33" / Waist 24-25"</p>
                      <p>• <strong>S / 38:</strong> Bust 34-35" / Waist 26-27"</p>
                      <p>• <strong>M / 40:</strong> Bust 36-37" / Waist 28-29"</p>
                      <p>• <strong>L / 42:</strong> Bust 38-40" / Waist 30-32"</p>
                    </div>
                  )}
                </div>

                <div className="py-4 border-b border-[#E8E2D9]">
                  <span className="text-xs uppercase tracking-wider font-semibold block mb-2">
                    Delivery Pincode Verification
                  </span>
                  <form onSubmit={handlePincodeCheck} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-white border border-[#E8E2D9] px-3 py-2 text-xs focus:outline-none focus:border-[#121212]"
                    />
                    <button type="submit" className="bg-[#121212] text-white px-4 text-xs uppercase tracking-wider cursor-pointer">
                      Verify
                    </button>
                  </form>
                  {pincodeMessage && (
                    <p className="text-[11px] text-[#121212] mt-2 font-medium">{pincodeMessage}</p>
                  )}
                </div>

                <div className="py-4 text-xs text-[#8C857B] space-y-1.5">
                  <p><strong className="text-[#121212]">Composition:</strong> {activeModalProduct.fabric}</p>
                  <p><strong className="text-[#121212]">Fit Notes:</strong> {activeModalProduct.fit}</p>
                  <p><strong className="text-[#121212]">Garment Care:</strong> {activeModalProduct.care}</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    addToBag(activeModalProduct, modalSelectedSize);
                    setActiveModalProduct(null);
                  }}
                  className="w-full bg-[#121212] text-[#FDFBF7] py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C8A882] transition-colors cursor-pointer"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#C8A882] animate-bounce" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A882] font-semibold">Consignment Reserved</span>
                <h3 className="font-serif text-3xl font-light">Acquisition Confirmed</h3>
                <p className="text-xs text-[#8C857B] leading-relaxed">
                  Your atelier order <strong className="text-[#121212]">#{generatedOrderId}</strong> has been logged. Our concierge will dispatch your consignment itinerary shortly.
                </p>
                <button
                  onClick={() => {
                    setCheckoutComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="bg-[#121212] text-[#FDFBF7] px-8 py-3 text-xs uppercase tracking-wider font-medium cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            ) : isCheckingOut ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                  <h3 className="font-serif text-2xl font-light">Confirm Consignment</h3>
                  <button onClick={() => setIsCheckingOut(false)} className="text-xs text-[#8C857B] underline cursor-pointer">
                    Back to Bag
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#8C857B] mb-1">Full Name</label>
                    <input type="text" defaultValue="Elena Rostova" className="w-full bg-white border border-[#E8E2D9] p-2.5" />
                  </div>
                  <div>
                    <label className="block text-[#8C857B] mb-1">Delivery Address</label>
                    <input type="text" defaultValue="Villa Royale 4B, Crescent Avenue, Mumbai" className="w-full bg-white border border-[#E8E2D9] p-2.5" />
                  </div>
                  <div>
                    <label className="block text-[#8C857B] mb-1">Payment Method</label>
                    <div className="p-3 bg-[#F5EFEB] border border-[#E8E2D9]">
                      <p className="font-semibold text-[#121212]">Sandbox Payment Gateway</p>
                      <p className="text-[11px] text-[#8C857B]">Test mode authorized: instant simulated capture.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E8E2D9] pt-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Payable Total:</span>
                    <span className="font-semibold text-sm">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const id = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
                    setGeneratedOrderId(id);
                    setCart([]);
                    setIsCheckingOut(false);
                    setCheckoutComplete(true);
                  }}
                  className="w-full bg-[#121212] text-[#FDFBF7] py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C8A882] transition-colors cursor-pointer"
                >
                  Authorise & Place Order
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                    <h3 className="font-serif text-2xl font-light">Shopping Bag ({totalBagCount})</h3>
                    <button onClick={() => setIsCartOpen(false)} aria-label="Close cart" className="cursor-pointer">
                      <X className="w-5 h-5 text-[#121212]" />
                    </button>
                  </div>

                  <div className="bg-[#F5EFEB] p-3 my-4 border border-[#E8E2D9] text-xs">
                    {cartSubtotal >= 3500 ? (
                      <span className="text-[#121212] font-semibold">Unlocked Complimentary Express Logistics</span>
                    ) : (
                      <span className="text-[#8C857B]">
                        Add ₹{(3500 - cartSubtotal).toLocaleString()} for Complimentary Shipping
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-xs text-[#8C857B] space-y-4">
                      <p>Your shopping bag is currently empty.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="bg-[#121212] text-[#FDFBF7] px-6 py-2.5 text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        Explore Creations
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E8E2D9] max-h-[46vh] overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            referrerPolicy="no-referrer"
                            className="w-16 aspect-[3/4] object-cover bg-[#F5EFEB]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <h4 className="text-xs font-medium text-[#121212] leading-snug">{item.product.title}</h4>
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.size)}
                                  className="text-[#8C857B] hover:text-red-700 cursor-pointer ml-2"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-[10px] text-[#8C857B] mt-0.5 block">Size: {item.size}</span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center border border-[#E8E2D9]">
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.size, -1)}
                                  className="px-2 py-0.5 text-xs hover:bg-[#F5EFEB] cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-semibold">{item.qty}</span>
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.size, 1)}
                                  className="px-2 py-0.5 text-xs hover:bg-[#F5EFEB] cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs font-semibold">
                                ₹{(item.product.price * item.qty).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-[#E8E2D9] pt-4 space-y-3">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-[#E8E2D9] px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[#121212]"
                      />
                      <button type="submit" className="bg-[#121212] text-white px-3 py-1.5 text-xs uppercase tracking-wider cursor-pointer">
                        Apply
                      </button>
                    </form>

                    {couponMessage && (
                      <p className={`text-[10px] ${appliedDiscount > 0 ? 'text-green-800' : 'text-red-700'}`}>
                        {couponMessage}
                      </p>
                    )}

                    <div className="text-xs space-y-1.5 pt-2 border-t border-[#E8E2D9]">
                      <div className="flex justify-between text-[#8C857B]">
                        <span>Subtotal</span>
                        <span>₹{cartSubtotal.toLocaleString()}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-[#C8A882] font-semibold">
                          <span>Privilege Savings ({appliedDiscount}%)</span>
                          <span>-₹{discountTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#8C857B]">
                        <span>Logistics</span>
                        <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#E8E2D9]">
                        <span>Payable Amount</span>
                        <span>₹{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-[#121212] text-[#FDFBF7] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C8A882] transition-colors cursor-pointer"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                <h3 className="font-serif text-2xl font-light">Saved Archive ({wishlist.length})</h3>
                <button onClick={() => setIsWishlistOpen(false)} aria-label="Close wishlist" className="cursor-pointer">
                  <X className="w-5 h-5 text-[#121212]" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#8C857B]">
                  No pieces saved in your archive yet.
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D9] max-h-[70vh] overflow-y-auto pr-1">
                  {wishlist.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 aspect-[3/4] object-cover bg-[#F5EFEB]"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#8C857B]">{item.brand}</span>
                        <h4 className="text-xs font-medium text-[#121212] leading-snug">{item.title}</h4>
                        <span className="text-xs font-semibold block mt-1">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            addToBag(item);
                            toggleWishlist(item);
                          }}
                          className="text-[10px] bg-[#121212] text-white px-2.5 py-1.5 uppercase tracking-wider hover:bg-[#C8A882] cursor-pointer"
                        >
                          Move To Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-[10px] text-[#8C857B] hover:text-red-700 underline text-center cursor-pointer"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-[#E8E2D9]">
                <span className="font-serif text-xl tracking-[0.2em]">VELORA</span>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="cursor-pointer">
                  <X className="w-5 h-5 text-[#121212]" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C857B] block">Portfolios</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileMenuOpen(false);
                      document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="block w-full text-left text-sm uppercase tracking-[0.15em] font-medium py-2 hover:text-[#C8A882] cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8E2D9] pt-6 text-[11px] text-[#8C857B] space-y-1">
              <p>Concierge: assistance@velora-fashion.com</p>
              <p>Complimentary White-Glove Try-on Available</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#121212] text-[#FDFBF7] py-16 px-6 border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="font-serif text-2xl tracking-[0.25em] block">VELORA</span>
            <span className="text-[10px] tracking-[0.2em] text-[#8C857B]">HAUTE ÉDITION • PARIS & MUMBAI</span>
          </div>
          <p className="text-xs text-[#8C857B]">
            © 2026 VELORA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}