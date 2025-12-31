import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Paywalled preview that is safe for non-premium users:
 * - shows a short teaser only
 * - keeps the same container/layout in preview + live
 */
export function PaywalledPreview({
  children,
  className,
  label = "Premium-Inhalt",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 md:p-6",
        className
      )}
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--premium),0.06)] px-3 py-1 text-xs font-semibold text-[rgb(var(--premium))]">
        <Lock className="h-4 w-4" />
        {label}
      </div>

      <div className="space-y-3 text-sm text-[rgb(var(--text))] leading-relaxed">{children}</div>

      {/* Strong readability stop for anything below the teaser */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[rgb(var(--card))]" />
    </div>
  );
}
