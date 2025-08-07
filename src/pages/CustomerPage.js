import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Tabs,
  Tab,
  Alert,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Link,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Login,
  Logout,
  LocalShipping,
  CheckCircle,
  Schedule,
  Receipt,
  Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useOrdersStore from '../store/ordersStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const LoginTab = ({ loginForm, setLoginForm, handleLogin }) => (
  <Box sx={{ maxWidth: 400, mx: 'auto' }}>
    <Paper sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Person sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          Connexion Client
        </Typography>
        <Typography color="text.secondary">
          Accédez à votre espace personnel
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          fullWidth
          type="email"
          label="Adresse email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Mot de passe"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          sx={{ mb: 3 }}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Login />}
        >
          Se connecter
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Pas encore de compte ?{' '}
          <Link component={RouterLink} to="/inscription">
            Créer un compte
          </Link>
        </Typography>
      </Box>
    </Paper>
  </Box>
);

const CustomerPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const navigate = useNavigate();
  const { isAuthenticated, user, loginCustomer, logout, isCustomer } = useAuthStore();
  const {
    getOrdersByCustomer,
    getStatusLabel,
    getStatusColor,
    getPaymentStatusLabel,
    getPaymentStatusColor,
  } = useOrdersStore();

  const customerOrders = isAuthenticated && user 
    ? getOrdersByCustomer(user.email) 
    : [];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const result = await loginCustomer(loginForm.email, loginForm.password);
    if (result.success) {
      toast.success('Connexion réussie !');
    } else {
      toast.error(result.error || 'Erreur de connexion');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab(0);
    toast.success('Déconnexion réussie');
  };

  const getOrderStatusSteps = (order) => {
    const statuses = [
      { key: 'pending', label: 'Commande reçue', date: order.createdAt, icon: <Schedule /> },
      { key: 'confirmed', label: 'Commande confirmée', date: order.confirmedAt, icon: <Receipt /> },
      { key: 'shipped', label: 'Expédiée', date: order.shippedAt, icon: <LocalShipping /> },
      { key: 'delivered', label: 'Livrée', date: order.deliveredAt, icon: <CheckCircle /> },
    ];

    const currentStepIndex = statuses.findIndex(s => s.key === order.status);

    return statuses.map((status, index) => {
      const isCompleted = index <= currentStepIndex;
      const isCurrent = index === currentStepIndex;

      return (
        <Step key={status.key} completed={isCompleted && !isCurrent} active={isCurrent}>
          <StepLabel
            icon={status.icon}
            StepIconProps={{
              style: {
                color: isCompleted || isCurrent ? '#4CAF50' : '#ccc',
              },
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                {status.label}
              </Typography>
              {status.date && (
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(status.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </Typography>
              )}
            </Box>
          </StepLabel>
        </Step>
      );
    });
  };

  // Orders Tab
  const OrdersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Mes commandes</Typography>
        <Typography variant="body2" color="text.secondary">
          {customerOrders.length} commande(s)
        </Typography>
      </Box>

      {customerOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Aucune commande trouvée
          </Typography>
          <Button variant="contained" onClick={() => navigate('/produits')}>
            Découvrir nos produits
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {customerOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Commande #{order.id}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr })}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                        <Chip
                          label={getPaymentStatusLabel(order.paymentStatus)}
                          color={getPaymentStatusColor(order.paymentStatus)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">
                        {order.pricing.total.toFixed(2)}€
                      </Typography>
                      <IconButton
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Articles ({order.items.length})
                    </Typography>
                    {order.items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">
                          {item.name} x{item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          {item.total.toFixed(2)}€
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Numéro de suivi :</strong> {order.trackingNumber}
                      </Typography>
                    </Alert>
                  )}

                  {/* Order Details */}
                  {selectedOrder?.id === order.id && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 3 }} />
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Suivi de la commande
                          </Typography>
                          <Stepper orientation="vertical">
                            {getOrderStatusSteps(order)}
                          </Stepper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Adresse de livraison
                          </Typography>
                          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                            <Typography variant="body2">
                              {order.customerInfo.firstName} {order.customerInfo.lastName}
                            </Typography>
                            <Typography variant="body2">
                              {order.customerInfo.address.street}
                            </Typography>
                            <Typography variant="body2">
                              {order.customerInfo.address.postalCode} {order.customerInfo.address.city}
                            </Typography>
                            <Typography variant="body2">
                              {order.customerInfo.address.country}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Profile Tab
  const ProfileTab = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Mon profil
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={user?.name || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Connecté depuis : {user?.loginTime && format(new Date(user.loginTime), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  if (!isAuthenticated || !isCustomer()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LoginTab
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            handleLogin={handleLogin}
          />
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>
          Mon espace client
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Bienvenue, {user?.name}
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<ShoppingBag />} label="Mes commandes" />
          <Tab icon={<Person />} label="Mon profil" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 0 && <OrdersTab />}
        {activeTab === 1 && <ProfileTab />}
      </motion.div>
    </Container>
  );
};

export default CustomerPage;