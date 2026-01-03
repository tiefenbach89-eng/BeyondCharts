"use client";

import { useState } from 'react';
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  User, 
  Crown, 
  LogOut, 
  Mail,
  Lock,
  Sparkles, 
  Settings,
  CreditCard,
  Shield,
  Check,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function AccountPage() {
  const { user, role, isPremium, isAdmin, loading, signIn, signUp, signOut } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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
    },
    admin: {
      icon: <Shield className="h-5 w-5" />,
      label: "Administrator",
      color: "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-none"
    }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.guest;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      if (isLoginMode) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Lade Account...</p>
        </div>
      </div>
    );
  }

  // Guest/Not Logged In View - Show Login/Register Form
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-md mx-auto px-6 py-12">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLoginMode ? 'Willkommen zurück' : 'Account erstellen'}
            </h1>
            <p className="text-slate-600">
              {isLoginMode ? 'Melde dich an um fortzufahren' : 'Erstelle deinen kostenlosen Account'}
            </p>
          </div>

          <Card className="p-8 bg-white border-none shadow-sm">
            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="deine@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Wird verarbeitet...</span>
                  </div>
                ) : (
                  isLoginMode ? 'Anmelden' : 'Registrieren'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLoginMode ? 'Noch kein Account? Jetzt registrieren' : 'Bereits registriert? Anmelden'}
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Logged In View - Show Account Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Account</h1>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold text-sm"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
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

                {isAdmin && (
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Admin Zugang</div>
                          <div className="text-xs text-slate-600">Voller CMS Zugriff</div>
                        </div>
                      </div>
                      <a
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        <Shield className="h-4 w-4" />
                        Zum Admin
                      </a>
                    </div>
                  </div>
                )}

                {isPremium && !isAdmin && (
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
                  Erhalte Zugriff auf exklusive Analysen und Features.
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

          </div>
        </div>

      </div>
    </div>
  );
}