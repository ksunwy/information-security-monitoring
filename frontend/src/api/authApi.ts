import api from '../lib/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

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