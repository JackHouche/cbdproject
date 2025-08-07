import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

const NotFoundPage = () => (
  <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
    <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
      404
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      Oups, cette page n'existe pas.
    </Typography>
    <Box>
      <Button
        variant="contained"
        startIcon={<Home />}
        component={RouterLink}
        to="/"
      >
        Retour à l'accueil
      </Button>
    </Box>
  </Container>
);

export default NotFoundPage;
