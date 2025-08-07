export const mockProducts = [
  {
    id: 1,
    name: 'Huile CBD 10%',
    category: 'Huiles CBD',
    categorySlug: 'huiles',
    price: 49.9,
    originalPrice: 59.9,
    rating: 4.8,
    reviews: 127,
    description: 'Huile de CBD premium à spectre complet',
    longDescription: `Notre huile CBD 10% est extraite à partir de chanvre cultivé sans pesticides.
Elle contient un spectre complet de cannabinoïdes pour un effet d'entourage optimal.
Chaque flacon contient 30ml d'huile pure avec une concentration précise de 10% de CBD.`,
    stock: 23,
    isNew: false,
    isPromo: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1537767418177-f2d14d7f8e6c?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1587019156648-1c1b2a6998dd?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=500&q=80'
    ],
    specifications: {
      concentration: '10% CBD',
      volume: '30ml',
      extraction: 'CO2 supercritique',
      origine: 'France',
      thc: '< 0.2%',
      certification: 'Bio'
    },
    benefits: [
      'Favorise la relaxation',
      'Aide à réduire le stress',
      'Améliore la qualité du sommeil',
      'Soulage les tensions musculaires'
    ],
    usage: `Commencez par 2-3 gouttes sous la langue, deux fois par jour.
Maintenez sous la langue pendant 30-60 secondes avant d'avaler.
Augmentez progressivement selon vos besoins.`,
    precautions: `Ne pas dépasser la dose recommandée.
Déconseillé aux femmes enceintes et allaitantes.
Tenir hors de portée des enfants.
Consulter un médecin en cas de traitement médical.`
  },
  {
    id: 2,
    name: 'Fleurs CBD Indoor',
    category: 'Fleurs CBD',
    categorySlug: 'fleurs',
    price: 8.9,
    originalPrice: 10.9,
    rating: 4.9,
    reviews: 89,
    description: 'Fleurs cultivées en intérieur, qualité supérieure',
    longDescription: `Nos fleurs CBD indoor sont soigneusement sélectionnées pour leur arôme riche et leur teneur élevée en CBD.
Cultivées sous serre pour un contrôle total de la qualité.`,
    stock: 50,
    isNew: true,
    isPromo: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1604335514656-5f44c13c6d3f?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1600180758890-6f4dd0b54195?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=80'
    ],
    specifications: {
      variete: 'Sativa',
      culture: 'Indoor',
      thc: '< 0.2%'
    },
    benefits: [
      'Effet relaxant immédiat',
      'Arôme floral intense',
      'Idéal en vaporisation ou infusion'
    ],
    usage: `À vaporiser ou infuser selon vos préférences.
Commencez par de petites quantités.`,
    precautions: `Produit destiné aux adultes.
À conserver à l'abri de l'humidité et de la chaleur.`
  },
  {
    id: 3,
    name: 'Tisane Relaxante',
    category: 'Tisanes',
    categorySlug: 'tisanes',
    price: 15.9,
    originalPrice: 19.9,
    rating: 4.7,
    reviews: 156,
    description: 'Mélange de plantes apaisantes avec CBD',
    longDescription: `Cette tisane combine des plantes traditionnelles apaisantes et du chanvre riche en CBD pour un moment de détente.`,
    stock: 40,
    isNew: false,
    isPromo: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=500&q=80'
    ],
    specifications: {
      poids: '50g',
      origine: 'France',
      thc: '0%'
    },
    benefits: [
      'Apaise l\'esprit',
      'Favorise le sommeil',
      'Goût doux et parfumé'
    ],
    usage: `Infuser une cuillère à café dans 200ml d'eau chaude pendant 5 minutes.
À consommer de préférence le soir.`,
    precautions: `Ne pas consommer en cas d'allergie à l'un des ingrédients.`
  }
];

export default mockProducts;
