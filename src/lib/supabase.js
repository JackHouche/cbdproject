import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables d'environnement Supabase manquantes. Les fonctionnalités dépendantes sont désactivées.");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'iocbd@1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
  });
}

export { supabase };

// Types de données et tables
export const DB_TABLES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CUSTOMERS: 'customers',
  CATEGORIES: 'categories',
  ADMIN_USERS: 'admin_users'
};

// Fonctions utilitaires pour les produits
export const productService = {
  // Récupérer tous les produits actifs
  async getActiveProducts() {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération produits:', error);
      return { data: null, error: error.message };
    }
  },

  // Récupérer un produit par ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération produit:', error);
      return { data: null, error: error.message };
    }
  },

  // Créer un nouveau produit
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur création produit:', error);
      return { data: null, error: error.message };
    }
  },

  // Mettre à jour un produit
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      return { data: null, error: error.message };
    }
  },

  // Supprimer un produit
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erreur suppression produit:', error);
      return { error: error.message };
    }
  },

  // Mettre à jour le stock
  async updateStock(id, newStock) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .update({ 
          stock: newStock, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour stock:', error);
      return { data: null, error: error.message };
    }
  }
};

// Fonctions utilitaires pour les commandes
export const orderService = {
  // Créer une nouvelle commande
  async createOrder(orderData) {
    try {
      const { data: order, error: orderError } = await supabase
        .from(DB_TABLES.ORDERS)
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insérer les articles de la commande
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from(DB_TABLES.ORDER_ITEMS)
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return { data: order, error: null };
    } catch (error) {
      console.error('Erreur création commande:', error);
      return { data: null, error: error.message };
    }
  },

  // Récupérer les commandes d'un client
  async getOrdersByCustomer(customerEmail) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .select(`
          *,
          order_items(
            *,
            products(name, price)
          )
        `)
        .eq('customer_email', customerEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération commandes client:', error);
      return { data: null, error: error.message };
    }
  },

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId, status) {
    try {
      const updates = {
        status,
        updated_at: new Date().toISOString()
      };

      // Ajouter les timestamps selon le statut
      if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
      if (status === 'shipped') updates.shipped_at = new Date().toISOString();
      if (status === 'delivered') updates.delivered_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour statut commande:', error);
      return { data: null, error: error.message };
    }
  },

  // Récupérer toutes les commandes (admin)
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .select(`
          *,
          order_items(
            *,
            products(name, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération toutes commandes:', error);
      return { data: null, error: error.message };
    }
  }
};

// Fonctions utilitaires pour l'authentification admin
export const authService = {
  // Vérifier les credentials admin
  async verifyAdminCredentials(email, password) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.ADMIN_USERS)
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // En production, utilisez bcrypt pour vérifier le mot de passe
      // Pour maintenant, comparaison simple
      if (data.password_hash === password) {
        return { data: { id: data.id, email: data.email, role: 'admin' }, error: null };
      } else {
        return { data: null, error: 'Identifiants incorrects' };
      }
    } catch (error) {
      console.error('Erreur vérification admin:', error);
      return { data: null, error: 'Identifiants incorrects' };
    }
  }
};

// Fonctions utilitaires pour les catégories
export const categoryService = {
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.CATEGORIES)
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      return { data: null, error: error.message };
    }
  }
};

// Utilitaires généraux
export const supabaseUtils = {
  // Tester la connexion
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.CATEGORIES)
        .select('count')
        .limit(1);

      return { connected: !error, error: error?.message || null };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  },

  // Upload d'image (pour les produits)
  async uploadProductImage(file, fileName) {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error) {
      console.error('Erreur upload image:', error);
      return { data: null, error: error.message };
    }
  }
};

export default supabase;