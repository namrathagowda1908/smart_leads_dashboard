import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/auth.api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const getUserFromStorage = (): User | null => {
  const raw = localStorage.getItem('smart_leads_user');
  return raw ? JSON.parse(raw) as User : null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smart_leads_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('smart_leads_token', token);
    } else {
      localStorage.removeItem('smart_leads_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_leads_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_leads_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const data = await loginRequest({ email, password });
    setUser(data.data.user);
    setToken(data.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
