"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRole } from "@/components/role/RoleProvider";
import { 
  User, 
  Crown, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Settings,
  CreditCard,
  Shield,
  Check,
  ArrowRight
} from "lucide-react";

export default function AccountPage() {
  const { role, setRole, isPremium } = useRole();

  const roleConfig = {
    guest: {
      icon: <User className="h-5 w-5" />,
      label: "Gast",
      color: "bg-slate-100 text-slate-700 border-slate-200"
    },
    free: {
      icon: <User className="h-5 w-5" />,
      label: "Free Account",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    premium: {
      icon: <Crown className="h-5 w-5" />,
      label: "Premium Member",
      color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none"
    }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.guest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Account Einstellungen</h1>
              <p className="text-sm text-slate-500 mt-1">Verwalte dein Konto und Abonnement</p>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${currentRole.color}`}>
            {currentRole.icon}
            <span className="text-sm font-bold">{currentRole.label}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Account Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Overview Card */}
            <Card className="p-8 bg-white border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Konto Übersicht</h2>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium aktiv
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {/* Status Items */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Status</div>
                        <div className="text-xs text-slate-600">{currentRole.label}</div>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>

                {isPremium && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Premium Features</div>
                          <div className="text-xs text-slate-600">Alle Features freigeschaltet</div>
                        </div>
                      </div>
                      <Check className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Datenspeicherung</div>
                        <div className="text-xs text-slate-600">Lokal (localStorage)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">ℹ</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-900 mb-1">Demo-Modus</div>
                    <div className="text-xs text-blue-700 leading-relaxed">
                      Dies ist eine lokale Demo. Rollen werden in localStorage gespeichert. 
                      Supabase Auth + Stripe Billing folgen in Phase 2.
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-8 bg-white border-none shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Schnellzugriff (Demo)</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("guest")}
                  className="group p-5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5 text-slate-700" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-1">Logout</div>
                  <div className="text-xs text-slate-600">Als Gast fortfahren</div>
                </button>

                <button
                  onClick={() => setRole("free")}
                  className="group p-5 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogIn className="h-5 w-5 text-blue-700" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-blue-900 mb-1">Login Free</div>
                  <div className="text-xs text-blue-700">Kostenloser Account</div>
                </button>

                <button
                  onClick={() => setRole("premium")}
                  className="group p-5 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl border border-amber-200 transition-all text-left sm:col-span-2"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-amber-900 mb-1">Upgrade Premium</div>
                  <div className="text-xs text-amber-700">Vollzugriff auf alle Features</div>
                </button>
              </div>
            </Card>

          </div>

          {/* Right Column - Billing & Premium */}
          <div className="space-y-6">
            
            {/* Premium CTA */}
            {!isPremium && (
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-violet-600 border-none shadow-xl text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Upgrade zu Premium</h3>
                <p className="text-sm text-white/90 mb-6 leading-relaxed">
                  Erhalte Zugriff auf exklusive Analysen, Daily Briefings und personalisierte Insights.
                </p>
                <Button 
                  href="/premium"
                  className="w-full bg-white text-blue-600 hover:bg-white/90 shadow-lg"
                >
                  Jetzt upgraden
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            )}

            {/* Billing Info */}
            <Card className="p-6 bg-white border-none shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Billing</h3>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Stripe Integration folgt in Phase 2 mit:
              </p>
              
              <div className="space-y-2 mb-6">
                {[
                  "Checkout Flow",
                  "Webhooks",
                  "Subscription Management",
                  "Invoice History"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {isPremium && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <Check className="h-4 w-4" />
                    Premium aktiv (Demo)
                  </div>
                </div>
              )}
            </Card>

            {/* Settings */}
            <Card className="p-6 bg-white border-none shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Einstellungen</h3>
              </div>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Profil bearbeiten
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Benachrichtigungen
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Datenschutz
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <button className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
                  Account löschen
                </button>
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}