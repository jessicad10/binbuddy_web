"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSessionData, handleUpdateUserCookie, handleLogoutUser } from "@/lib/actions/auth-action";
import { whoami } from "@/lib/api/auth";

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (userData: any, tokenVal: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newUserData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load session from cookies on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await getSessionData();
        if (session.token && session.user) {
          setToken(session.token);
          setUser(session.user);
          
          // Refresh user data with latest from backend API /whoami
          try {
            const result = await whoami(session.token);
            if (result.success && result.data) {
              setUser(result.data);
              await handleUpdateUserCookie(result.data);
            }
          } catch (apiError) {
            console.error("Failed to fetch fresh user details on mount", apiError);
          }
        }
      } catch (err) {
        console.error("Error loading auth session", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData: any, tokenVal: string) => {
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = async () => {
    await handleLogoutUser();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (newUserData: any) => {
    setUser(newUserData);
    await handleUpdateUserCookie(newUserData);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const result = await whoami(token);
      if (result.success && result.data) {
        setUser(result.data);
        await handleUpdateUserCookie(result.data);
      }
    } catch (err) {
      console.error("Failed to refresh user details", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
