import { Sparkles } from "lucide-react";

export function PremiumIcon() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm">
      <Sparkles className="h-3 w-3" />
      <span>PREMIUM</span>
    </div>
  );
}