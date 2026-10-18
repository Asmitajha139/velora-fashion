// src/store/useVeloraStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface VeloraState {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  searchQuery: string;
  appliedCoupon: { code: string; discountPercent: number } | null;
  selectedCategory: string;
  
  // Actions
  addToCart: (product: Product, size: string, color?: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

export const useVeloraStore = create<VeloraState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      quickViewProduct: null,
      searchQuery: '',
      appliedCoupon: null,
      selectedCategory: 'All',

      addToCart: (product, size, color, qty = 1) => {
        const currentColor = color || product.colors[0]?.name || 'Standard';
        set((state) => {
          const index = state.cart.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === size
          );
          if (index > -1) {
            const updated = [...state.cart];
            updated[index].quantity += qty;
            return { cart: updated, isCartOpen: true };
          }
          return {
            cart: [...state.cart, { product, selectedSize: size, selectedColor: currentColor, quantity: qty }],
            isCartOpen: true
          };
        });
      },

      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.product.id === productId && item.selectedSize === size)
          )
        }));
      },

      updateQuantity: (productId, size, delta) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.product.id === productId && item.selectedSize === size) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[]
        }));
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          return {
            wishlist: exists
              ? state.wishlist.filter((p) => p.id !== product.id)
              : [...state.wishlist, product]
          };
        });
      },

      isInWishlist: (productId) => get().wishlist.some((p) => p.id === productId),

      setCartOpen: (open) => set({ isCartOpen: open }),
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'VELORA10') {
          set({ appliedCoupon: { code: 'VELORA10', discountPercent: 10 } });
          return { success: true, message: 'Code VELORA10 applied: 10% privilege discount added.' };
        }
        if (clean === 'FIRSTLUXE') {
          set({ appliedCoupon: { code: 'FIRSTLUXE', discountPercent: 15 } });
          return { success: true, message: 'Code FIRSTLUXE applied: 15% VIP atelier discount.' };
        }
        return { success: false, message: 'Invalid or expired invitation code.' };
      },

      removeCoupon: () => set({ appliedCoupon: null })
    }),
    {
      name: 'velora-luxury-state',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist })
    }
  )
);