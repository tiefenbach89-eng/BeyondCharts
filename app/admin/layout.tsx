"use client";

import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}
