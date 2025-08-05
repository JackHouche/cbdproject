-- Schema SQL pour la boutique CBD Nature
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des catégories de produits
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  category_id INTEGER REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  images TEXT[], -- Array d'URLs d'images
  specifications JSONB, -- Stockage des spécifications en JSON
  benefits TEXT[], -- Array des bienfaits
  usage_instructions TEXT,
  precautions TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_promo BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des clients
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des adresses de livraison
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  type VARCHAR(20) DEFAULT 'shipping', -- 'shipping' ou 'billing'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(100),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'France',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method VARCHAR(50), -- card, paypal, etc.
  
  -- Montants
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Adresses (dénormalisées pour garder l'historique)
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  
  -- Livraison
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  
  -- Données du produit au moment de la commande (dénormalisées)
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des avis produits
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id),
  order_id INTEGER REFERENCES orders(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des favoris
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(customer_id, product_id)
);

-- Table pour les newsletters
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des données de test
INSERT INTO categories (name, slug, description) VALUES
('Huiles CBD', 'huiles', 'Huiles de CBD à différentes concentrations'),
('Fleurs CBD', 'fleurs', 'Fleurs de chanvre séchées riches en CBD'),
('Tisanes', 'tisanes', 'Infusions et tisanes au CBD'),
('Résines', 'resines', 'Résines et hash de CBD'),
('Cosmétiques', 'cosmetiques', 'Produits cosmétiques au CBD');

INSERT INTO products (name, slug, description, long_description, category_id, price, original_price, stock, specifications, benefits, usage_instructions, precautions, rating, review_count, is_new, is_promo, active) VALUES
(
  'Huile CBD 5%',
  'huile-cbd-5',
  'Huile de CBD douce pour débuter',
  'Notre huile CBD 5% est parfaite pour les débutants. Extraite à partir de chanvre français cultivé sans pesticides.',
  1,
  29.90,
  35.90,
  15,
  '{"concentration": "5% CBD", "volume": "30ml", "extraction": "CO2 supercritique", "origine": "France", "thc": "< 0.2%", "certification": "Bio"}',
  '{"Favorise la relaxation", "Aide à réduire le stress léger", "Améliore la qualité du sommeil", "Soulage les tensions"}',
  'Commencez par 2-3 gouttes sous la langue, 2 fois par jour. Maintenez sous la langue pendant 30-60 secondes avant d''avaler.',
  'Ne pas dépasser la dose recommandée. Déconseillé aux femmes enceintes et allaitantes. Tenir hors de portée des enfants.',
  4.6,
  89,
  false,
  true,
  true
),
(
  'Huile CBD 10%',
  'huile-cbd-10',
  'Huile de CBD premium à spectre complet',
  'Notre huile CBD 10% offre un dosage intermédiaire pour un usage quotidien. Effet d''entourage garanti.',
  1,
  49.90,
  NULL,
  23,
  '{"concentration": "10% CBD", "volume": "30ml", "extraction": "CO2 supercritique", "origine": "France", "thc": "< 0.2%", "certification": "Bio"}',
  '{"Favorise la relaxation", "Aide à réduire le stress", "Améliore la qualité du sommeil", "Soulage les tensions musculaires"}',
  'Commencez par 2-3 gouttes sous la langue, 2 fois par jour. Ajustez selon vos besoins.',
  'Ne pas dépasser la dose recommandée. Déconseillé aux femmes enceintes et allaitantes.',
  4.8,
  127,
  false,
  false,
  true
),
(
  'Fleurs CBD Amnesia',
  'fleurs-cbd-amnesia',
  'Fleurs cultivées en intérieur, arôme citronné',
  'Variété Amnesia cultivée indoor avec soin. Arômes citronnés et effets relaxants.',
  2,
  8.90,
  NULL,
  45,
  '{"concentration": "18% CBD", "poids": "1g", "culture": "Indoor", "origine": "France", "thc": "< 0.2%"}',
  '{"Relaxation profonde", "Réduction du stress", "Amélioration de l''humeur"}',
  'À vaporiser ou infuser. Ne pas fumer. Commencer par une petite quantité.',
  'Réservé aux adultes. Ne pas conduire après utilisation.',
  4.7,
  156,
  false,
  false,
  true
);

-- RLS (Row Level Security) - à configurer selon vos besoins
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Politique pour les produits (lecture publique)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (active = true);

-- Index pour les performances
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);