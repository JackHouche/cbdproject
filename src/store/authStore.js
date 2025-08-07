import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Mot de passe admin défini via les variables d'environnement
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false, // Nouveau flag pour savoir si l'auth a été vérifiée

      // Actions Admin
      loginAdmin: async (password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Vérification du mot de passe (simple pour la démo)
          const isValid = password === ADMIN_PASSWORD;
          
          if (isValid) {
            const adminUser = {
              id: 'admin',
              email: 'admin@iocbd.com',
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
              error: null,
              isInitialized: true
            });

            return { success: true };
          } else {
            set({ 
              error: 'Mot de passe incorrect', 
              isLoading: false,
              isInitialized: true
            });
            return { success: false, error: 'Mot de passe incorrect' };
          }
        } catch (error) {
          set({ 
            error: 'Erreur de connexion', 
            isLoading: false,
            isInitialized: true
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
            error: null,
            isInitialized: true
          });

          return { success: true };
        } catch (error) {
          set({ 
            error: 'Erreur de connexion', 
            isLoading: false,
            isInitialized: true
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
          error: null,
          isInitialized: true
        });
      },

      // Vérifier la session au démarrage (appelé une seule fois)
      checkAuth: async () => {
        const state = get();
        
        // Éviter de vérifier plusieurs fois
        if (state.isInitialized) {
          return state.isAuthenticated;
        }

        set({ isLoading: true });

        try {
          const adminToken = Cookies.get('admin_token');
          const customerToken = Cookies.get('customer_token');
          
          if (adminToken) {
            try {
              const tokenData = JSON.parse(atob(adminToken));
              if (tokenData.expires > Date.now()) {
                const adminUser = {
                  id: 'admin',
                  email: 'admin@iocbd.com',
                  role: 'admin',
                  name: 'Administrateur IØCBD',
                };
                
                set({ 
                  isAuthenticated: true, 
                  user: adminUser,
                  isLoading: false,
                  isInitialized: true
                });
                return true;
              } else {
                // Token expiré
                Cookies.remove('admin_token');
              }
            } catch (error) {
              console.error('Token admin invalide:', error);
              Cookies.remove('admin_token');
            }
          }
          
          if (customerToken) {
            try {
              const tokenData = JSON.parse(atob(customerToken));
              if (tokenData.expires > Date.now()) {
                // Récupérer les données client depuis le localStorage si disponible
                const userData = state.user;
                if (userData && userData.role === 'customer') {
                  set({ 
                    isAuthenticated: true,
                    isLoading: false,
                    isInitialized: true
                  });
                  return true;
                } else {
                  // Créer un utilisateur par défaut si pas de données
                  const customerUser = {
                    id: tokenData.userId,
                    email: 'client@example.com',
                    role: 'customer',
                    name: 'Client',
                  };
                  
                  set({ 
                    isAuthenticated: true, 
                    user: customerUser,
                    isLoading: false,
                    isInitialized: true
                  });
                  return true;
                }
              } else {
                // Token expiré
                Cookies.remove('customer_token');
              }
            } catch (error) {
              console.error('Token client invalide:', error);
              Cookies.remove('customer_token');
            }
          }
          
          // Aucun token valide trouvé
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false,
            isInitialized: true
          });
          return false;
          
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false,
            isInitialized: true,
            error: 'Erreur de vérification'
          });
          return false;
        }
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
      
      // Reset de l'état d'initialisation (pour forcer une nouvelle vérification)
      resetInitialization: () => set({ isInitialized: false }),
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