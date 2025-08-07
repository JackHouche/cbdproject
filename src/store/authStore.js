import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import supabase, { DB_TABLES, authService } from '../lib/supabase';

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
      loginAdmin: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await authService.verifyAdminCredentials(email, password);

          if (error || !data) {
            set({ error: 'Identifiants incorrects', isLoading: false, isInitialized: true });
            return { success: false, error: 'Identifiants incorrects' };
          }

          const adminUser = {
            id: data.id || 'admin',
            email: data.email,
            role: 'admin',
            name: 'Administrateur IØCBD',
            loginTime: new Date().toISOString(),
          };

          const token = btoa(JSON.stringify({
            userId: adminUser.id,
            timestamp: Date.now(),
            expires: Date.now() + 24 * 60 * 60 * 1000,
          }));

          Cookies.set('admin_token', token, { expires: 1 });

          set({
            isAuthenticated: true,
            user: adminUser,
            isLoading: false,
            error: null,
            isInitialized: true,
          });

          return { success: true };
        } catch (error) {
          set({
            error: 'Erreur de connexion',
            isLoading: false,
            isInitialized: true,
          });
          return { success: false, error: 'Erreur de connexion' };
        }
      },

      // Connexion client via Supabase
      loginCustomer: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          if (error || !data.user) {
            throw error;
          }

          const customerUser = {
            id: data.user.id,
            email: data.user.email,
            role: 'customer',
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
            loginTime: new Date().toISOString(),
          };

          set({
            isAuthenticated: true,
            user: customerUser,
            isLoading: false,
            error: null,
            isInitialized: true,
          });

          return { success: true };
        } catch (error) {
          set({
            error: 'Erreur de connexion',
            isLoading: false,
            isInitialized: true,
          });
          return { success: false, error: 'Erreur de connexion' };
        }
      },

      // Inscription client via Supabase
      registerCustomer: async (email, password, firstName, lastName) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error || !data.user) {
            throw error;
          }

          await supabase.from(DB_TABLES.CUSTOMERS).insert([{ id: data.user.id, email, first_name: firstName, last_name: lastName }]);

          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Déconnexion
      logout: async () => {
        Cookies.remove('admin_token');
        await supabase.auth.signOut();
        set({
          isAuthenticated: false,
          user: null,
          error: null,
          isInitialized: true,
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

          if (adminToken) {
            try {
              const tokenData = JSON.parse(atob(adminToken));
              if (tokenData.expires > Date.now()) {
                const adminUser = {
                  id: tokenData.userId,
                  email: 'admin@iocbd.com',
                  role: 'admin',
                  name: 'Administrateur IØCBD',
                };

                set({
                  isAuthenticated: true,
                  user: adminUser,
                  isLoading: false,
                  isInitialized: true,
                });
                return true;
              }
              Cookies.remove('admin_token');
            } catch (error) {
              console.error('Token admin invalide:', error);
              Cookies.remove('admin_token');
            }
          }

          const { data } = await supabase.auth.getSession();
          const sessionUser = data.session?.user;
          if (sessionUser) {
            const customerUser = {
              id: sessionUser.id,
              email: sessionUser.email,
              role: 'customer',
              name: sessionUser.user_metadata?.name || sessionUser.email.split('@')[0],
            };

            set({
              isAuthenticated: true,
              user: customerUser,
              isLoading: false,
              isInitialized: true,
            });
            return true;
          }

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            isInitialized: true,
          });
          return false;
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: 'Erreur de vérification',
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
