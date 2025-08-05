# 🚀 Configuration Production IØCBD

Ce guide détaille la configuration complète pour mettre en production votre boutique IØCBD avec Supabase et Stripe.

## 📋 Prérequis

- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Stripe](https://stripe.com) (France)
- Compte [Vercel](https://vercel.com) (gratuit)
- Repository GitHub/GitLab

## 🗄️ 1. Configuration Supabase

### Étape 1.1 : Créer le projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Choisissez votre organisation
4. Configuration du projet :
   - **Name** : `iocbd-production`
   - **Database Password** : Générez un mot de passe fort (notez-le !)
   - **Region** : `West EU (Ireland)` (recommandé pour la France)
   - **Pricing Plan** : Free ou Pro selon vos besoins

### Étape 1.2 : Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **"SQL Editor"**
2. Copiez tout le contenu du fichier `supabase-schema.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur **"Run"** pour exécuter le script
5. Vérifiez que toutes les tables sont créées dans **"Table Editor"**

### Étape 1.3 : Configurer l'authentification

1. Allez dans **"Authentication" > "Settings"**
2. **Site URL** : `https://votre-domaine.vercel.app`
3. **Redirect URLs** : Ajoutez votre domaine de production
4. **Email Templates** : Personnalisez si nécessaire

### Étape 1.4 : Configurer le stockage (optionnel)

1. Allez dans **"Storage"**
2. Créez un bucket nommé **"product-images"**
3. Configurez les politiques RLS :
   ```sql
   -- Permettre la lecture publique des images
   CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
   
   -- Permettre l'upload aux admins seulement
   CREATE POLICY "Admin upload access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
   ```

### Étape 1.5 : Récupérer les clés API

1. Allez dans **"Settings" > "API"**
2. Notez ces informations importantes :
   - **Project URL** : `https://xxx.supabase.co`
   - **anon public key** : `eyJhbGc...`
   - **service_role key** : `eyJhbGc...` (gardez-la secrète!)

## 💳 2. Configuration Stripe

### Étape 2.1 : Créer le compte Stripe France

1. Créez un compte sur [Stripe](https://stripe.com/fr)
2. Activez votre compte avec vos informations d'entreprise
3. Validez votre identité (obligatoire pour recevoir les paiements)

### Étape 2.2 : Configuration des produits Stripe

1. Dans le dashboard Stripe, allez dans **"Products"**
2. Créez vos produits CBD (optionnel, pour la synchronisation)
3. Configurez les taxes françaises (TVA 20%)

### Étape 2.3 : Webhooks Stripe (pour plus tard)

1. Allez dans **"Developers" > "Webhooks"**
2. Ajoutez un endpoint : `https://votre-domaine.vercel.app/api/stripe/webhook`
3. Sélectionnez ces événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`

### Étape 2.4 : Récupérer les clés Stripe

1. Allez dans **"Developers" > "API keys"**
2. Mode **"Test"** pour les tests :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...`
3. Mode **"Live"** pour la production :
   - **Publishable key** : `pk_live_...`
   - **Secret key** : `sk_live_...`

## 🌐 3. Déploiement Vercel

### Étape 3.1 : Connexion du repository

1. Connectez-vous à [Vercel](https://vercel.com)
2. Importez votre repository GitHub
3. Configuration du projet :
   - **Framework Preset** : Create React App
   - **Root Directory** : `./`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`

### Étape 3.2 : Configuration des variables d'environnement

Dans Vercel, allez dans **"Settings" > "Environment Variables"** et ajoutez :

```env
# Configuration Supabase (OBLIGATOIRE)
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Configuration Stripe (OBLIGATOIRE)
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_votre_cle_publique_stripe

# Configuration de l'application
REACT_APP_APP_NAME=IØCBD
REACT_APP_APP_URL=https://votre-domaine.vercel.app

# Variables optionnelles
REACT_APP_ADMIN_EMAIL=admin@iocbd.fr
REACT_APP_SUPPORT_EMAIL=support@iocbd.fr
REACT_APP_ENV=production
```

### Étape 3.3 : Domaine personnalisé

1. Dans Vercel, allez dans **"Settings" > "Domains"**
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Vercel

## 🔒 4. Sécurité et Configuration Admin

### Étape 4.1 : Changer le mot de passe admin

1. Connectez-vous à Supabase SQL Editor
2. Mettez à jour le mot de passe admin :
   ```sql
   UPDATE admin_users 
   SET password_hash = 'VOTRE_NOUVEAU_MOT_DE_PASSE_SECURISE'
   WHERE email = 'admin@iocbd.fr';
   ```

### Étape 4.2 : Configuration RLS (Row Level Security)

Les politiques RLS sont déjà configurées dans le schéma. Vérifiez dans **"Authentication" > "Policies"**.

### Étape 4.3 : Backup automatique

1. Dans Supabase, allez dans **"Settings" > "Database"**
2. Configurez les backups automatiques (recommandé : daily)

## 🧪 5. Tests de Production

### Étape 5.1 : Test de connexion Supabase

1. Ouvrez votre site en production
2. Vérifiez la console du navigateur pour les erreurs
3. Testez la création d'un produit dans l'admin

### Étape 5.2 : Test des paiements Stripe

1. Utilisez les cartes de test Stripe :
   - **Visa** : `4242 4242 4242 4242`
   - **Mastercard** : `5555 5555 5555 4444`
   - **Carte déclinée** : `4000 0000 0000 0002`

### Étape 5.3 : Test complet E-commerce

1. Ajoutez des produits via l'admin (`/admin`)
2. Naviguez sur le site public
3. Ajoutez au panier et testez le checkout
4. Vérifiez la commande dans Supabase

## 📊 6. Monitoring et Analytics

### Étape 6.1 : Monitoring Supabase

1. Dashboard Supabase : métriques de base de données
2. Configurez les alertes pour l'usage

### Étape 6.2 : Monitoring Vercel

1. Dashboard Vercel : métriques de performance
2. Configurez les alertes pour les erreurs

### Étape 6.3 : Analytics Stripe

1. Dashboard Stripe : suivi des paiements
2. Rapports de revenus automatiques

## 🚨 7. Troubleshooting

### Erreur : "Variables d'environnement Supabase manquantes"

- Vérifiez que `REACT_APP_SUPABASE_URL` et `REACT_APP_SUPABASE_ANON_KEY` sont définies dans Vercel
- Redéployez après avoir ajouté les variables

### Erreur : "Stripe public key not found"

- Vérifiez que `REACT_APP_STRIPE_PUBLIC_KEY` est définie
- Utilisez la clé publique, pas la clé secrète

### Erreur de connexion base de données

- Vérifiez que le schéma SQL a été exécuté correctement
- Vérifiez les politiques RLS dans Supabase

### Produits non affichés

- Vérifiez que les produits ont `is_active = true`
- Vérifiez les politiques RLS sur la table `products`

## 🎯 8. Optimisations Post-Production

### Performance

1. **Images** : Compressez les images produits
2. **CDN** : Vercel gère automatiquement le CDN
3. **Cache** : Configurez le cache des API Supabase

### SEO

1. **Meta tags** : Personnalisez pour chaque page produit
2. **Sitemap** : Générez automatiquement
3. **Schema.org** : Ajoutez les données structurées produits

### Conversion

1. **Analytics** : Intégrez Google Analytics 4
2. **Heatmaps** : Utilisez Hotjar pour l'UX
3. **A/B Testing** : Testez les pages de checkout

## 🆘 Support

- **Documentation Supabase** : [docs.supabase.com](https://docs.supabase.com)
- **Documentation Stripe** : [stripe.com/docs](https://stripe.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)

---

## ✅ Checklist de mise en production

- [ ] Projet Supabase créé et configuré
- [ ] Schéma SQL exécuté avec succès
- [ ] Compte Stripe France activé
- [ ] Clés API Stripe récupérées
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Déploiement Vercel réussi
- [ ] Mot de passe admin modifié
- [ ] Tests de paiement effectués
- [ ] Domaine personnalisé configuré
- [ ] Monitoring activé
- [ ] Backup configuré

**Votre boutique IØCBD est maintenant prête pour la production ! 🚀**