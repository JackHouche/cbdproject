-- Schema SQL pour IØCBD - Production
-- À exécuter dans l'éditeur SQL de Supabase

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des catégories de produits
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) CHECK (original_price IS NULL OR original_price > price),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  images TEXT[], -- Array d'URLs d'images
  specifications JSONB DEFAULT '{}', -- Stockage des spécifications en JSON
  benefits TEXT[] DEFAULT '{}', -- Array des bienfaits
  usage_instructions TEXT,
  precautions TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_promo BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  sku VARCHAR(50) UNIQUE,
  weight DECIMAL(8,2), -- Poids en grammes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  is_active BOOLEAN DEFAULT true,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des adresses clients
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  street VARCHAR(255) NOT NULL,
  street2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(2) DEFAULT 'FR' NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_info JSONB NOT NULL, -- Stockage des infos client
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50) DEFAULT 'stripe',
  stripe_payment_intent_id VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost DECIMAL(10,2) DEFAULT 0 CHECK (shipping_cost >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  currency VARCHAR(3) DEFAULT 'EUR',
  shipping_method VARCHAR(50) DEFAULT 'standard',
  tracking_number VARCHAR(100),
  notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL, -- Stockage du nom au moment de la commande
  product_sku VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'support')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sessions de paiement Stripe
CREATE TABLE IF NOT EXISTS stripe_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  payment_intent_id VARCHAR(255),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Montant en centimes
  currency VARCHAR(3) DEFAULT 'eur',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer un numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'IO' || EXTRACT(YEAR FROM NOW()) || LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || LPAD((EXTRACT(EPOCH FROM NOW()) * 1000)::bigint % 100000::bigint::text, 5, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour générer automatiquement le numéro de commande
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Fonction pour mettre à jour le stock après une commande
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id AND stock >= NEW.quantity;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insuffisant pour le produit %', NEW.product_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour le stock (optionnel - à activer si souhaité)
-- CREATE TRIGGER update_stock_trigger AFTER INSERT ON order_items
--   FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Insertion des catégories par défaut
INSERT INTO categories (name, slug, description) VALUES
  ('Huiles CBD', 'huiles', 'Huiles de CBD de qualité premium'),
  ('Fleurs CBD', 'fleurs', 'Fleurs de CBD indoor et outdoor'),
  ('Tisanes CBD', 'tisanes', 'Tisanes relaxantes au CBD'),
  ('Résines CBD', 'resines', 'Résines et hash CBD'),
  ('Cosmétiques CBD', 'cosmetiques', 'Produits cosmétiques au CBD')
ON CONFLICT (slug) DO NOTHING;

-- Insertion d'un utilisateur admin par défaut
-- Mot de passe: admin123 (à changer en production!)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role) VALUES
  ('admin@iocbd.fr', 'admin123', 'Admin', 'IØCBD', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertion de produits d'exemple
INSERT INTO products (
  name, slug, description, long_description, category_id, price, original_price, stock,
  specifications, benefits, usage_instructions, precautions, is_featured, is_promo, rating, review_count
) VALUES
  (
    'Huile CBD 10% Premium',
    'huile-cbd-10-premium',
    'Huile de CBD premium à 10% de concentration, extraite de chanvre biologique',
    'Notre huile CBD 10% est extraite de chanvre biologique européen cultivé sans pesticides. Extraction par CO2 supercritique pour préserver tous les cannabinoïdes et terpènes.',
    (SELECT id FROM categories WHERE slug = 'huiles'),
    49.99,
    59.99,
    25,
    '{"concentration": "10%", "volume": "10ml", "origine": "France", "extraction": "CO2 supercritique", "cbd_content": "1000mg"}',
    '{"Relaxation", "Amélioration du sommeil", "Réduction du stress", "Anti-inflammatoire"}',
    'Commencez par 2-3 gouttes sous la langue, 2 fois par jour. Maintenez sous la langue pendant 30-60 secondes avant d''avaler.',
    'Ne pas dépasser la dose recommandée. Déconseillé aux femmes enceintes et allaitantes. Tenir hors de portée des enfants.',
    true,
    true,
    4.8,
    156
  ),
  (
    'Fleurs CBD Amnesia Indoor',
    'fleurs-cbd-amnesia-indoor',
    'Fleurs CBD Amnesia cultivées en indoor, 18% de CBD',
    'Variété Amnesia cultivée en indoor sous conditions contrôlées. Riche en CBD (18%) et faible en THC (<0.2%). Arôme citronné et effet relaxant.',
    (SELECT id FROM categories WHERE slug = 'fleurs'),
    8.99,
    null,
    15,
    '{"concentration": "18%", "poids": "1g", "culture": "Indoor", "variete": "Amnesia", "thc": "<0.2%"}',
    '{"Détente musculaire", "Amélioration de la créativité", "Aide à la concentration"}',
    'À vaporiser entre 160-180°C ou à infuser dans une matière grasse. Ne pas fumer.',
    'Réservé aux adultes. Usage externe uniquement. Ne pas conduire après consommation.',
    false,
    false,
    4.6,
    89
  )
ON CONFLICT (slug) DO NOTHING;

-- Configuration des politiques RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des produits actifs
CREATE POLICY "Produits publics" ON products FOR SELECT USING (is_active = true);

-- Politique pour permettre la lecture publique des catégories actives
CREATE POLICY "Catégories publiques" ON categories FOR SELECT USING (is_active = true);

-- Politique pour permettre aux utilisateurs de voir leurs propres commandes
CREATE POLICY "Commandes clients" ON orders FOR SELECT USING (customer_email = current_setting('app.current_user_email', true));

-- Politique pour permettre la création de nouvelles commandes
CREATE POLICY "Création commandes" ON orders FOR INSERT WITH CHECK (true);

-- Politique pour les articles de commande
CREATE POLICY "Articles commandes" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_email = current_setting('app.current_user_email', true)
  )
);

-- Politique pour permettre l'insertion d'articles de commande
CREATE POLICY "Insertion articles" ON order_items FOR INSERT WITH CHECK (true);

-- Fonctions pour les statistiques admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_products', (SELECT COUNT(*) FROM products),
    'active_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
    'total_orders', (SELECT COUNT(*) FROM orders),
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
    'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid'),
    'this_month_revenue', (
      SELECT COALESCE(SUM(total), 0) FROM orders 
      WHERE payment_status = 'paid' 
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vue pour les commandes avec détails
CREATE VIEW order_details AS
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'price', oi.price,
      'total', oi.total
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

COMMENT ON DATABASE postgres IS 'IØCBD E-commerce Database - Production Ready';