import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  tone?: "neutral" | "premium" | "success" | "warning";
  variant?: string; // Erlaubt variant-Prop vom Admin-Tool
  className?: string; // Erlaubt className-Prop vom Admin-Tool
};

export function Badge({ children, tone = "neutral", variant, className }: Props) {
  // Falls variant="outline" genutzt wird, mappen wir es auf neutral
  const activeTone = variant === "outline" ? "neutral" : tone;

  const tones: Record<string, string> = {
    neutral: "bg-[rgb(var(--chip))] text-[rgb(var(--text))] border border-[rgb(var(--border))]",
    premium: "bg-[rgba(var(--premium),0.92)] text-white",
    success: "bg-[rgba(var(--primary),0.12)] text-[rgb(var(--text))] border border-[rgba(var(--primary),0.25)]",
    warning: "bg-[rgba(var(--warning),0.14)] text-[rgb(var(--text))] border border-[rgba(var(--warning),0.28)]",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", 
      tones[activeTone], 
      className // Wichtig, damit das Design von außen greifen kann
    )}>
      {children}
    </span>
  );
}