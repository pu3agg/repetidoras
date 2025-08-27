import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, Log } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (indicative: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.indicative === indicative && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Log the login
      const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({
        action: 'login',
        user: indicative,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('logs', JSON.stringify(logs));
      
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'password'> & { password: string; confirmPassword: string }): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.indicative === userData.indicative || u.email === userData.email)) {
      return false;
    }

    if (userData.password !== userData.confirmPassword) {
      return false;
    }

    const newUser: User = {
      indicative: userData.indicative,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log the registration
    const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push({
      action: 'register',
      user: userData.indicative,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('logs', JSON.stringify(logs));

    return true;
  };

  const logout = () => {
    if (currentUser) {
      // Log the logout
      const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({
        action: 'logout',
        user: currentUser.indicative,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('logs', JSON.stringify(logs));
    }

    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};