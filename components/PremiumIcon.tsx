<<<<<<< HEAD
import { Sparkles } from "lucide-react";

export function PremiumIcon() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm">
      <Sparkles className="h-3 w-3" />
      <span>PREMIUM</span>
    </div>
  );
}
=======
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
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
