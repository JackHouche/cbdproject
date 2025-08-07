import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import AuthDebug from '../components/AuthDebug';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { loginAdmin, isLoading, error, clearError, isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      await checkAuth();
      if (isAuthenticated && user?.role === 'admin') {
        navigate('/admin');
      }
    };
    
    checkIfAlreadyLoggedIn();
  }, [isAuthenticated, user, navigate, checkAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Veuillez saisir le mot de passe');
      return;
    }

    clearError();
    
    const result = await loginAdmin(password);
    
    if (result.success) {
      toast.success('Connexion réussie !');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Erreur de connexion');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                mb: 2,
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              }}
            >
              <AdminPanelSettings sx={{ fontSize: '2.5rem', color: 'white' }} />
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Administration IØCBD
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Accès sécurisé au panel d'administration
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe administrateur"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Panel d'administration sécurisé IØCBD
            </Typography>
          </Box>
        </Paper>
        
        {/* Debug Component - activé uniquement en développement */}
        {process.env.REACT_APP_DEBUG_AUTH === 'true' && <AuthDebug />}
      </motion.div>
    </Container>
  );
};

export default AdminLoginPage;