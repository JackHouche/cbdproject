import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Dashboard as DashboardIcon,
  Inventory,
  ShoppingCart,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Visibility,
  ToggleOn,
  ToggleOff,
  Star,
  MonetizationOn,
  People,
  LocalShipping,
  Logout,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useProductsStore from '../store/productsStore';
import useOrdersStore from '../store/ordersStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    longDescription: '',
    category: 'huiles',
    price: '',
    originalPrice: '',
    stock: '',
    benefits: '',
    usageInstructions: '',
    precautions: '',
  });

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    toggleFeatured,
    togglePromo,
    getStats,
  } = useProductsStore();

  const {
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    getOrderStats,
    getStatusLabel,
    getStatusColor,
    getPaymentStatusLabel,
    getPaymentStatusColor,
  } = useOrdersStore();

  const productStats = getStats();
  const orderStats = getOrderStats();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  // Product management functions
  const openProductDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || '',
        category: product.category,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        stock: product.stock.toString(),
        benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : '',
        usageInstructions: product.usageInstructions || '',
        precautions: product.precautions || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        longDescription: '',
        category: 'huiles',
        price: '',
        originalPrice: '',
        stock: '',
        benefits: '',
        usageInstructions: '',
        precautions: '',
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.stock) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      longDescription: productForm.longDescription,
      category: productForm.category,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      stock: parseInt(productForm.stock),
      benefits: productForm.benefits.split(',').map(b => b.trim()).filter(b => b),
      usageInstructions: productForm.usageInstructions,
      precautions: productForm.precautions,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Produit mis à jour avec succès');
    } else {
      createProduct(productData);
      toast.success('Produit créé avec succès');
    }

    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(productId);
      toast.success('Produit supprimé avec succès');
    }
  };

  // Product columns for DataGrid
  const productColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'category', headerName: 'Catégorie', width: 120 },
    { 
      field: 'price', 
      headerName: 'Prix', 
      width: 100,
      renderCell: (params) => `${params.value}€`
    },
    { field: 'stock', headerName: 'Stock', width: 80 },
    {
      field: 'isActive',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Actif' : 'Inactif'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'isFeatured',
      headerName: 'Vedette',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => toggleFeatured(params.row.id)}
          color={params.value ? 'primary' : 'default'}
        >
          <Star />
        </IconButton>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => openProductDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => toggleProductStatus(params.row.id)}>
            {params.row.isActive ? <ToggleOff /> : <ToggleOn />}
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Order columns for DataGrid
  const orderColumns = [
    { field: 'id', headerName: 'Commande', width: 150 },
    { 
      field: 'customerName', 
      headerName: 'Client', 
      width: 200,
      valueGetter: (params) => `${params.row.customerInfo.firstName} ${params.row.customerInfo.lastName}`
    },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 100,
      valueGetter: (params) => `${params.row.pricing.total}€`
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Paiement',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getPaymentStatusLabel(params.value)}
          color={getPaymentStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 120,
      valueGetter: (params) => new Date(params.value).toLocaleDateString('fr-FR')
    },
  ];

  // Dashboard Tab
  const DashboardTab = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Inventory color="primary" sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h4">{productStats.totalProducts}</Typography>
                <Typography color="text.secondary">Produits</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShoppingCart color="primary" sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h4">{orderStats.totalOrders}</Typography>
                <Typography color="text.secondary">Commandes</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MonetizationOn color="primary" sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h4">{orderStats.totalRevenue.toFixed(2)}€</Typography>
                <Typography color="text.secondary">Chiffre d'affaires</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp color="primary" sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h4">{orderStats.averageOrderValue.toFixed(2)}€</Typography>
                <Typography color="text.secondary">Panier moyen</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Orders */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Commandes récentes</Typography>
            <DataGrid
              rows={orders.slice(0, 5)}
              columns={orderColumns}
              autoHeight
              hideFooter
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Products Tab
  const ProductsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion des produits</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openProductDialog()}
        >
          Ajouter un produit
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={products}
            columns={productColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );

  // Orders Tab
  const OrdersTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Gestion des commandes</Typography>
      
      <Card>
        <CardContent>
          <DataGrid
            rows={orders}
            columns={orderColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Administration IØCBD
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Bienvenue, {user?.name}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<Inventory />} label="Produits" />
          <Tab icon={<ShoppingCart />} label="Commandes" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 0 && <DashboardTab />}
        {activeTab === 1 && <ProductsTab />}
        {activeTab === 2 && <OrdersTab />}
      </motion.div>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onClose={() => setProductDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du produit *"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description courte *"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description détaillée"
                value={productForm.longDescription}
                onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Prix *"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                InputProps={{ endAdornment: '€' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Prix original"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                InputProps={{ endAdornment: '€' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Stock *"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bienfaits (séparés par des virgules)"
                value={productForm.benefits}
                onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Instructions d'utilisation"
                value={productForm.usageInstructions}
                onChange={(e) => setProductForm({ ...productForm, usageInstructions: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Précautions"
                value={productForm.precautions}
                onChange={(e) => setProductForm({ ...productForm, precautions: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleProductSubmit} variant="contained">
            {editingProduct ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;