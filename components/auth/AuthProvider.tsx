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
          role: 'free',
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

// ⭐ BACKWARDS COMPATIBILITY - So können alte Pages useRole() weiter nutzen!
export function useRole() {
  const auth = useAuth();
  
  return {
    role: auth.role,
    isPremium: auth.isPremium,
    // setRole als Dummy-Funktion die nur warnt
    setRole: (newRole: Role) => {
      console.warn(
        `⚠️ setRole("${newRole}") wurde aufgerufen, aber wird ignoriert!`,
        '\nRoles werden jetzt durch Supabase Auth verwaltet.',
        '\nÄndere die Role im Supabase Dashboard mit SQL:',
        `\nUPDATE auth.users SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"${newRole}"') WHERE email = 'your@email.com';`
      );
    }
  };
}

// ⭐ AUCH RoleProvider exportieren für backwards compatibility
export const RoleProvider = AuthProvider;