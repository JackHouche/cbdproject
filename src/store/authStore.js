import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Mot de passe admin simple (en production, utilisez une vraie base de données avec bcrypt)
const ADMIN_PASSWORD = 'admin123';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // Actions Admin
      loginAdmin: async (password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Vérification du mot de passe (simple pour la démo)
          const isValid = password === ADMIN_PASSWORD;
          
          if (isValid) {
            const adminUser = {
              id: 'admin',
              email: 'admin@iocbd.fr',
              role: 'admin',
              name: 'Administrateur IØCBD',
              loginTime: new Date().toISOString(),
            };

            // Créer un token de session
            const token = btoa(JSON.stringify({ 
              userId: adminUser.id, 
              timestamp: Date.now(),
              expires: Date.now() + (24 * 60 * 60 * 1000) // 24h
            }));

            // Stocker le token dans les cookies
            Cookies.set('admin_token', token, { expires: 1 }); // 1 jour

            set({ 
              isAuthenticated: true, 
              user: adminUser, 
              isLoading: false,
              error: null 
            });

            return { success: true };
          } else {
            set({ 
              error: 'Mot de passe incorrect', 
              isLoading: false 
            });
            return { success: false, error: 'Mot de passe incorrect' };
          }
        } catch (error) {
          set({ 
            error: 'Erreur de connexion', 
            isLoading: false 
          });
          return { success: false, error: 'Erreur de connexion' };
        }
      },

      // Connexion client (simulation)
      loginCustomer: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulation de connexion client
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const customerUser = {
            id: 'customer_' + Date.now(),
            email,
            role: 'customer',
            name: email.split('@')[0],
            loginTime: new Date().toISOString(),
          };

          const token = btoa(JSON.stringify({ 
            userId: customerUser.id, 
            timestamp: Date.now(),
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
          }));

          Cookies.set('customer_token', token, { expires: 7 });

          set({ 
            isAuthenticated: true, 
            user: customerUser, 
            isLoading: false,
            error: null 
          });

          return { success: true };
        } catch (error) {
          set({ 
            error: 'Erreur de connexion', 
            isLoading: false 
          });
          return { success: false, error: 'Erreur de connexion' };
        }
      },

      // Déconnexion
      logout: () => {
        Cookies.remove('admin_token');
        Cookies.remove('customer_token');
        set({ 
          isAuthenticated: false, 
          user: null, 
          error: null 
        });
      },

      // Vérifier la session au démarrage
      checkAuth: () => {
        const adminToken = Cookies.get('admin_token');
        const customerToken = Cookies.get('customer_token');
        
        if (adminToken) {
          try {
            const tokenData = JSON.parse(atob(adminToken));
            if (tokenData.expires > Date.now()) {
              set({ 
                isAuthenticated: true, 
                user: {
                  id: 'admin',
                  email: 'admin@iocbd.fr',
                  role: 'admin',
                  name: 'Administrateur IØCBD',
                }
              });
              return true;
            }
          } catch (error) {
            console.error('Token admin invalide');
          }
        }
        
        if (customerToken) {
          try {
            const tokenData = JSON.parse(atob(customerToken));
            if (tokenData.expires > Date.now()) {
              // Récupérer les données client depuis le localStorage si disponible
              const userData = get().user;
              if (userData && userData.role === 'customer') {
                set({ isAuthenticated: true });
                return true;
              }
            }
          } catch (error) {
            console.error('Token client invalide');
          }
        }
        
        return false;
      },

      // Utilitaires
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isCustomer: () => {
        const { user } = get();
        return user?.role === 'customer';
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
);

export default useAuthStore;