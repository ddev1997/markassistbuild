import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
  credits: number;
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  credits: number;
  isOutOfCredits: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<{ credits: number }>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
  fetchCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'https://my-fastapi-service-608954479960.us-central1.run.app';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [isOutOfCredits, setIsOutOfCredits] = useState(false);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Request failed');
    }

    return response.json();
  };

  const login = async (username: string, password: string) => {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    await verifyAuth();
    return data;
  };

  const register = async (username: string, password: string, email: string) => {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
    return data;
  };

  const logout = async () => {
    await apiRequest('/logout', { method: 'POST' });
    setUser(null);
  };

  const fetchCredits = async () => {
    try {
      const response = await apiRequest('/find_credit', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setCredits(response.credit);
      setIsOutOfCredits(response.credit <= 0);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const verifyAuth = async () => {
    try {
      const userData = await apiRequest('/auth/verify');
      setUser(userData);
      await fetchCredits();
    } catch (error) {
      setUser(null);
      setCredits(0);
      setIsOutOfCredits(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, credits, isOutOfCredits, login, register, logout, verifyAuth, fetchCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};