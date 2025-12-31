import { Crown } from "lucide-react";

export function PremiumIcon() {
  return (
    <div className="flex h-6 w-6 items-center justify-center">
      <Crown
        className="
          h-4 w-4
          text-amber-500
          drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]
        "
        aria-label="Premium Inhalt"
      />
    </div>
  );
}
