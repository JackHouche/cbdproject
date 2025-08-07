import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useOrdersStore = create(
  persist(
    (set, get) => ({
      // État
      orders: [
        {
          id: 'ORDER_2024_001',
          customerInfo: {
            email: 'client@example.com',
            firstName: 'Jean',
            lastName: 'Dupont',
            phone: '+33 6 12 34 56 78',
            address: {
              street: '123 Rue de la Paix',
              city: 'Paris',
              postalCode: '75001',
              country: 'France'
            }
          },
          items: [
            {
              productId: '1',
              name: 'Huile CBD 10%',
              price: 49.99,
              quantity: 2,
              total: 99.98
            }
          ],
          pricing: {
            subtotal: 99.98,
            shipping: 0,
            total: 99.98
          },
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          stripePaymentIntentId: 'pi_test_123456',
          shippingMethod: 'standard',
          trackingNumber: 'FR123456789',
          notes: '',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      isLoading: false,
      error: null,

      // Actions
      createOrder: (orderData) => {
        const newOrder = {
          id: `ORDER_${new Date().getFullYear()}_${String(Date.now()).slice(-6)}`,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...orderData,
        };

        set(state => ({
          orders: [newOrder, ...state.orders]
        }));

        return newOrder;
      },

      updateOrder: (orderId, updates) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        }));

        return get().orders.find(order => order.id === orderId);
      },

      updateOrderStatus: (orderId, status) => {
        const statusUpdate = {
          status,
          updatedAt: new Date().toISOString(),
        };

        // Ajouter des timestamps spécifiques selon le statut
        if (status === 'confirmed') {
          statusUpdate.confirmedAt = new Date().toISOString();
        } else if (status === 'shipped') {
          statusUpdate.shippedAt = new Date().toISOString();
        } else if (status === 'delivered') {
          statusUpdate.deliveredAt = new Date().toISOString();
        } else if (status === 'cancelled') {
          statusUpdate.cancelledAt = new Date().toISOString();
        }

        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, ...statusUpdate }
              : order
          )
        }));
      },

      updatePaymentStatus: (orderId, paymentStatus, paymentIntentId = null) => {
        const update = {
          paymentStatus,
          updatedAt: new Date().toISOString(),
        };

        if (paymentIntentId) {
          update.stripePaymentIntentId = paymentIntentId;
        }

        if (paymentStatus === 'paid') {
          update.paidAt = new Date().toISOString();
        }

        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, ...update }
              : order
          )
        }));
      },

      addTrackingNumber: (orderId, trackingNumber) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { 
                  ...order, 
                  trackingNumber,
                  status: order.status === 'confirmed' ? 'shipped' : order.status,
                  shippedAt: order.status === 'confirmed' ? new Date().toISOString() : order.shippedAt,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        }));
      },

      deleteOrder: (orderId) => {
        set(state => ({
          orders: state.orders.filter(order => order.id !== orderId)
        }));
      },

      // Getters
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },

      getOrdersByCustomer: (customerEmail) => {
        return get().orders.filter(order => 
          order.customerInfo.email === customerEmail
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
      },

      getOrdersByPaymentStatus: (paymentStatus) => {
        return get().orders.filter(order => order.paymentStatus === paymentStatus);
      },

      // Statistiques
      getOrderStats: () => {
        const orders = get().orders;
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const thisMonthOrders = orders.filter(order => 
          new Date(order.createdAt) >= thisMonth
        );

        const lastMonthOrders = orders.filter(order => 
          new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) < thisMonth
        );

        return {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
          shippedOrders: orders.filter(o => o.status === 'shipped').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
          paidOrders: orders.filter(o => o.paymentStatus === 'paid').length,
          unpaidOrders: orders.filter(o => o.paymentStatus === 'pending').length,
          totalRevenue: orders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
          thisMonthRevenue: thisMonthOrders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
          lastMonthRevenue: lastMonthOrders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
          thisMonthOrders: thisMonthOrders.length,
          lastMonthOrders: lastMonthOrders.length,
          averageOrderValue: orders.length > 0
            ? orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0) / orders.length
            : 0,
        };
      },

      // Recherche et filtres
      searchOrders: (query) => {
        const searchTerm = query.toLowerCase();
        return get().orders.filter(order =>
          order.id.toLowerCase().includes(searchTerm) ||
          order.customerInfo.email.toLowerCase().includes(searchTerm) ||
          order.customerInfo.firstName.toLowerCase().includes(searchTerm) ||
          order.customerInfo.lastName.toLowerCase().includes(searchTerm) ||
          (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm))
        );
      },

      getRecentOrders: (limit = 10) => {
        return get().orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
      },

      // Utilitaires
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Méthodes utilitaires pour les statuts
      getStatusLabel: (status) => {
        const statusLabels = {
          pending: 'En attente',
          confirmed: 'Confirmée',
          shipped: 'Expédiée',
          delivered: 'Livrée',
          cancelled: 'Annulée',
        };
        return statusLabels[status] || status;
      },

      getPaymentStatusLabel: (paymentStatus) => {
        const statusLabels = {
          pending: 'En attente',
          paid: 'Payée',
          failed: 'Échouée',
          refunded: 'Remboursée',
        };
        return statusLabels[paymentStatus] || paymentStatus;
      },

      getStatusColor: (status) => {
        const statusColors = {
          pending: 'warning',
          confirmed: 'info',
          shipped: 'primary',
          delivered: 'success',
          cancelled: 'error',
        };
        return statusColors[status] || 'default';
      },

      getPaymentStatusColor: (paymentStatus) => {
        const statusColors = {
          pending: 'warning',
          paid: 'success',
          failed: 'error',
          refunded: 'info',
        };
        return statusColors[paymentStatus] || 'default';
      },
    }),
    {
      name: 'orders-storage',
      version: 1,
    }
  )
);

export default useOrdersStore;