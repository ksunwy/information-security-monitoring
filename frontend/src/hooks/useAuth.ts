import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';
import { getMe, login, register, type AuthResponse, } from '../api/authApi';

interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (credentials: { login: string; password: string }) => Promise<void>;
  register: (data: { email: string; login: string; name: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials) => {
    const { user, token } = await login(credentials);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  register: async (data) => {
    const { user, token } = await register(data);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  fetchMe: async () => {
    try {
      const user = await getMe();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (e: any) {
      if (e.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  const loginMutation = useMutation({
    mutationFn: store.login,
  });

  const registerMutation = useMutation({
    mutationFn: store.register,
  });

  return {
    ...store,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    answer: registerMutation
  };
};