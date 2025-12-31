"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRole } from "@/components/role/RoleProvider";

export default function AccountPage() {
  const { role, setRole, isPremium } = useRole();

  return (
    <div className="ff-container py-6 md:py-10">
      <div className="flex items-center gap-2">
        <Badge>Konto</Badge>
        <Badge tone="neutral">{role}</Badge>
        {isPremium && <Badge tone="premium">Premium aktiv</Badge>}
      </div>

      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Account</h1>
      <p className="mt-1 text-sm ff-muted">Lokale Demo ohne Backend. Supabase Auth kommt später.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-4 md:p-5">
          <div className="text-sm font-semibold">Login/Logout (Demo)</div>
          <div className="mt-3 grid gap-2">
            <Button variant="secondary" onClick={() => setRole("guest")}>Logout → Gast</Button>
            <Button variant="secondary" onClick={() => setRole("free")}>Login → Free</Button>
            <Button onClick={() => setRole("premium")}>Upgrade → Premium</Button>
            <div className="text-xs ff-muted">
              Rollen werden in localStorage gespeichert. Admin ist vorbereitet, aber nicht exposed.
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="text-sm font-semibold">Billing</div>
          <p className="mt-2 text-sm ff-muted">
            Später: Stripe Checkout + Webhooks + Supabase RLS. Für jetzt simulieren wir Upgrades lokal.
          </p>
          <div className="mt-4">
            <Button variant="ghost" href="/premium">Zur Premium Seite</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
