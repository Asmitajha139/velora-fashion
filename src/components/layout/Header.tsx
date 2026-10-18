'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useVeloraStore } from '@/store/useVeloraStore';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchOpen, setLocalSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Access Zustand store with safe fallbacks
  const store = useVeloraStore();
  const cart = store?.cart || [];
  const wishlist = store?.wishlist || [];
  const cartCount = cart.reduce((total: number, item: any) => total + (item.quantity || item.qty || 1), 0);
  const wishlistCount = wishlist.length;

  const categories = ['Women', 'Men', 'Footwear', 'Bags', 'Accessories', 'Editorial'];

  const handleCategoryClick = (cat: string) => {
    if (store?.setSelectedCategory) {
      store.setSelectedCategory(cat === 'Editorial' ? 'All' : cat);
    }
    setMobileMenuOpen(false);
    
    if (cat === 'Editorial') {
      document.getElementById('editorial')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('catalog-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (store?.setSearchQuery) {
      store.setSearchQuery(localSearchQuery);
    }
    const el = document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9]">
      {/* 1. Announcement Bar */}
      <div className="bg-[#121212] text-[#FDFBF7] text-[10px] md:text-[11px] tracking-[0.2em] uppercase py-2 px-4 text-center flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping On Orders Above ₹3,500</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline text-[#C8A882] font-semibold">USE CODE: VELORA10 FOR 10% OFF</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Left: Mobile hamburger & Desktop category links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#121212] hover:text-[#C8A882] transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.14em] font-medium text-[#121212]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="hover:text-[#C8A882] transition-colors py-2 relative group cursor-pointer"
              >
                {cat}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A882] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Brand Identity Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#121212] block font-light">
              VELORA
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-[#8C857B] block -mt-1 group-hover:text-[#C8A882] transition-colors">
              HAUTE ÉDITION
            </span>
          </Link>
        </div>

        {/* Right: Actions (Search, Wishlist, Bag) */}
        <div className="flex items-center space-x-4 md:space-x-6 text-[#121212]">
          <button
            onClick={() => setLocalSearchOpen(!localSearchOpen)}
            className="p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          <button
            onClick={() => {
              if (store?.setWishlistOpen) store.setWishlistOpen(true);
            }}
            className="relative p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#121212] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (store?.setCartOpen) store.setCartOpen(true);
            }}
            className="relative p-1.5 hover:text-[#C8A882] transition-colors cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8A882] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Live Search Dropdown */}
      {localSearchOpen && (
        <div className="border-t border-[#E8E2D9] bg-[#F5EFEB] px-6 py-4 transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3 border-b border-[#8C857B]/40 pb-2">
            <Search className="w-5 h-5 text-[#8C857B]" />
            <input
              type="text"
              placeholder="Search silk gowns, wool blazers, linen resort shirts, loafers..."
              value={localSearchQuery}
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                if (store?.setSearchQuery) store.setSearchQuery(e.target.value);
              }}
              className="w-full bg-transparent text-sm text-[#121212] placeholder-[#8C857B] focus:outline-none"
              autoFocus
            />
            {localSearchQuery && (
              <button 
                type="button" 
                onClick={() => {
                  setLocalSearchQuery('');
                  if (store?.setSearchQuery) store.setSearchQuery('');
                }}
              >
                <X className="w-4 h-4 text-[#8C857B] hover:text-[#121212]" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-[#E8E2D9]">
                <span className="font-serif text-xl tracking-[0.2em]">VELORA</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5 text-[#121212]" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C857B] block">Collections</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="block w-full text-left text-sm uppercase tracking-[0.15em] font-medium py-2 hover:text-[#C8A882]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8E2D9] pt-6 text-[11px] text-[#8C857B] space-y-1">
              <p>Concierge Desk: assistance@velora-fashion.com</p>
              <p>Complimentary White-Glove Try-on Available</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;