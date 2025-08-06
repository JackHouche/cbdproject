import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
} from '@mui/material';
import {
  Nature,
  LocalShipping,
  Security,
  HealthAndSafety,
  Star,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const HomePage = () => {
  const features = [
    {
      icon: Nature,
      title: 'Produits Bio',
      description: 'CBD cultivé naturellement sans pesticides ni produits chimiques',
    },
    {
      icon: Security,
      title: 'Qualité Garantie',
      description: 'Tests en laboratoire pour assurer la pureté et la qualité',
    },
    {
      icon: LocalShipping,
      title: 'Livraison Rapide',
      description: 'Expédition discrète en 24-48h partout en France',
    },
    {
      icon: HealthAndSafety,
      title: 'Conseils Experts',
      description: 'Équipe spécialisée pour vous accompagner',
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Huile CBD 10%',
      price: 49.90,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 127,
      description: 'Huile de CBD premium à spectre complet',
    },
    {
      id: 2,
      name: 'Fleurs CBD Indoor',
      price: 8.90,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 89,
      description: 'Fleurs cultivées en intérieur, qualité supérieure',
    },
    {
      id: 3,
      name: 'Tisane Relaxante',
      price: 15.90,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 156,
      description: 'Mélange de plantes apaisantes avec CBD',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  CBD Premium
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    color: 'text.secondary',
                    fontWeight: 400,
                  }}
                >
                  Découvrez notre gamme de CBD premium français
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: '1.2rem',
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    maxWidth: '500px',
                  }}
                >
                  Des produits de qualité supérieure, cultivés avec passion et respect de la nature. 
                  Retrouvez votre équilibre naturellement.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/produits"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C, #689F38)',
                      },
                    }}
                  >
                    Découvrir nos produits
                  </Button>
                  <Button
                    component={Link}
                    to="/a-propos"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    En savoir plus
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 300, md: 400 },
                      height: { xs: 300, md: 400 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E8F5E8, #C8E6C9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 40px rgba(76, 175, 80, 0.2)',
                    }}
                  >
                    <Box
                      component="img"
                      src="/logo-iocbd-rounded.png"
                      alt="IØCBD"
                      sx={{
                        maxWidth: '70%',
                        maxHeight: '70%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 15px 30px rgba(76, 175, 80, 0.4))',
                        animation: 'pulse 3s ease-in-out infinite',
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 6, color: 'text.primary' }}
            >
              Pourquoi choisir CBD Nature ?
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        <feature.icon sx={{ fontSize: '2.5rem', color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Produits Populaires
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 6, color: 'text.secondary', fontSize: '1.2rem' }}
            >
              Nos clients adorent ces produits
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {featuredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    component={Link}
                    to={`/produit/${product.id}`}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 250,
                        background: 'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Nature sx={{ fontSize: '4rem', color: 'primary.main' }} />
                    </CardMedia>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={product.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({product.reviews})
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {product.price}€
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/produits"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              Voir tous les produits
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #2E3440 0%, #3B4252 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 600,
                }}
              >
                Prêt à commencer votre voyage bien-être ?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.2rem',
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                Découvrez nos produits CBD de qualité premium et rejoignez des milliers 
                de clients satisfaits qui ont fait confiance à CBD Nature.
              </Typography>
              <Button
                component={Link}
                to="/produits"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 3,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C, #689F38)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Commencer maintenant
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;