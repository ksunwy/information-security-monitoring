import api from '../lib/api';

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  login: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    login: string;
    name: string;
    role: string;
  };
  token: string;
}

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getMe = async (): Promise<AuthResponse['user']> => {
  const res = await api.get('/users/me');
  return res.data;
};