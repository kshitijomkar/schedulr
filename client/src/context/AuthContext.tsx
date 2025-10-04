// client/src/context/AuthContext.tsx

'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Scheduler';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      axios.get<{ data: User }>(`${API_URL}/api/auth/me`)
        .then(response => { setUser(response.data.data); })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => { setIsLoading(false); });
    } else {
      setIsLoading(false);
    }
  }, [API_URL]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token: responseToken, data: userData } = response.data;
      
      setToken(responseToken);
      setUser(userData);
      localStorage.setItem('token', responseToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed.';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      const { token: responseToken, data: userData } = response.data;

      setToken(responseToken);
      setUser(userData);
      localStorage.setItem('token', responseToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;