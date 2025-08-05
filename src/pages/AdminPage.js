import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
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
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  ShoppingCart,
  People,
  Euro,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Huile CBD 10%',
      category: 'huiles',
      price: 49.90,
      stock: 23,
      sold: 127,
      status: 'active',
    },
    {
      id: 2,
      name: 'Fleurs CBD Amnesia',
      category: 'fleurs',
      price: 8.90,
      stock: 45,
      sold: 89,
      status: 'active',
    },
    {
      id: 3,
      name: 'Tisane Relaxante',
      category: 'tisanes',
      price: 15.90,
      stock: 0,
      sold: 156,
      status: 'outofstock',
    },
  ]);

  const stats = [
    {
      title: 'Ventes totales',
      value: '€12,450',
      icon: Euro,
      color: 'success.main',
      change: '+12%',
    },
    {
      title: 'Commandes',
      value: '284',
      icon: ShoppingCart,
      color: 'primary.main',
      change: '+8%',
    },
    {
      title: 'Clients',
      value: '1,023',
      icon: People,
      color: 'info.main',
      change: '+15%',
    },
    {
      title: 'Conversion',
      value: '2.4%',
      icon: TrendingUp,
      color: 'warning.main',
      change: '+0.3%',
    },
  ];

  const categories = [
    { value: 'huiles', label: 'Huiles CBD' },
    { value: 'fleurs', label: 'Fleurs CBD' },
    { value: 'tisanes', label: 'Tisanes' },
    { value: 'resines', label: 'Résines' },
    { value: 'cosmetiques', label: 'Cosmétiques' },
  ];

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      status: parseInt(formData.stock) > 0 ? 'active' : 'outofstock',
    };

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData }
          : p
      ));
      toast.success('Produit modifié avec succès');
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...productData,
        sold: 0,
      };
      setProducts([...products, newProduct]);
      toast.success('Produit ajouté avec succès');
    }

    handleCloseDialog();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produit supprimé');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'outofstock':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'outofstock':
        return 'Rupture';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Administration
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestion des produits et statistiques
          </Typography>
        </Box>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        {stat.change} ce mois
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Gestion des produits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Gestion des produits
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #689F38)',
                },
              }}
            >
              Ajouter un produit
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Vendus</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {categories.find(c => c.value === product.category)?.label || product.category}
                    </TableCell>
                    <TableCell>{product.price}€</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(product.status)}
                        color={getStatusColor(product.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(product)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Dialog d'ajout/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du produit"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={formData.category}
                  label="Catégorie"
                  onChange={handleInputChange('category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix (€)"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange('stock')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange('description')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C, #689F38)',
              },
            }}
          >
            {editingProduct ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;