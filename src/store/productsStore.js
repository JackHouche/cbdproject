import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useProductsStore = create(
  persist(
    (set, get) => ({
      // État
      products: [
        {
          id: '1',
          name: 'Huile CBD 10%',
          slug: 'huile-cbd-10',
          description: 'Huile de CBD premium à 10% de concentration',
          longDescription: 'Notre huile CBD 10% est extraite de chanvre biologique européen. Parfaite pour commencer avec le CBD.',
          category: 'huiles',
          price: 49.99,
          originalPrice: 59.99,
          stock: 25,
          images: ['/images/huile-cbd-10.jpg'],
          specifications: {
            concentration: '10%',
            volume: '10ml',
            origine: 'France',
            extraction: 'CO2 supercritique'
          },
          benefits: ['Relaxation', 'Sommeil', 'Anti-stress'],
          usageInstructions: 'Commencez par 2-3 gouttes sous la langue, 2 fois par jour.',
          precautions: 'Ne pas dépasser la dose recommandée. Déconseillé aux femmes enceintes.',
          isActive: true,
          isFeatured: true,
          isPromo: true,
          rating: 4.8,
          reviewCount: 156,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Fleurs CBD Amnesia',
          slug: 'fleurs-cbd-amnesia',
          description: 'Fleurs CBD Amnesia de qualité premium',
          longDescription: 'Variété Amnesia cultivée en indoor, riche en CBD et faible en THC (<0.2%).',
          category: 'fleurs',
          price: 8.99,
          originalPrice: null,
          stock: 15,
          images: ['/images/fleurs-amnesia.jpg'],
          specifications: {
            concentration: '18%',
            poids: '1g',
            culture: 'Indoor',
            variete: 'Amnesia'
          },
          benefits: ['Détente', 'Créativité', 'Focus'],
          usageInstructions: 'À vaporiser ou infuser. Ne pas fumer.',
          precautions: 'Réservé aux adultes. Usage externe uniquement.',
          isActive: true,
          isFeatured: false,
          isPromo: false,
          rating: 4.6,
          reviewCount: 89,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      categories: [
        { id: 'huiles', name: 'Huiles CBD', slug: 'huiles' },
        { id: 'fleurs', name: 'Fleurs CBD', slug: 'fleurs' },
        { id: 'tisanes', name: 'Tisanes CBD', slug: 'tisanes' },
        { id: 'resines', name: 'Résines CBD', slug: 'resines' },
        { id: 'cosmétiques', name: 'Cosmétiques CBD', slug: 'cosmetiques' }
      ],
      isLoading: false,
      error: null,

      // Actions CRUD
      createProduct: (productData) => {
        const newProduct = {
          id: uuidv4(),
          slug: productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          isActive: true,
          isFeatured: false,
          isPromo: false,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...productData,
        };

        set(state => ({
          products: [...state.products, newProduct]
        }));

        return newProduct;
      },

      updateProduct: (id, productData) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? {
                  ...product,
                  ...productData,
                  updatedAt: new Date().toISOString(),
                  slug: productData.name 
                    ? productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                    : product.slug
                }
              : product
          )
        }));

        return get().products.find(p => p.id === id);
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(product => product.id !== id)
        }));
      },

      toggleProductStatus: (id) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, isActive: !product.isActive, updatedAt: new Date().toISOString() }
              : product
          )
        }));
      },

      toggleFeatured: (id) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, isFeatured: !product.isFeatured, updatedAt: new Date().toISOString() }
              : product
          )
        }));
      },

      togglePromo: (id) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, isPromo: !product.isPromo, updatedAt: new Date().toISOString() }
              : product
          )
        }));
      },

      updateStock: (id, newStock) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, stock: newStock, updatedAt: new Date().toISOString() }
              : product
          )
        }));
      },

      // Getters
      getProductById: (id) => {
        return get().products.find(product => product.id === id);
      },

      getProductBySlug: (slug) => {
        return get().products.find(product => product.slug === slug);
      },

      getActiveProducts: () => {
        return get().products.filter(product => product.isActive);
      },

      getFeaturedProducts: () => {
        return get().products.filter(product => product.isFeatured && product.isActive);
      },

      getPromoProducts: () => {
        return get().products.filter(product => product.isPromo && product.isActive);
      },

      getProductsByCategory: (categoryId) => {
        return get().products.filter(product => 
          product.category === categoryId && product.isActive
        );
      },

      searchProducts: (query) => {
        const searchTerm = query.toLowerCase();
        return get().products.filter(product =>
          product.isActive && (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
          )
        );
      },

      // Statistiques
      getStats: () => {
        const products = get().products;
        return {
          totalProducts: products.length,
          activeProducts: products.filter(p => p.isActive).length,
          inactiveProducts: products.filter(p => !p.isActive).length,
          featuredProducts: products.filter(p => p.isFeatured).length,
          promoProducts: products.filter(p => p.isPromo).length,
          lowStockProducts: products.filter(p => p.stock < 5).length,
          outOfStockProducts: products.filter(p => p.stock === 0).length,
          totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        };
      },

      // Utilitaires
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'products-storage',
      version: 1,
    }
  )
);

export default useProductsStore;