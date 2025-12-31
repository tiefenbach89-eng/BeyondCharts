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
  title: "Beyond Charts — Investieren verstehen",
  description: "Tiefgründige Unternehmensanalysen & Markt-Insights.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
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
