import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { isAuthenticated, user, checkAuth, isInitialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isInitialized) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    initializeAuth();
  }, [checkAuth, isInitialized]);

  // Écran de chargement pendant la vérification initiale
  if (isChecking || !isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" color="text.secondary">
          Vérification de l'authentification...
        </Typography>
      </Box>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/mon-compte" replace />;
  }

  // Vérification du rôle si spécifié
  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'admin' && requiredRole === 'customer') {
      // Un admin essaie d'accéder à l'espace client, rediriger vers admin
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'customer' && requiredRole === 'admin') {
      // Un client essaie d'accéder à l'admin, rediriger vers accueil
      return <Navigate to="/" replace />;
    }
    // Rôle non autorisé
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;