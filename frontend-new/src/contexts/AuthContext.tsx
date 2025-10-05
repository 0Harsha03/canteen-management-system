import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData, APIResponse } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const userData: APIResponse<User> = response.data;
          if (userData.success && userData.data) {
            setUser(userData.data);
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const loginData: APIResponse<{ token: string; user: User }> = response.data;
      
      if (loginData.success && loginData.data) {
        const { token, user: userData } = loginData.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error(loginData.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      );
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      const registerData: APIResponse<{ token: string; user: User }> = response.data;
      
      if (registerData.success && registerData.data) {
        const { token, user: newUser } = registerData.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error(registerData.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed'
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Call logout API endpoint
    authAPI.logout().catch(console.error);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
