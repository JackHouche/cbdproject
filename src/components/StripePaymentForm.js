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
} from '@mui/icons-material';
import { confirmPayment, getStripeErrorMessage } from '../lib/stripe';

const StripePaymentForm = ({ 
  paymentIntent, 
  onPaymentSuccess, 
  onPaymentError, 
  isProcessing, 
  setIsProcessing 
}) => {
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const newErrors = {};

    // Validation simple du numéro de carte (simulation)
    if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }

    // Validation de la date d'expiration
    if (!cardForm.expiryDate || !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/AA';
    }

    // Validation du CVC
    if (!cardForm.cvc || cardForm.cvc.length < 3) {
      newErrors.cvc = 'Code de sécurité invalide';
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
      const paymentMethod = {
        card: {
          number: cardForm.cardNumber.replace(/\s/g, ''),
          exp_month: cardForm.expiryDate.split('/')[0],
          exp_year: '20' + cardForm.expiryDate.split('/')[1],
          cvc: cardForm.cvc,
        },
        billing_details: {
          name: cardForm.cardholderName,
        },
        amount: paymentIntent.amount,
      };

      const result = await confirmPayment(paymentIntent.id, paymentMethod);

      if (result.success) {
        onPaymentSuccess(result.paymentIntent);
      } else {
        onPaymentError(result.error);
      }
    } catch (error) {
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return 'Carte';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Lock sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="h6">
            Paiement sécurisé
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Cartes de test :</strong><br />
            • Visa : 4242 4242 4242 4242<br />
            • Mastercard : 5555 5555 5555 4444<br />
            • Date : n'importe quelle date future<br />
            • CVC : n'importe quel code à 3 chiffres
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
                helperText={errors.cardNumber || getCardType(cardForm.cardNumber)}
                placeholder="1234 5678 9012 3456"
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
                label="Code de sécurité"
                value={cardForm.cvc}
                onChange={handleInputChange('cvc')}
                error={!!errors.cvc}
                helperText={errors.cvc}
                placeholder="123"
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

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} /> : <Lock />}
              sx={{
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              {isProcessing ? 'Traitement...' : `Payer ${(paymentIntent.amount / 100).toFixed(2)}€`}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            🔒 Paiement sécurisé avec chiffrement SSL
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;