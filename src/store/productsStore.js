import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { productService, categoryService } from '../lib/supabase';

const useProductsStore = create(
  persist(
    (set, get) => ({
      // État
      products: [],
      categories: [],
      isLoading: false,
      error: null,

      // Actions de chargement depuis Supabase
      loadProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await productService.getActiveProducts();
          if (error) throw new Error(error);
          
          // Transformer les données Supabase au format du store
          const transformedProducts = data.map(product => ({
            ...product,
            category: product.categories?.slug || product.category_id,
            originalPrice: product.original_price,
            longDescription: product.long_description,
            usageInstructions: product.usage_instructions,
            isActive: product.is_active,
            isFeatured: product.is_featured,
            isPromo: product.is_promo,
            reviewCount: product.review_count,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
          }));
          
          set({ products: transformedProducts, isLoading: false });
        } catch (error) {
          console.error('Erreur chargement produits:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      loadCategories: async () => {
        try {
          const { data, error } = await categoryService.getAllCategories();
          if (error) throw new Error(error);
          
          // Transformer les données Supabase au format du store
          const transformedCategories = data.map(cat => ({
            id: cat.slug,
            name: cat.name,
            slug: cat.slug,
            supabaseId: cat.id
          }));
          
          set({ categories: transformedCategories });
        } catch (error) {
          console.error('Erreur chargement catégories:', error);
          set({ error: error.message });
        }
      },

      // Actions CRUD
      createProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
          // Trouver l'ID de la catégorie Supabase
          const categories = get().categories;
          const category = categories.find(c => c.id === productData.category);
          
          const supabaseData = {
            name: productData.name,
            slug: productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
            description: productData.description,
            long_description: productData.longDescription,
            category_id: category?.supabaseId,
            price: productData.price,
            original_price: productData.originalPrice,
            stock: productData.stock,
            benefits: productData.benefits,
            usage_instructions: productData.usageInstructions,
            precautions: productData.precautions,
            is_active: true,
            is_featured: false,
            is_promo: false,
            rating: 0,
            review_count: 0,
          };

          const { data, error } = await productService.createProduct(supabaseData);
          if (error) throw new Error(error);

          // Recharger les produits après création
          await get().loadProducts();
          set({ isLoading: false });
          
          return data;
        } catch (error) {
          console.error('Erreur création produit:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
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