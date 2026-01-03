"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRole } from "@/components/auth/AuthProvider";
import { 
  Check, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  Bell, 
  Target,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  Star
} from "lucide-react";

export default function PremiumPage() {
  const { role, setRole, isPremium } = useRole();

  const features = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Premium Deep Dives",
      description: "Vollzugriff auf institutionelle Analysen mit detaillierten Metriken",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Daily Briefings",
      description: "Kuratierte Marktübersichten jeden Morgen (Phase 2 mit Realtime)",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Smart Alerts",
      description: "Watchlist-Benachrichtigungen und personalisierte Trigger (Phase 2)",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Personalisierter Feed",
      description: "Relevante Insights basierend auf deinen Interessen (Phase 2)",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Tiefere Analysen",
      description: "Treiber, Szenarien, Watchpoints und konkurrierende Thesen",
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Ad-Free Experience",
      description: "Keine Ablenkungen, nur relevanter Content",
      gradient: "from-slate-600 to-slate-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.3),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Premium Membership</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Investiere in
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 text-transparent bg-clip-text"> bessere Entscheidungen</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12">
              Deep Dives, Briefings und personalisierte Insights. 
              <br className="hidden md:block" />
              Kein Lärm. Keine Tricks. Nur Mehrwert.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isPremium ? (
                <>
                  <Button 
                    onClick={() => setRole("premium")}
                    className="px-8 py-4 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    14 Tage kostenlos testen
                  </Button>
                  {role === "guest" && (
                    <Button 
                      onClick={() => setRole("free")}
                      variant="secondary"
                      className="px-8 py-4 text-lg bg-white/10 backdrop-blur-xl text-white border-white/20 hover:bg-white/20"
                    >
                      Kostenlos registrieren
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  href="/analysen"
                  className="px-8 py-4 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-2xl"
                >
                  Premium nutzen
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-slate-400 mt-8">
              ✓ Jederzeit kündbar · ✓ Keine Kreditkarte für Trial · ✓ 14 Tage Geld-zurück
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Was du bekommst
            </h2>
            <p className="text-xl text-slate-600">
              Alles was du brauchst, um bessere Investment-Entscheidungen zu treffen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="group p-8 bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Ein Preis. Voller Zugang. Keine versteckten Kosten.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-none shadow-2xl">
              {/* Premium Badge */}
              <div className="absolute top-6 right-6">
                <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                  BELIEBT
                </div>
              </div>

              <div className="p-10">
                {/* Price */}
                <div className="mb-8">
                  <div className="text-sm font-semibold text-slate-600 mb-2">Premium Monatlich</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold text-slate-900">9,99€</span>
                    <span className="text-xl text-slate-500">/Monat</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-2">inkl. 14 Tage kostenloser Trial</div>
                </div>

                {/* What's Included */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  {[
                    "Vollzugriff auf Premium-Content",
                    "Daily & Weekly Briefings",
                    "Watchlist mit Alerts",
                    "Personalisierter Feed",
                    "Deep Dives & Analysen",
                    "Ad-Free Experience"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Zugang</span>
                    <span className="font-semibold text-slate-900">Premium (unbegrenzt)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Kündigung</span>
                    <span className="font-semibold text-slate-900">Jederzeit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Abrechnung</span>
                    <span className="font-semibold text-slate-900">Stripe (später)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Support</span>
                    <span className="font-semibold text-slate-900">Priority</span>
                  </div>
                </div>

                {/* CTA */}
                {!isPremium ? (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setRole("premium")}
                      className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Jetzt 14 Tage testen
                    </Button>
                    {role === "guest" && (
                      <Button 
                        onClick={() => setRole("free")}
                        variant="secondary"
                        className="w-full py-4"
                      >
                        Kostenlos registrieren
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
                        <Check className="h-5 w-5" />
                        Du bist Premium Member!
                      </div>
                    </div>
                    <Button 
                      href="/analysen"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600"
                    >
                      Premium nutzen
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button 
                      onClick={() => setRole("free")}
                      variant="secondary"
                      className="w-full py-4"
                    >
                      Auf Free downgraden (Demo)
                    </Button>
                  </div>
                )}

                <p className="text-xs text-slate-500 text-center mt-6">
                  Demo-Modus: Rollen werden lokal gespeichert. Supabase/Stripe Integration folgt.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Free vs. Premium
            </h2>
            <p className="text-xl text-slate-600">
              Wähle den Plan der zu dir passt
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-white border-2 border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Free</h3>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                  Kostenlos
                </Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: "Kuratierte Free-News", included: true },
                  { text: "Basis-Suche & Kategorien", included: true },
                  { text: "Watchlist (lokal, begrenzt)", included: true },
                  { text: "Premium-Preview", included: true },
                  { text: "Deep Dives & Analysen", included: false },
                  { text: "Daily Briefings", included: false },
                  { text: "Smart Alerts", included: false },
                  { text: "Personalisierung", included: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.included 
                        ? 'bg-slate-100 text-slate-600' 
                        : 'bg-slate-50 text-slate-300'
                    }`}>
                      {item.included ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">—</span>
                      )}
                    </div>
                    <span className={item.included ? 'text-slate-700' : 'text-slate-400'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant="secondary"
                className="w-full mt-8 py-3"
                onClick={() => setRole("free")}
              >
                Free bleiben
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="relative p-8 bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-violet-200 shadow-lg">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full text-xs font-bold text-white shadow-lg">
                  EMPFOHLEN
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none">
                  <Crown className="h-3 w-3 mr-1" />
                  9,99€/Mo
                </Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: "Alles aus Free", included: true },
                  { text: "Vollzugriff Premium-Content", included: true },
                  { text: "Deep Dives & Analysen", included: true },
                  { text: "Daily & Weekly Briefings", included: true },
                  { text: "Smart Alerts & Trigger", included: true },
                  { text: "Personalisierter Feed", included: true },
                  { text: "Priority Support", included: true },
                  { text: "Ad-Free Experience", included: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setRole("premium")}
                className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg"
              >
                <Star className="h-4 w-4 mr-2" />
                14 Tage kostenlos testen
              </Button>
            </Card>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-br from-slate-50 to-blue-50 border-none shadow-sm">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Noch Fragen?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Probiere es einfach 14 Tage kostenlos aus. Keine Kreditkarte nötig. 
              Jederzeit kündbar. Falls du nicht zufrieden bist, Geld-zurück-Garantie.
            </p>
            <Button 
              onClick={() => setRole("premium")}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              Jetzt starten
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}