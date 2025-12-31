"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function PaywallTeaser({
  title = "Premium freischalten",
  subtitle = "Mehr Kontext, Briefings und Watchlist-Features. Testphase inklusive.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <div className="ff-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone="premium">
              <Lock className="h-3.5 w-3.5" />
              Premium
            </Badge>
          </div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm ff-muted">{subtitle}</p>
        </div>
        <Button onClick={() => router.push("/premium")} className="shrink-0">
          Kostenlos testen
        </Button>
      </div>
    </div>
  );
}
