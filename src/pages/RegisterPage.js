import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link
} from '@mui/material';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { registerCustomer, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const result = await registerCustomer(form.email, form.password, form.firstName, form.lastName);
    if (result.success) {
      toast.success('Inscription réussie, vous pouvez vous connecter');
      navigate('/mon-compte');
    } else {
      toast.error(result.error || "Erreur d'inscription");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Créer un compte
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Prénom"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nom"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={{ mb: 3 }}
            required
          />
          <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
            S'inscrire
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Déjà un compte ?{' '}
            <Link component={RouterLink} to="/mon-compte">
              Se connecter
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
