import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          let newItems;
          if (existingItem) {
            newItems = state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { ...product, quantity }];
          }
          
          const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: newItems,
            total: newTotal,
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== productId);
          const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: newItems,
            total: newTotal,
          };
        });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          );
          const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: newItems,
            total: newTotal,
          };
        });
      },
      
      clearCart: () => {
        set({ items: [], total: 0 });
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cbd-cart-storage',
      getStorage: () => localStorage,
    }
  )
);