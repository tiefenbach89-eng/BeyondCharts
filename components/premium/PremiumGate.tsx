"use client";

import React from "react";
import { useRole } from "@/components/role/RoleProvider";

export function PremiumGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { isPremium } = useRole();
  return <>{isPremium ? children : fallback}</>;
}
