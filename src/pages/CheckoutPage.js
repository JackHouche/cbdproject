import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  CheckCircle,
  Lock,
  CreditCard,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    acceptTerms: false,
    newsletter: false,
  });

  const steps = ['Livraison', 'Paiement', 'Confirmation'];

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      description: '3-5 jours ouvrés',
      price: total > 50 ? 0 : 4.90,
    },
    {
      id: 'express',
      name: 'Livraison Express',
      description: '24-48h',
      price: 9.90,
    },
    {
      id: 'pickup',
      name: 'Retrait en magasin',
      description: 'Gratuit - Disponible sous 2h',
      price: 0,
    },
  ];

  const paymentOptions = [
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, MasterCard, American Express',
      icon: CreditCard,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement sécurisé avec PayPal',
      icon: Payment,
    },
  ];

  const selectedShipping = shippingOptions.find(option => option.id === shippingMethod);
  const finalTotal = total + selectedShipping.price;

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.address &&
          formData.city &&
          formData.postalCode &&
          formData.phone
        );
      case 1:
        return formData.acceptTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(1)) {
      toast.error('Veuillez accepter les conditions générales de vente');
      return;
    }

    setIsProcessing(true);
    
    // Simulation du traitement de commande
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      setActiveStep(2);
      toast.success('Commande confirmée !');
    } catch (error) {
      toast.error('Erreur lors du traitement de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && activeStep < 2) {
    navigate('/panier');
    return null;
  }

  const renderShippingStep = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Informations de livraison
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom *"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom *"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse *"
                value={formData.address}
                onChange={handleInputChange('address')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville *"
                value={formData.city}
                onChange={handleInputChange('city')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal *"
                value={formData.postalCode}
                onChange={handleInputChange('postalCode')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pays"
                value={formData.country}
                onChange={handleInputChange('country')}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone *"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                required
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Mode de livraison
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              {shippingOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', minWidth: 300 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {option.price === 0 ? 'Gratuit' : `${option.price}€`}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mr: 0 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Récapitulatif
          </Typography>
          <Box sx={{ mb: 3 }}>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {item.name} x{item.quantity}
                </Typography>
                <Typography variant="body2">
                  {(item.price * item.quantity).toFixed(2)}€
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Sous-total</Typography>
              <Typography variant="body1">{total.toFixed(2)}€</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Livraison</Typography>
              <Typography variant="body1">
                {selectedShipping.price === 0 ? 'Gratuit' : `${selectedShipping.price}€`}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {finalTotal.toFixed(2)}€
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPaymentStep = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Mode de paiement
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <option.icon />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mr: 0 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {paymentMethod === 'card' && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Informations de paiement
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Numéro de carte"
                  placeholder="1234 5678 9012 3456"
                  InputProps={{
                    startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date d'expiration"
                  placeholder="MM/AA"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Code CVV"
                  placeholder="123"
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom sur la carte"
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptTerms}
                onChange={handleCheckboxChange('acceptTerms')}
                required
              />
            }
            label={
              <Typography variant="body2">
                J'accepte les{' '}
                <Typography component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                  conditions générales de vente
                </Typography>{' '}
                et la{' '}
                <Typography component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                  politique de confidentialité
                </Typography>
                *
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.newsletter}
                onChange={handleCheckboxChange('newsletter')}
              />
            }
            label={
              <Typography variant="body2">
                Je souhaite recevoir la newsletter et les offres promotionnelles
              </Typography>
            }
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Total de la commande
          </Typography>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
            {finalTotal.toFixed(2)}€
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Paiement 100% sécurisé avec SSL
            </Typography>
          </Alert>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmitOrder}
            disabled={isProcessing}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C, #689F38)',
              },
            }}
          >
            {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderConfirmationStep = () => (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle sx={{ fontSize: '6rem', color: 'success.main', mb: 3 }} />
      </motion.div>
      
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
        Commande confirmée !
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Numéro de commande : #CBD{Date.now().toString().slice(-6)}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
        Merci pour votre commande ! Vous recevrez un email de confirmation à l'adresse {formData.email}.
        Votre commande sera préparée et expédiée dans les plus brefs délais.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/produits')}
          sx={{
            px: 4,
            py: 2,
            background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            '&:hover': {
              background: 'linear-gradient(45deg, #388E3C, #689F38)',
            },
          }}
        >
          Continuer mes achats
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 4,
            background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Finaliser ma commande
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: completed || active ? 'primary.main' : 'grey.300',
                      color: completed || active ? 'white' : 'grey.600',
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </Box>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {activeStep === 0 && renderShippingStep()}
          {activeStep === 1 && renderPaymentStep()}
          {activeStep === 2 && renderConfirmationStep()}
        </Box>

        {activeStep < 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ px: 4, py: 1.5 }}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              {activeStep === steps.length - 2 ? 'Paiement' : 'Continuer'}
            </Button>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default CheckoutPage;