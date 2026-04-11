'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = () => {
    setUser({
      name: 'Alex Traveler',
      email: 'alex@example.com',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
