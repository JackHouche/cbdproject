# 🚀 Guide de Déploiement - IØCBD

Ce guide vous explique comment déployer votre boutique IØCBD sur Vercel avec Supabase.

## 📋 Prérequis

- Compte [Vercel](https://vercel.com)
- Compte [Supabase](https://supabase.com)
- Repository Git (GitHub, GitLab, etc.)

## 🗄️ Configuration Supabase

### 1. Créer un nouveau projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Cliquez sur "New Project"
3. Choisissez votre organisation
4. Donnez un nom à votre projet (ex: `iocbd`)
5. Créez un mot de passe sécurisé
6. Choisissez une région proche de vos utilisateurs

### 2. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans l'onglet "SQL Editor"
2. Copiez le contenu du fichier `supabase-schema.sql`
3. Collez-le dans l'éditeur SQL
4. Exécutez le script (bouton "Run")

### 3. Récupérer les clés API

1. Allez dans "Settings" > "API"
2. Notez votre `Project URL`
3. Notez votre `anon/public key`

## 🌐 Déploiement sur Vercel

### 1. Connecter votre repository

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Sélectionnez le framework "Create React App"

### 2. Configurer les variables d'environnement

Dans les paramètres de votre projet Vercel, ajoutez ces variables :

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
REACT_APP_APP_NAME=IØCBD
REACT_APP_APP_URL=https://your-app.vercel.app
REACT_APP_ENV=production
```

### 3. Déployer

1. Cliquez sur "Deploy"
2. Attendez que le build se termine
3. Votre site sera disponible sur l'URL fournie par Vercel

## 🔧 Configuration des Variables d'Environnement

### Variables Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | URL de votre projet Supabase | `https://abcdefgh.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

### Variables Optionnelles

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `REACT_APP_APP_NAME` | Nom de l'application | `IØCBD` |
| `REACT_APP_APP_URL` | URL de l'application | URL Vercel |
| `REACT_APP_ENV` | Environnement | `production` |
| `REACT_APP_STRIPE_PUBLIC_KEY` | Clé publique Stripe | - |

## 📊 Configuration des Politiques RLS (Row Level Security)

Dans Supabase, configurez les politiques de sécurité :

```sql
-- Permettre la lecture publique des produits actifs
CREATE POLICY "Public products" ON products FOR SELECT USING (active = true);

-- Permettre aux utilisateurs de voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.email() = email);

-- Permettre l'insertion de nouvelles commandes
CREATE POLICY "Allow order creation" ON orders FOR INSERT WITH CHECK (true);
```

## 🔒 Sécurité

### Headers de sécurité

Ajoutez dans `vercel.json` :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🚀 Déploiement automatique

### 1. Via Git

Chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

### 2. Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

## 📈 Monitoring et Analytics

### 1. Vercel Analytics

1. Dans votre projet Vercel, allez dans "Analytics"
2. Activez Vercel Analytics
3. Ajoutez le script dans votre `public/index.html`

### 2. Supabase Analytics

1. Dans Supabase, consultez l'onglet "Reports"
2. Surveillez les requêtes et performances

## 🔧 Dépannage

### Problèmes courants

1. **Variables d'environnement non définies**
   - Vérifiez que toutes les variables sont définies dans Vercel
   - Redéployez après avoir ajouté les variables

2. **Erreurs de connexion Supabase**
   - Vérifiez l'URL et la clé API
   - Assurez-vous que les politiques RLS sont configurées

3. **Erreurs de build**
   - Vérifiez les logs de build dans Vercel
   - Assurez-vous que toutes les dépendances sont installées

### Logs utiles

```bash
# Logs Vercel
vercel logs

# Logs en temps réel
vercel logs --follow
```

## 📞 Support

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Guide React](https://reactjs.org/docs)

## ✅ Checklist de déploiement

- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté
- [ ] Variables d'environnement configurées
- [ ] Repository connecté à Vercel
- [ ] Premier déploiement réussi
- [ ] Tests de fonctionnalité effectués
- [ ] Politiques RLS configurées
- [ ] Monitoring activé

---

Votre boutique IØCBD est maintenant prête pour la production ! 🌿