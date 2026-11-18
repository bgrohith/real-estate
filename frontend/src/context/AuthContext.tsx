import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string; resetTokenPreview?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sapphireiq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Load user data on app mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('sapphireiq_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/users/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Authentication token check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('sapphireiq_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return { success: false, error: res.data.error || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => {
    try {
      const res = await api.post('/api/auth/register', data);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('sapphireiq_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return { success: false, error: res.data.error || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('sapphireiq_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.put('/api/users/me', data);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return {
        success: true,
        message: res.data.message,
        resetTokenPreview: res.data.resetTokenPreview,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to send password reset email',
      };
    }
  };

  const resetPassword = async (resetToken: string, password: string) => {
    try {
      const res = await api.put(`/api/auth/reset-password/${resetToken}`, { password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('sapphireiq_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Password reset failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
