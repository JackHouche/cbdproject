import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import useAuthStore from '../store/authStore';
import Cookies from 'js-cookie';

const AuthDebug = () => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error, 
    isInitialized, 
    checkAuth, 
    logout,
    resetInitialization 
  } = useAuthStore();

  const handleClearCookies = () => {
    Cookies.remove('admin_token');
    Cookies.remove('customer_token');
    localStorage.removeItem('auth-storage');
    window.location.reload();
  };

  const handleForceCheck = async () => {
    resetInitialization();
    await checkAuth();
  };

  return (
    <Paper sx={{ p: 3, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Debug Authentification
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography><strong>isAuthenticated:</strong> {isAuthenticated ? '✅' : '❌'}</Typography>
        <Typography><strong>isInitialized:</strong> {isInitialized ? '✅' : '❌'}</Typography>
        <Typography><strong>isLoading:</strong> {isLoading ? '⏳' : '✅'}</Typography>
        <Typography><strong>error:</strong> {error || 'Aucune'}</Typography>
        <Typography><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Cookies:</Typography>
        <Typography variant="body2">
          <strong>admin_token:</strong> {Cookies.get('admin_token') ? '✅ Présent' : '❌ Absent'}
        </Typography>
        <Typography variant="body2">
          <strong>customer_token:</strong> {Cookies.get('customer_token') ? '✅ Présent' : '❌ Absent'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>LocalStorage:</Typography>
        <Typography variant="body2">
          <strong>auth-storage:</strong> {localStorage.getItem('auth-storage') ? '✅ Présent' : '❌ Absent'}
        </Typography>
        {localStorage.getItem('auth-storage') && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
            {localStorage.getItem('auth-storage')}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="outlined" size="small" onClick={handleForceCheck}>
          Forcer vérification
        </Button>
        <Button variant="outlined" size="small" onClick={logout}>
          Logout
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={handleClearCookies}>
          Nettoyer tout
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthDebug;