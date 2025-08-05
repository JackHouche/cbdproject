import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Nature,
  HealthAndSafety,
  Verified,
  LocalFlorist,
  Science,
  Group,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const values = [
    {
      icon: Nature,
      title: 'Écologique',
      description: 'Culture biologique respectueuse de l\'environnement',
    },
    {
      icon: HealthAndSafety,
      title: 'Qualité',
      description: 'Tests rigoureux et contrôles qualité à chaque étape',
    },
    {
      icon: Verified,
      title: 'Transparence',
      description: 'Traçabilité complète de nos produits',
    },
    {
      icon: LocalFlorist,
      title: 'Naturel',
      description: 'Extraction pure sans additifs chimiques',
    },
    {
      icon: Science,
      title: 'Innovation',
      description: 'Méthodes d\'extraction de pointe',
    },
    {
      icon: Group,
      title: 'Communauté',
      description: 'Accompagnement personnalisé de nos clients',
    },
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Fondatrice & CEO',
      description: 'Passionnée de bien-être naturel depuis 15 ans',
      avatar: 'M',
    },
    {
      name: 'Pierre Martin',
      role: 'Responsable Production',
      description: 'Expert en cultivation de chanvre biologique',
      avatar: 'P',
    },
    {
      name: 'Sophie Laurent',
      role: 'Responsable Qualité',
      description: 'Docteur en pharmacologie, 10 ans d\'expérience',
      avatar: 'S',
    },
  ];

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
            À Propos de CBD Nature
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6 }}
          >
            Votre partenaire de confiance pour un bien-être naturel
          </Typography>
        </Box>
      </motion.div>

      {/* Notre Histoire */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Paper sx={{ p: 6, mb: 8, background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Notre Histoire
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Fondée en 2019 par Marie Dubois, passionnée de phytothérapie, CBD Nature est née 
                d'une conviction profonde : offrir des produits CBD de qualité exceptionnelle, 
                cultivés dans le respect de la nature et des traditions françaises.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Basée dans le sud de la France, notre entreprise familiale travaille avec des 
                agriculteurs locaux pour cultiver le chanvre dans des conditions optimales, 
                sans pesticides ni produits chimiques.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                Aujourd'hui, nous sommes fiers de compter plus de 10 000 clients satisfaits 
                qui nous font confiance pour leur bien-être quotidien.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  background: 'linear-gradient(135deg, #E8F5E8, #C8E6C9)',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Nature sx={{ fontSize: '8rem', color: 'primary.main' }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Nos Valeurs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Nos Valeurs
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      },
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
                        <value.icon sx={{ fontSize: '2.5rem', color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        {value.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>

      {/* Notre Équipe */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Notre Équipe
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          mx: 'auto',
                          mb: 3,
                          fontSize: '2.5rem',
                          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{ mb: 1, fontWeight: 600 }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        sx={{ mb: 2, fontWeight: 500 }}
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>

      {/* Notre Engagement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #2E3440 0%, #3B4252 100%)', color: 'white' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 300,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2))',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HealthAndSafety sx={{ fontSize: '6rem', color: 'primary.main' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Notre Engagement
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Chez CBD Nature, nous nous engageons à vous fournir des produits de la plus haute qualité, 
                testés en laboratoire et conformes à la réglementation française.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Chaque produit est accompagné de son certificat d'analyse, garantissant sa pureté et 
                sa concentration en CBD. Nous croyons en la transparence totale avec nos clients.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                Notre mission : démocratiser l'accès au CBD de qualité pour améliorer votre bien-être 
                au quotidien, naturellement et en toute sécurité.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AboutPage;