import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send,
  Chat,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    'Information produit',
    'Commande / Livraison',
    'Service client',
    'Partenariat',
    'Autre',
  ];

  const contactInfo = [
    {
      icon: Email,
      title: 'Email',
      content: 'contact@cbdnature.fr',
      subtitle: 'Réponse sous 24h',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      subtitle: 'Lun-Ven 9h-18h',
    },
    {
      icon: LocationOn,
      title: 'Adresse',
      content: '123 Rue de la Nature\n75001 Paris, France',
      subtitle: 'Showroom sur RDV',
    },
    {
      icon: AccessTime,
      title: 'Horaires',
      content: 'Lun-Ven: 9h-18h\nSam: 10h-16h',
      subtitle: 'Fermé le dimanche',
    },
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message envoyé avec succès !');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contactez-nous
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6 }}
          >
            Notre équipe est là pour répondre à toutes vos questions
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={6}>
        {/* Formulaire de contact */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Envoyez-nous un message
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom complet *"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                    <FormControl fullWidth>
                      <InputLabel>Sujet</InputLabel>
                      <Select
                        value={formData.subject}
                        label="Sujet"
                        onChange={handleInputChange('subject')}
                      >
                        {subjects.map((subject) => (
                          <MenuItem key={subject} value={subject}>
                            {subject}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message *"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange('message')}
                      required
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={isSubmitting}
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
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Informations de contact */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Nos coordonnées
              </Typography>
              
              {contactInfo.map((info, index) => (
                <Card key={index} sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <info.icon sx={{ color: 'white', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                          {info.content}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {info.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Chat en direct */}
            <Card sx={{ background: 'linear-gradient(135deg, #4CAF50, #8BC34A)', color: 'white' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Chat sx={{ fontSize: '3rem', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Chat en direct
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  Besoin d'une réponse immédiate ? Chattez avec notre équipe !
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                  }}
                >
                  Démarrer le chat
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ mt: 8 }}>
          <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)' }}>
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 4, fontWeight: 600 }}
            >
              Questions fréquentes
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Qu'est-ce que le CBD ?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Le CBD (cannabidiol) est un composé naturel extrait du chanvre, 
                    sans effet psychoactif, reconnu pour ses propriétés relaxantes.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Vos produits sont-ils légaux ?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Oui, tous nos produits contiennent moins de 0,2% de THC et sont 
                    conformes à la réglementation française et européenne.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Comment utiliser l'huile CBD ?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Déposez quelques gouttes sous la langue, maintenez 30-60 secondes 
                    avant d'avaler. Commencez par une faible dose.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    Livraison et retours ?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Livraison gratuite dès 50€ d'achat. Retours possibles sous 30 jours 
                    si les produits sont non ouverts.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ContactPage;