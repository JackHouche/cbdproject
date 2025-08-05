import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  CreditCard,
  Lock,
  CalendarToday,
  Security,
  CheckCircle,
} from '@mui/icons-material';
import { confirmPayment, getStripeErrorMessage } from '../lib/stripe';

const StripePaymentForm = ({ 
  amount,
  currency = 'EUR',
  onSuccess, 
  onError, 
  disabled = false,
  customerInfo = {}
}) => {
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: customerInfo.name || '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCard = () => {
    const newErrors = {};

    // Validation simple du numéro de carte (simulation)
    if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis)';
    }

    // Validation de la date d'expiration
    if (!cardForm.expiryDate || !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/AA';
    } else {
      // Vérifier que la date n'est pas expirée
      const [month, year] = cardForm.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiry <= now) {
        newErrors.expiryDate = 'Date d\'expiration passée';
      }
    }

    // Validation du CVC
    if (!cardForm.cvc || cardForm.cvc.length < 3) {
      newErrors.cvc = 'Code de sécurité invalide (3-4 chiffres)';
    }

    // Validation du nom
    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Nom du titulaire requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    // Supprimer tous les espaces et ne garder que les chiffres
    const numbers = value.replace(/\D/g, '');
    // Ajouter un espace tous les 4 chiffres
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limiter à 16 chiffres + 3 espaces
  };

  const formatExpiryDate = (value) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    // Ajouter automatiquement le slash après les 2 premiers chiffres
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;

    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvc') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardForm({ ...cardForm, [field]: value });

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCard()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulation d'un délai de traitement réaliste
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer un objet de méthode de paiement simulé
      const paymentMethod = {
        card: {
          number: cardForm.cardNumber.replace(/\s/g, ''),
          exp_month: cardForm.expiryDate.split('/')[0],
          exp_year: '20' + cardForm.expiryDate.split('/')[1],
          cvc: cardForm.cvc,
        },
        billing_details: {
          name: cardForm.cardholderName,
          email: customerInfo.email,
        },
      };

      // Simuler le traitement Stripe
      const result = await confirmPayment(amount, currency, paymentMethod);

      if (result.success) {
        onSuccess({
          paymentIntentId: result.paymentIntentId,
          status: 'succeeded',
          amount: amount,
          currency: currency.toLowerCase(),
          paymentMethod: 'stripe',
          card: {
            brand: getCardBrand(cardForm.cardNumber),
            last4: cardForm.cardNumber.replace(/\s/g, '').slice(-4),
          }
        });
      } else {
        onError({
          message: result.error || 'Erreur de paiement',
          type: 'card_error'
        });
      }
    } catch (error) {
      onError({
        message: getStripeErrorMessage(error) || 'Erreur lors du traitement du paiement',
        type: 'api_error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const getCardDisplayName = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return 'Carte bancaire';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Lock sx={{ color: 'success.main', mr: 1 }} />
        <Typography variant="h6">
          Paiement sécurisé - {amount.toFixed(2)}€
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Mode simulation :</strong> Utilisez les cartes de test suivantes :<br />
          • <strong>Visa :</strong> 4242 4242 4242 4242<br />
          • <strong>Mastercard :</strong> 5555 5555 5555 4444<br />
          • <strong>Date :</strong> n'importe quelle date future (ex: 12/25)<br />
          • <strong>CVC :</strong> n'importe quel code à 3 chiffres (ex: 123)
        </Typography>
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom du titulaire"
              value={cardForm.cardholderName}
              onChange={handleInputChange('cardholderName')}
              error={!!errors.cardholderName}
              helperText={errors.cardholderName}
              disabled={disabled || isProcessing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Numéro de carte"
              value={cardForm.cardNumber}
              onChange={handleInputChange('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber || (cardForm.cardNumber && getCardDisplayName(cardForm.cardNumber))}
              placeholder="1234 5678 9012 3456"
              disabled={disabled || isProcessing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date d'expiration"
              value={cardForm.expiryDate}
              onChange={handleInputChange('expiryDate')}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              placeholder="MM/AA"
              disabled={disabled || isProcessing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Code CVC"
              value={cardForm.cvc}
              onChange={handleInputChange('cvc')}
              error={!!errors.cvc}
              helperText={errors.cvc}
              placeholder="123"
              disabled={disabled || isProcessing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={disabled || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              background: isProcessing 
                ? 'linear-gradient(45deg, #9E9E9E, #BDBDBD)' 
                : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              '&:hover': {
                background: isProcessing 
                  ? 'linear-gradient(45deg, #9E9E9E, #BDBDBD)' 
                  : 'linear-gradient(45deg, #388E3C, #689F38)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(45deg, #9E9E9E, #BDBDBD)',
                color: 'white',
              }
            }}
          >
            {isProcessing ? 'Traitement du paiement...' : `Payer ${amount.toFixed(2)}€ maintenant`}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            🔒 Vos données sont sécurisées et chiffrées
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Powered by Stripe • PCI DSS Level 1 Certified
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StripePaymentForm;