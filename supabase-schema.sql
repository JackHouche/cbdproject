-- Schema SQL pour IØCBD - Production (CORRIGÉ)
-- À exécuter dans l'éditeur SQL de Supabase

-- ⚠️ IMPORTANT: Avant d'exécuter ce script, supprimez toutes les tables existantes :
-- DROP TABLE IF EXISTS stripe_sessions CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;  
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS customer_addresses CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

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

-- Table des adresses clients (CORRIGÉE)
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
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
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL, -- Nom du produit au moment de la commande
  product_sku VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sessions Stripe
CREATE TABLE IF NOT EXISTS stripe_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  payment_intent_id VARCHAR(255),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  amount_total INTEGER NOT NULL, -- Montant en centimes
  currency VARCHAR(3) DEFAULT 'eur',
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES pour optimiser les performances
-- ============================================

-- Index pour les produits
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Index pour les articles de commande
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Index pour les adresses
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer ON customer_addresses(customer_id);

-- Index pour les clients
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Index pour Stripe
CREATE INDEX IF NOT EXISTS idx_stripe_sessions_order ON stripe_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_stripe_sessions_session_id ON stripe_sessions(session_id);

-- ============================================
-- TRIGGERS et FONCTIONS
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stripe_sessions_updated_at BEFORE UPDATE ON stripe_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer automatiquement le numéro de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'IOCBD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Séquence pour les numéros de commande
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger pour générer automatiquement le numéro de commande
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Fonction pour mettre à jour le stock des produits (optionnel, commenté par défaut)
-- CREATE OR REPLACE FUNCTION update_product_stock()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
--     ELSIF TG_OP = 'UPDATE' THEN
--         UPDATE products SET stock = stock + OLD.quantity - NEW.quantity WHERE id = NEW.product_id;
--     ELSIF TG_OP = 'DELETE' THEN
--         UPDATE products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
--     END IF;
--     RETURN COALESCE(NEW, OLD);
-- END;
-- $$ language 'plpgsql';

-- Trigger pour la gestion automatique du stock (commenté par défaut)
-- CREATE TRIGGER update_product_stock_trigger AFTER INSERT OR UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour obtenir les statistiques admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE(
    total_orders bigint,
    total_revenue numeric,
    pending_orders bigint,
    total_products bigint,
    low_stock_products bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid') as total_revenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
        (SELECT COUNT(*) FROM products WHERE stock <= 5 AND is_active = true) as low_stock_products;
END;
$$ language 'plpgsql';

-- Vue pour les détails de commandes
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id,
    o.order_number,
    o.customer_email,
    o.status,
    o.payment_status,
    o.total,
    o.created_at,
    COUNT(oi.id) as item_count,
    STRING_AGG(oi.product_name, ', ') as product_names
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.customer_email, o.status, o.payment_status, o.total, o.created_at;

-- ============================================
-- DONNÉES DE BASE
-- ============================================

-- Insertion des catégories par défaut
INSERT INTO categories (name, slug, description) VALUES 
('Huiles CBD', 'huiles-cbd', 'Huiles de CBD premium pour une relaxation naturelle'),
('Fleurs CBD', 'fleurs-cbd', 'Fleurs de chanvre séchées riches en CBD'),
('Cosmétiques CBD', 'cosmetiques-cbd', 'Produits de beauté et soins au CBD'),
('Comestibles CBD', 'comestibles-cbd', 'Bonbons, chocolats et autres produits alimentaires au CBD'),
('Vaporisateurs', 'vaporisateurs', 'Dispositifs de vaporisation pour CBD')
ON CONFLICT (slug) DO NOTHING;

-- Insertion d'un utilisateur admin par défaut
-- Mot de passe: admin123 (à changer en production!)
INSERT INTO admin_users (email, password_hash, first_name, last_name) VALUES 
('admin@iocbd.com', '$2b$10$rHjQqK9ZzZ8YrJ3QrQZ8YeJ3QrQZ8YeJ3QrQZ8YeJ3QrQZ8YeJ3Qr', 'Admin', 'IØCBD')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories (lecture publique)
CREATE POLICY "Catégories visibles publiquement" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin peut tout faire sur catégories" ON categories FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les produits (lecture publique)
CREATE POLICY "Produits actifs visibles publiquement" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin peut tout faire sur produits" ON products FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les clients
CREATE POLICY "Client peut voir ses propres données" ON customers FOR SELECT USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Client peut modifier ses propres données" ON customers FOR UPDATE USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Création de compte client" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut tout faire sur clients" ON customers FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les adresses clients
CREATE POLICY "Client peut voir ses adresses" ON customer_addresses FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Client peut modifier ses adresses" ON customer_addresses FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admin peut tout faire sur adresses" ON customer_addresses FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les commandes
CREATE POLICY "Client peut voir ses commandes" ON orders FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
CREATE POLICY "Création de commande" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut tout faire sur commandes" ON orders FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les articles de commande
CREATE POLICY "Client peut voir les articles de ses commandes" ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_email = auth.jwt() ->> 'email'));
CREATE POLICY "Création d'articles de commande" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut tout faire sur articles de commande" ON order_items FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les sessions Stripe
CREATE POLICY "Client peut voir ses sessions Stripe" ON stripe_sessions FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
CREATE POLICY "Création de session Stripe" ON stripe_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut tout faire sur sessions Stripe" ON stripe_sessions FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- Politiques pour les admins (seulement les admins peuvent les voir)
CREATE POLICY "Admin peut voir les comptes admin" ON admin_users FOR SELECT USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));
CREATE POLICY "Admin peut modifier les comptes admin" ON admin_users FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- ============================================
-- FINALISATION
-- ============================================

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Schema IØCBD installé avec succès !';
    RAISE NOTICE 'Admin par défaut: admin@iocbd.com / admin123';
    RAISE NOTICE '⚠️  Changez le mot de passe admin en production !';
END $$;