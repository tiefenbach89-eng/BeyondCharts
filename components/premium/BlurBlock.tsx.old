import { cn } from "@/lib/cn";

export function BlurBlock({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-white p-4 md:p-5",
        className
      )}
      {...props}
    />
  );
}

export function BlurredContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[5px] opacity-60">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.35)] to-white" />
    </div>
  );
}
