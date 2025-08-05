import { loadStripe } from '@stripe/stripe-js';

// Clé publique Stripe (remplacez par votre vraie clé en production)
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdef';

// Initialiser Stripe
let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export default getStripe;

// Fonction pour créer un Payment Intent (simulation)
export const createPaymentIntent = async (amount, currency = 'eur') => {
  try {
    // En production, ceci devrait être un appel à votre backend
    // qui créerait le Payment Intent via l'API Stripe
    
    // Simulation d'un Payment Intent
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000),
    };

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Fonction pour confirmer le paiement (simulation)
export const confirmPayment = async (paymentIntentId, paymentMethod) => {
  try {
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulation d'un succès de paiement (90% de succès)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        paymentIntent: {
          id: paymentIntentId,
          status: 'succeeded',
          amount_received: paymentMethod.amount,
          charges: {
            data: [{
              id: `ch_${Date.now()}`,
              receipt_url: `https://pay.stripe.com/receipts/${paymentIntentId}`,
            }]
          }
        }
      };
    } else {
      return {
        success: false,
        error: 'Votre carte a été déclinée. Veuillez essayer avec une autre carte.',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Utilitaires Stripe
export const formatAmountForStripe = (amount, currency = 'eur') => {
  // Stripe utilise les plus petites unités (centimes pour EUR)
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount, currency = 'eur') => {
  // Convertir les centimes en euros
  return amount / 100;
};

export const getStripeErrorMessage = (error) => {
  const errorMessages = {
    'card_declined': 'Votre carte a été déclinée.',
    'expired_card': 'Votre carte a expiré.',
    'incorrect_cvc': 'Le code de sécurité de votre carte est incorrect.',
    'processing_error': 'Une erreur est survenue lors du traitement de votre paiement.',
    'incorrect_number': 'Le numéro de carte est incorrect.',
    'incomplete_number': 'Le numéro de carte est incomplet.',
    'incomplete_cvc': 'Le code de sécurité est incomplet.',
    'incomplete_expiry': 'La date d\'expiration est incomplète.',
    'invalid_expiry_month': 'Le mois d\'expiration est invalide.',
    'invalid_expiry_year': 'L\'année d\'expiration est invalide.',
    'invalid_number': 'Le numéro de carte est invalide.',
  };

  return errorMessages[error.code] || error.message || 'Une erreur est survenue lors du paiement.';
};