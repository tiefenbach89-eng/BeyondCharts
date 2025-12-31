"use client";

import React from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;
};

const SearchContext = React.createContext<Ctx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <SearchContext.Provider value={{ open, setOpen, query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = React.useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
