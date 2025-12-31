"use client";

import React from "react";

export type Role = "guest" | "free" | "premium" | "admin";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  isPremium: boolean;
};

const RoleContext = React.createContext<Ctx | null>(null);

const STORAGE_KEY = "ff_role";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>("guest");

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Role | null) ?? "guest";
    setRoleState(saved);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem(STORAGE_KEY, r);
  };

  const value: Ctx = { role, setRole, isPremium: role === "premium" || role === "admin" };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = React.useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
