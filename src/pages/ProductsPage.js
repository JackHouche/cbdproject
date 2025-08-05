import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Eco,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const addToCart = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 1,
      name: 'Huile CBD 5%',
      category: 'huiles',
      price: 29.90,
      originalPrice: 35.90,
      rating: 4.6,
      reviews: 89,
      description: 'Huile de CBD douce pour débuter',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: true,
      stock: 15,
    },
    {
      id: 2,
      name: 'Huile CBD 10%',
      category: 'huiles',
      price: 49.90,
      rating: 4.8,
      reviews: 127,
      description: 'Huile de CBD premium à spectre complet',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: false,
      stock: 23,
    },
    {
      id: 3,
      name: 'Huile CBD 20%',
      category: 'huiles',
      price: 89.90,
      rating: 4.9,
      reviews: 76,
      description: 'Concentration élevée pour utilisateurs expérimentés',
      image: '/api/placeholder/300/300',
      isNew: true,
      isPromo: false,
      stock: 8,
    },
    {
      id: 4,
      name: 'Fleurs CBD Amnesia',
      category: 'fleurs',
      price: 8.90,
      rating: 4.7,
      reviews: 156,
      description: 'Fleurs cultivées en intérieur, arôme citronné',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: false,
      stock: 45,
    },
    {
      id: 5,
      name: 'Fleurs CBD OG Kush',
      category: 'fleurs',
      price: 9.90,
      rating: 4.8,
      reviews: 134,
      description: 'Variété premium aux notes terreuses',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: false,
      stock: 32,
    },
    {
      id: 6,
      name: 'Tisane Relaxante CBD',
      category: 'tisanes',
      price: 15.90,
      rating: 4.5,
      reviews: 89,
      description: 'Mélange de plantes apaisantes avec CBD',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: false,
      stock: 67,
    },
    {
      id: 7,
      name: 'Résine CBD Afghan',
      category: 'resines',
      price: 6.90,
      originalPrice: 8.90,
      rating: 4.6,
      reviews: 98,
      description: 'Résine traditionnelle afghane au CBD',
      image: '/api/placeholder/300/300',
      isNew: false,
      isPromo: true,
      stock: 28,
    },
    {
      id: 8,
      name: 'Crème CBD Anti-douleur',
      category: 'cosmetiques',
      price: 34.90,
      rating: 4.7,
      reviews: 67,
      description: 'Soulagement naturel des douleurs musculaires',
      image: '/api/placeholder/300/300',
      isNew: true,
      isPromo: false,
      stock: 19,
    },
  ];

  const categories = [
    { value: 'all', label: 'Toutes catégories' },
    { value: 'huiles', label: 'Huiles CBD' },
    { value: 'fleurs', label: 'Fleurs CBD' },
    { value: 'tisanes', label: 'Tisanes' },
    { value: 'resines', label: 'Résines' },
    { value: 'cosmetiques', label: 'Cosmétiques' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'newest', label: 'Plus récents' },
  ];

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.isNew - a.isNew;
        default:
          return 0;
      }
    });

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast.success('Retiré des favoris');
    } else {
      newFavorites.add(productId);
      toast.success('Ajouté aux favoris');
    }
    setFavorites(newFavorites);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nos Produits CBD
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Découvrez notre sélection de produits CBD français de qualité premium
          </Typography>
        </Box>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box
          sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Rechercher"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, description..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={filterCategory}
                  label="Catégorie"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trier par</InputLabel>
                <Select
                  value={sortBy}
                  label="Trier par"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                {filteredAndSortedProducts.length} produit(s) trouvé(s)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {filteredAndSortedProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
                  {product.isNew && (
                    <Chip
                      label="Nouveau"
                      color="secondary"
                      size="small"
                      sx={{ mb: 1, display: 'block' }}
                    />
                  )}
                  {product.isPromo && (
                    <Chip
                      label="Promo"
                      color="error"
                      size="small"
                      sx={{ mb: 1, display: 'block' }}
                    />
                  )}
                </Box>

                {/* Favorite Button */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                  onClick={() => toggleFavorite(product.id)}
                >
                  {favorites.has(product.id) ? (
                    <Favorite sx={{ color: 'error.main' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>

                <CardMedia
                  component={Link}
                  to={`/produit/${product.id}`}
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <Eco sx={{ fontSize: '3rem', color: 'primary.main' }} />
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/produit/${product.id}`}
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: 'text.primary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({product.reviews})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {product.price}€
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                          }}
                        >
                          {product.originalPrice}€
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color={product.stock < 10 ? 'error.main' : 'success.main'}
                    >
                      {product.stock < 10 ? `Seulement ${product.stock} en stock` : 'En stock'}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    sx={{
                      background: product.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      '&:hover': {
                        background: product.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #388E3C, #689F38)',
                      },
                    }}
                  >
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* No results message */}
      {filteredAndSortedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Eco sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              Aucun produit trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </Typography>
          </Box>
        </motion.div>
      )}
    </Container>
  );
};

export default ProductsPage;