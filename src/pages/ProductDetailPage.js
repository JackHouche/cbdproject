import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Rating,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ExpandMore,
  Security,
  LocalShipping,
  VerifiedUser,
  Nature,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  // Mock product data - in real app this would come from API
  const product = {
    id: parseInt(id),
    name: 'Huile CBD 10%',
    category: 'Huiles CBD',
    price: 49.90,
    originalPrice: 59.90,
    rating: 4.8,
    reviews: 127,
    description: 'Huile de CBD premium à spectre complet, extraite de chanvre français cultivé biologiquement.',
    longDescription: `Notre huile CBD 10% est extraite à partir de chanvre français cultivé sans pesticides. 
    Elle contient un spectre complet de cannabinoïdes, terpènes et flavonoïdes pour un effet d'entourage optimal. 
    Chaque flacon contient 30ml d'huile pure avec une concentration précise de 10% de CBD.`,
    stock: 23,
    isNew: false,
    isPromo: true,
    images: ['/api/placeholder/500/500', '/api/placeholder/500/500', '/api/placeholder/500/500'],
    specifications: {
      concentration: '10% CBD',
      volume: '30ml',
      extraction: 'CO2 supercritique',
      origine: 'France',
      thc: '< 0.2%',
      certification: 'Bio',
    },
    benefits: [
      'Favorise la relaxation',
      'Aide à réduire le stress',
      'Améliore la qualité du sommeil',
      'Soulage les tensions musculaires',
    ],
    usage: `Commencez par 2-3 gouttes sous la langue, 2 fois par jour. 
    Maintenez sous la langue pendant 30-60 secondes avant d'avaler. 
    Augmentez progressivement selon vos besoins.`,
    precautions: `Ne pas dépasser la dose recommandée. 
    Déconseillé aux femmes enceintes et allaitantes. 
    Tenir hors de portée des enfants. 
    Consulter un médecin en cas de traitement médical.`,
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} ajouté au panier !`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'primary.light', color: 'white' },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>
      </motion.div>

      <Grid container spacing={6}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper sx={{ p: 3 }}>
              {/* Badges */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                  {product.isNew && (
                    <Chip label="Nouveau" color="secondary" size="small" sx={{ mr: 1 }} />
                  )}
                  {product.isPromo && (
                    <Chip label="Promotion" color="error" size="small" />
                  )}
                </Box>
              </Box>

              {/* Main Image */}
              <Box
                sx={{
                  height: 400,
                  background: 'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Nature sx={{ fontSize: '6rem', color: 'primary.main' }} />
              </Box>

              {/* Thumbnail Images */}
              <Grid container spacing={1}>
                {product.images.slice(0, 3).map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        height: 100,
                        background: 'linear-gradient(135deg, #E8F5E8, #C8E6C9)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Nature sx={{ fontSize: '2rem', color: 'primary.main' }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box>
              {/* Product Title */}
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  {product.rating} ({product.reviews} avis)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    {product.price}€
                  </Typography>
                  {product.originalPrice && (
                    <Typography
                      variant="h5"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      {product.originalPrice}€
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  TVA incluse, frais de port en sus
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {product.description}
              </Typography>

              {/* Specifications */}
              <Paper sx={{ p: 2, mb: 3, backgroundColor: 'background.default' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Caractéristiques
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" color="text.secondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Stock Status */}
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: product.stock < 10 ? 'error.main' : 'success.main',
                  fontWeight: 500,
                }}
              >
                {product.stock < 10
                  ? `Seulement ${product.stock} en stock !`
                  : 'En stock'
                }
              </Typography>

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                  Quantité
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      size="small"
                      sx={{
                        width: 80,
                        '& input': { textAlign: 'center' },
                      }}
                      inputProps={{ min: 1, max: product.stock, type: 'number' }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    sx={{
                      flex: 1,
                      py: 2,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C, #689F38)',
                      },
                    }}
                  >
                    Ajouter au panier
                  </Button>
                  <IconButton
                    onClick={toggleFavorite}
                    sx={{
                      border: '2px solid',
                      borderColor: isFavorite ? 'error.main' : 'divider',
                      color: isFavorite ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: isFavorite ? 'error.light' : 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton
                    sx={{
                      border: '2px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              {/* Trust Indicators */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Security sx={{ fontSize: '2rem', color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Paiement sécurisé
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalShipping sx={{ fontSize: '2rem', color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Livraison rapide
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VerifiedUser sx={{ fontSize: '2rem', color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Qualité garantie
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Product Details Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ mt: 6 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Description détaillée
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {product.longDescription}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Bienfaits
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="ul" sx={{ pl: 2 }}>
                {product.benefits.map((benefit, index) => (
                  <Typography
                    component="li"
                    key={index}
                    variant="body1"
                    sx={{ mb: 1, lineHeight: 1.6 }}
                  >
                    {benefit}
                  </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Mode d'emploi
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {product.usage}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Précautions d'emploi
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'warning.main' }}>
                {product.precautions}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProductDetailPage;