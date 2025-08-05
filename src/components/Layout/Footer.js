import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Twitter, url: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Produits', path: '/produits' },
    { label: 'À Propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { label: 'Mentions Légales', path: '/mentions-legales' },
    { label: 'Politique de Confidentialité', path: '/confidentialite' },
    { label: 'CGV', path: '/cgv' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2E3440 0%, #3B4252 100%)',
        color: 'white',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et Description */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src="/logo-iocbd.png"
                  alt="IØCBD Logo"
                  sx={{
                    height: '35px',
                    width: 'auto',
                    mr: 1,
                    filter: 'brightness(1.1)',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Dancing Script", cursive',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  IØCBD
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, lineHeight: 1.6 }}>
                Votre boutique française de CBD premium IØCBD. Produits naturels et de qualité 
                supérieure pour votre bien-être quotidien. Cultivé avec passion, livré avec soin.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.url}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <social.icon />
                  </IconButton>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Liens Rapides */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Navigation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickLinks.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    to={link.path}
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Légal */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Légal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {legalLinks.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    to={link.path}
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    contact@cbdnature.fr
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +33 1 23 45 67 89
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    123 Rue de la Nature, 75001 Paris
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} CBD Nature. Tous droits réservés. 
              Produits destinés aux adultes de plus de 18 ans.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
              ⚠️ Le CBD n'est pas un médicament et ne peut se substituer à un traitement médical.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;