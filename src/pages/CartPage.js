import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack,
  Payment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (item) => {
    removeItem(item.id);
    toast.success(`${item.name} retiré du panier`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Panier vidé');
  };

  const shippingCost = total > 50 ? 0 : 4.90;
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <ShoppingCartOutlined sx={{ fontSize: '6rem', color: 'text.secondary', mb: 3 }} />
            <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
              Votre panier est vide
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.2rem' }}>
              Découvrez nos produits CBD de qualité et ajoutez-les à votre panier.
            </Typography>
            <Button
              component={Link}
              to="/produits"
              variant="contained"
              size="large"
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
              Voir nos produits
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'primary.light', color: 'white' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h3"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Mon Panier ({items.length} {items.length > 1 ? 'articles' : 'article'})
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Articles
                </Typography>
                <Button
                  onClick={handleClearCart}
                  color="error"
                  startIcon={<Delete />}
                  sx={{ textTransform: 'none' }}
                >
                  Vider le panier
                </Button>
              </Box>

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                      <Grid container spacing={3} alignItems="center">
                        {/* Product Image */}
                        <Grid item xs={12} sm={3}>
                          <Box
                            sx={{
                              height: 100,
                              background: 'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ color: 'primary.main', fontWeight: 600 }}
                            >
                              CBD
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Product Info */}
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="h6"
                            component={Link}
                            to={`/produit/${item.id}`}
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': { color: 'primary.main' },
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.description}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}
                          >
                            {item.price}€
                          </Typography>
                        </Grid>

                        {/* Quantity Controls */}
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              size="small"
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                              }}
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(item.id, value);
                              }}
                              size="small"
                              sx={{
                                width: 60,
                                '& input': { textAlign: 'center' },
                              }}
                              inputProps={{ min: 1, type: 'number' }}
                            />
                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              size="small"
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </Grid>

                        {/* Total & Remove */}
                        <Grid item xs={12} sm={2}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}
                            >
                              {(item.price * item.quantity).toFixed(2)}€
                            </Typography>
                            <IconButton
                              onClick={() => handleRemoveItem(item)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Paper>
          </motion.div>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Récapitulatif
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Sous-total</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {total.toFixed(2)}€
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Livraison</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {shippingCost === 0 ? (
                      <span style={{ color: '#4CAF50' }}>Gratuite</span>
                    ) : (
                      `${shippingCost.toFixed(2)}€`
                    )}
                  </Typography>
                </Box>

                {total < 50 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Livraison gratuite à partir de 50€
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {finalTotal.toFixed(2)}€
                  </Typography>
                </Box>
              </Box>

              <Button
                component={Link}
                to="/commande"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Payment />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C, #689F38)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Procéder au paiement
              </Button>

              <Button
                component={Link}
                to="/produits"
                fullWidth
                variant="outlined"
                size="large"
                sx={{
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
                Continuer mes achats
              </Button>

              {/* Trust Indicators */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Paiement 100% sécurisé
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'background.default',
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    SSL
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'background.default',
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    VISA
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'background.default',
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    PAYPAL
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;