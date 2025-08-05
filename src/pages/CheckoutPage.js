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
import useOrdersStore from '../store/ordersStore';
import StripePaymentForm from '../components/StripePaymentForm';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { createOrder } = useOrdersStore();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

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
      id: 'stripe',
      name: 'Carte bancaire (Stripe)',
      description: 'Visa, MasterCard, American Express - Paiement sécurisé',
      icon: CreditCard,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement sécurisé avec PayPal (Bientôt disponible)',
      icon: Payment,
      disabled: true,
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
        return formData.acceptTerms && paymentMethod;
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

  const handlePaymentSuccess = async (paymentResult) => {
    setIsProcessing(true);
    
    try {
      // Créer la commande avec les données du paiement
      const orderData = {
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          marketingConsent: formData.newsletter,
        },
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        subtotal: total,
        shippingCost: selectedShipping.price,
        taxAmount: 0, // À calculer selon les réglementations
        total: finalTotal,
        paymentMethod: 'stripe',
        paymentIntentId: paymentResult.paymentIntentId,
        shippingMethod: shippingMethod,
        currency: 'EUR',
      };

      const createdOrder = await createOrder(orderData);
      
      if (createdOrder) {
        setOrderNumber(createdOrder.orderNumber || `IOCBD${Date.now().toString().slice(-6)}`);
        clearCart();
        setActiveStep(2);
        toast.success('Commande confirmée et paiement réussi !');
      } else {
        throw new Error('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la commande:', error);
      toast.error('Erreur lors du traitement de la commande. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Erreur de paiement:', error);
    toast.error(`Erreur de paiement: ${error.message || 'Veuillez réessayer'}`);
    setIsProcessing(false);
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
                  control={<Radio disabled={option.disabled} />}
                  disabled={option.disabled}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: option.disabled ? 0.5 : 1 }}>
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

        {paymentMethod === 'stripe' && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Informations de paiement sécurisé
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                💳 Paiement sécurisé par Stripe. Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.
              </Typography>
            </Alert>
            <StripePaymentForm
              amount={finalTotal}
              currency="EUR"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              disabled={isProcessing}
              customerInfo={{
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
              }}
            />
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
          
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              🔒 Paiement 100% sécurisé avec chiffrement SSL
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Le paiement sera traité directement via Stripe lors de la validation de votre commande
          </Typography>
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
        Numéro de commande : {orderNumber}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
        Merci pour votre commande ! Vous recevrez un email de confirmation à l'adresse {formData.email}.
        Votre commande sera préparée et expédiée dans les plus brefs délais.
      </Typography>

      <Alert severity="info" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="body2">
          💳 <strong>Paiement confirmé</strong> - Votre carte a été débitée de {finalTotal.toFixed(2)}€
        </Typography>
      </Alert>

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
          onClick={() => navigate('/mon-compte')}
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
          Suivre ma commande
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
              disabled={activeStep === 1 && paymentMethod === 'stripe'} // Stripe gère le paiement directement
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              {activeStep === 0 ? 'Paiement' : 'Continuer'}
            </Button>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default CheckoutPage;