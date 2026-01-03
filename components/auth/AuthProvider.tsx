"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export type Role = "guest" | "free" | "premium" | "admin";

interface AuthContextType {
  user: User | null;
  role: Role;
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [loading, setLoading] = useState(true);
  
  // Create Supabase client for browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      updateRole(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      updateRole(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateRole = (user: User | null) => {
    if (!user) {
      setRole('guest');
      return;
    }

    // Check user metadata for role
    const metadata = user.user_metadata;
    const appMetadata = user.app_metadata;
    
    // Priority: app_metadata.role > user_metadata.role > default 'free'
    const userRole = (appMetadata?.role || metadata?.role || 'free') as Role;
    setRole(userRole);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'free', // Default role for new users
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    role,
    isPremium: role === 'premium' || role === 'admin',
    isAdmin: role === 'admin',
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Backwards compatibility - keep useRole for existing code
export function useRole() {
  const auth = useAuth();
  return {
    role: auth.role,
    setRole: () => {
      console.warn('setRole is deprecated with Supabase Auth. Role is managed server-side.');
    },
    isPremium: auth.isPremium,
  };
}