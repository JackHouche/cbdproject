# 🌿 CBD Nature - Boutique E-commerce Française

Une boutique en ligne moderne et élégante pour la vente de produits CBD, construite avec React, Material-UI et une ambiance nature/chill.

## ✨ Fonctionnalités

### 🛒 E-commerce Complet
- **Catalogue de produits** avec filtres et recherche
- **Panier d'achat** avec gestion des quantités
- **Processus de commande** en 3 étapes
- **Système de favoris** pour les produits
- **Gestion des stocks** en temps réel

### 🎨 Design & UX
- **Interface moderne** avec animations fluides
- **Thème nature** avec couleurs apaisantes
- **Responsive design** optimisé mobile/tablette
- **Accessibilité** respectant les bonnes pratiques
- **Typographie** harmonieuse (Poppins + Dancing Script)

### 🔧 Fonctionnalités Techniques
- **Store Zustand** pour la gestion d'état
- **Persistance locale** du panier
- **Animations Framer Motion** pour les interactions
- **Notifications toast** pour le feedback utilisateur
- **Routing React Router** pour la navigation

### 📱 Pages Incluses
- **Accueil** - Hero section, produits phares, valeurs
- **Catalogue** - Tous les produits avec filtres avancés
- **Détail produit** - Informations complètes, avis, spécifications
- **Panier** - Gestion des articles, calcul des frais
- **Commande** - Formulaire complet, choix livraison/paiement
- **À Propos** - Histoire de la marque, équipe, valeurs
- **Contact** - Formulaire, coordonnées, FAQ
- **Administration** - Gestion des produits (CRUD)

## 🚀 Installation

### Prérequis
- Node.js (version 14+)
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Démarrage du serveur de développement
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Build de production
```bash
npm run build
```

## 📦 Dépendances Principales

- **React 18** - Framework principal
- **Material-UI 5** - Composants et thème
- **React Router 6** - Routing
- **Zustand** - Gestion d'état
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 🎨 Thème et Design

### Palette de couleurs
- **Primaire** : `#4CAF50` (Vert nature)
- **Secondaire** : `#8BC34A` (Vert clair)
- **Arrière-plan** : `#F8F9FA` avec dégradés nature
- **Texte** : `#2E3440` et `#5E6472`

### Typographie
- **Titres** : Dancing Script (élégante, manuscrite)
- **Corps** : Poppins (moderne, lisible)

### Animations
- Entrées en fondu avec décalages
- Transitions hover fluides
- Micro-interactions sur les boutons
- Scroll animations avec Framer Motion

## 🛍️ Utilisation

### Navigation Client
1. **Découverte** - Page d'accueil avec présentation
2. **Shopping** - Parcours du catalogue avec filtres
3. **Sélection** - Ajout au panier depuis les pages produits
4. **Commande** - Processus guidé en 3 étapes
5. **Confirmation** - Validation et suivi de commande

### Administration
- Accès via `/admin`
- Statistiques de vente
- CRUD complet des produits
- Gestion des stocks et statuts

## 🌟 Points Forts

### Performance
- **Code splitting** automatique avec React
- **Optimisations images** et assets
- **Lazy loading** des composants
- **Bundle optimisé** pour la production

### Accessibilité
- **Navigation clavier** complète
- **Lecteurs d'écran** supportés
- **Contrastes** respectant WCAG
- **Focus management** approprié

### SEO Ready
- **Meta tags** optimisés
- **Structure sémantique** HTML5
- **URLs** propres et descriptives
- **Performance** optimisée

## 🔧 Personnalisation

### Modification du thème
Le thème est centralisé dans `src/theme.js` :
```javascript
// Modifier les couleurs principales
primary: {
  main: '#4CAF50', // Votre couleur
}
```

### Ajout de produits
Via l'interface admin ou en modifiant les données mock dans les composants.

### Adaptation des textes
Tous les textes sont en français et facilement modifiables dans les composants.

## 📱 Responsive Design

- **Mobile First** - Design optimisé mobile
- **Breakpoints** Material-UI standards
- **Navigation mobile** avec drawer
- **Touch friendly** pour tablettes

## 🔒 Sécurité

- **Validation** des formulaires côté client
- **Sanitisation** des entrées utilisateur
- **Protection CSRF** (à implémenter côté serveur)
- **HTTPS** recommandé en production

## 🚀 Déploiement

### Netlify/Vercel (Recommandé)
```bash
npm run build
# Upload du dossier build/
```

### Serveur traditionnel
```bash
npm run build
# Servir le dossier build/ avec nginx/apache
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment procéder :

1. Fork du projet
2. Création d'une branche feature
3. Commit des changements
4. Push vers la branche
5. Ouverture d'une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : contact@cbdnature.fr
- GitHub Issues : [Créer une issue](https://github.com/votre-repo/issues)

## 🙏 Remerciements

- **Material-UI** pour les composants
- **Framer Motion** pour les animations
- **React Community** pour l'écosystème
- **Cannabis Industry** pour l'inspiration

---

**Made with 💚 for the CBD community in France**

Développé avec passion pour démocratiser l'accès au CBD de qualité. 🌿