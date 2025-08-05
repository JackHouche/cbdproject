import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables d\'environnement Supabase manquantes');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'iocbd@1.0.0'
    }
  }
});

// Types de données pour TypeScript (optionnel)
export const DB_TABLES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CUSTOMERS: 'customers',
  CATEGORIES: 'categories'
};

// Fonctions utilitaires pour la base de données
export const dbHelpers = {
  // Récupérer tous les produits
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return { data: null, error };
    }
  },

  // Récupérer un produit par ID
  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return { data: null, error };
    }
  },

  // Créer une commande
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      return { data: null, error };
    }
  },

  // Ajouter des articles à une commande
  async addOrderItems(orderItems) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.ORDER_ITEMS)
        .insert(orderItems)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de l\'ajout des articles:', error);
      return { data: null, error };
    }
  },

  // Mettre à jour le stock d'un produit
  async updateProductStock(productId, newStock) {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .update({ stock: newStock })
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      return { data: null, error };
    }
  }
};

export default supabase;