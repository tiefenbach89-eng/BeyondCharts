import { cn } from "@/lib/cn";
import Link from "next/link";
import * as React from "react";

// Wir fügen nur Typen & saubere Size-States hinzu – Design bleibt unangetastet
type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]";

  const styles: Record<Variant, string> = {
    primary:
      "bg-[rgb(var(--text))] text-white hover:opacity-90 focus:ring-[rgba(var(--text),0.25)]",
    secondary:
      "bg-[rgb(var(--chip))] text-[rgb(var(--text))] hover:bg-white border border-[rgb(var(--border))] focus:ring-[rgba(var(--text),0.18)]",
    ghost:
      "bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--chip))] focus:ring-[rgba(var(--text),0.18)]",
    outline:
      "bg-transparent border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--chip))]",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  };

  // Saubere, explizite Größen – md bleibt exakt dein bisheriges Default
  const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
    // Touch-first: keep visual rhythm, guarantee minimum hit area
    sm: "px-3 py-2 text-xs min-h-10",
    md: "px-4 py-2 text-sm min-h-11",
    lg: "px-6 py-3 text-base min-h-12",
    xl: "px-12 h-14 text-lg", // CTA
  };

  const cls = cn(base, styles[variant], sizeClasses[size], className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
