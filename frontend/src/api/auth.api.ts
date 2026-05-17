import api from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};
