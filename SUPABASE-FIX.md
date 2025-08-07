# 🔧 Correction Erreur Supabase : Contrainte Clé Étrangère

## ❌ Erreur rencontrée
```
ERROR: 42804: foreign key constraint "customer_addresses_customer_id_fkey" cannot be implemented
DETAIL: Key columns "customer_id" and "id" are of incompatible types: uuid and integer.
```

## 🔍 Cause du problème
Cette erreur indique que les tables existantes dans votre base de données Supabase utilisent des types incompatibles :
- La table `customers` a probablement un `id` de type `integer`
- Mais le nouveau schéma attend un `id` de type `UUID`

## 💡 Solution : Réinitialisation complète de la base

### Étape 1 : Sauvegarder les données (si nécessaire)
Si vous avez des données importantes, exportez-les avant de continuer.

### Étape 2 : Supprimer toutes les tables existantes
Dans l'éditeur SQL de Supabase, exécutez cette commande :

```sql
-- ⚠️ ATTENTION : Cette commande supprime TOUTES les données !
-- Sauvegardez vos données importantes avant d'exécuter

DROP TABLE IF EXISTS stripe_sessions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;  
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Supprimer les séquences et fonctions si elles existent
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS get_admin_stats() CASCADE;
DROP VIEW IF EXISTS order_details CASCADE;
```

### Étape 3 : Exécuter le nouveau schéma
Copiez tout le contenu du fichier `supabase-schema.sql` et exécutez-le dans l'éditeur SQL de Supabase.

### Étape 4 : Vérifier l'installation
Exécutez cette requête pour vérifier que tout est correctement installé :

```sql
-- Vérifier les tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'products', 'customers', 'customer_addresses', 'orders', 'order_items', 'admin_users', 'stripe_sessions');

-- Vérifier l'utilisateur admin
SELECT email, first_name, last_name FROM admin_users;

-- Tester la fonction de statistiques
SELECT * FROM get_admin_stats();
```

## 🎯 Points importants

1. **UUID vs Integer** : Le nouveau schéma utilise des UUID pour tous les IDs, ce qui est plus sécurisé et évite les conflits.

2. **Données de test** : Après la réinitialisation, vous aurez :
   - 5 catégories par défaut
   - 1 compte admin : `admin@iocbd.com` / mot de passe à définir
   - Aucun produit (à ajouter via le panel admin)

3. **RLS activé** : Les politiques de sécurité au niveau des lignes sont automatiquement configurées.

4. **Triggers fonctionnels** : 
   - Mise à jour automatique des `updated_at`
   - Génération automatique des numéros de commande

## 🔄 Alternative : Migration incrémentale (plus complexe)

Si vous souhaitez conserver vos données existantes, vous devrez :

1. Créer de nouvelles tables avec des noms temporaires
2. Migrer les données en convertissant les IDs
3. Supprimer les anciennes tables
4. Renommer les nouvelles tables

Cette approche est plus complexe et nécessite une planification minutieuse.

## ✅ Vérification finale

Après avoir appliqué le correctif :

1. Connectez-vous au panel admin avec `admin@iocbd.com` et votre mot de passe défini
2. Créez quelques produits de test
3. Testez le processus de commande complet
4. Vérifiez que les paiements Stripe sont correctement simulés

## 🚨 Important
- **Changez le mot de passe admin** après l'installation
- **Sauvegardez régulièrement** votre base de données
- **Testez en mode développement** avant la mise en production