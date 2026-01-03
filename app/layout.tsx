import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoleProvider } from "@/components/role/RoleProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Beyond Charts — Investieren verstehen",
    template: "%s | BeyondCharts"
  },
  description: "Tiefgründige Unternehmensanalysen & Markt-Insights für informierte Investitionsentscheidungen.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  keywords: ["Aktienanalyse", "Investieren", "Finanzmarkt", "Portfolio", "Unternehmensanalyse", "Trading"],
  authors: [{ name: "BeyondCharts" }],
  openGraph: {
    title: "Beyond Charts — Investieren verstehen",
    description: "Tiefgründige Unternehmensanalysen & Markt-Insights.",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Charts",
    description: "Tiefgründige Unternehmensanalysen & Markt-Insights.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased">
        <RoleProvider>
          <SearchProvider>
            <Header />
            <main className="pt-16 md:pt-20">{children}</main>
            <Footer />
            <SearchOverlay />
          </SearchProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
