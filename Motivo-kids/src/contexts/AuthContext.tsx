import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginRequest, verifyOtpRequest, signupRequest, fetchCurrentUserProfile } from '../api';

interface User {
  name: string;
  email: string;
  profile_pic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!user;

  const signup = async (data: { firstName: string; lastName: string; email: string }) => {
    setIsLoading(true);
    try {
      await signupRequest(data);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      await loginRequest(email);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await verifyOtpRequest(email, otp);
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);

      const loggedUser: User = { name: email, email, profile_pic: '/assets/default-avatar.png' };
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await fetchCurrentUserProfile();
      const updatedUser: User = {
        name: profile.fname && profile.lname ? `${profile.fname} ${profile.lname}` : profile.email,
        email: profile.email,
        profile_pic: profile.profile_image || '/assets/default-avatar.png',
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Load user from localStorage and fetch latest profile on mount
  useEffect(() => {
    const initUser = async () => {
      const saved = localStorage.getItem('user');
      if (saved) setUser(JSON.parse(saved));

      try {
        const profile = await fetchCurrentUserProfile();
        const updatedUser: User = {
          name: profile.fname && profile.lname ? `${profile.fname} ${profile.lname}` : profile.email,
          email: profile.email,
          profile_pic: profile.profile_image || '/assets/default-avatar.png',
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    initUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, signup, sendOtp, verifyOtp, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
