export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect, Suspense } from 'react';
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, 
  Crown, 
  Shield, 
  LogOut, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles, 
  Check,
  ArrowRight,
  AlertCircle,
  Key
} from "lucide-react";

// Wrap the component that uses useSearchParams in Suspense
function AccountContent() {
  const { user, role, isPremium, isAdmin, loading: authLoading, signOut } = useAuth();
  const searchParams = useSearchParams();
  
  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check for confirmation success
  useEffect(() => {
    const confirmed = searchParams?.get('confirmed');
    if (confirmed === 'true') {
      setSuccess('✅ Email erfolgreich bestätigt! Willkommen bei BeyondCharts!');
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [searchParams]);

  // PASSWORD CHANGE
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('✅ Passwort erfolgreich geändert!');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roleConfig = {
    guest: { icon: User, label: "Gast", color: "bg-slate-100 text-slate-700", glow: "" },
    free: { icon: User, label: "Free", color: "bg-blue-100 text-blue-700", glow: "from-blue-500/20" },
    premium: { icon: Crown, label: "Premium", color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white", glow: "from-amber-500/30 to-orange-500/30" },
    admin: { icon: Shield, label: "Administrator", color: "bg-gradient-to-r from-violet-600 to-purple-600 text-white", glow: "from-violet-500/30 to-purple-500/30" }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.guest;
  const RoleIcon = currentRole.icon;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Lade Account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Nicht angemeldet</h2>
          <p className="text-slate-600 mb-6">Bitte melde dich an um dein Konto zu verwalten.</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
          >
            Zum Login
            <ArrowRight className="h-4 w-4" />
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Global Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Check className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-600">✕</button>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {currentRole.glow && (
                  <div className={`absolute -inset-4 bg-gradient-to-r ${currentRole.glow} rounded-3xl blur-2xl opacity-50`} />
                )}
                <div className={`relative w-16 h-16 rounded-2xl ${currentRole.color} flex items-center justify-center shadow-xl`}>
                  <RoleIcon className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Account</h1>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold text-sm"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${currentRole.color}`}>
            <RoleIcon className="h-5 w-5" />
            <span className="text-sm font-bold">{currentRole.label}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Overview */}
            <Card className="p-8 bg-white border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Konto Übersicht</h2>
                
                {/* Password Change Button */}
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all font-semibold text-sm"
                >
                  <Key className="h-4 w-4" />
                  Passwort ändern
                </button>
              </div>

              {/* Password Change Form */}
              {showPasswordChange && (
                <form onSubmit={handlePasswordChange} className="mb-6 p-6 bg-blue-50 rounded-xl space-y-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Neues Passwort setzen</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Neues Passwort
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Mindestens 6 Zeichen"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Passwort bestätigen
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Passwort wiederholen"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      {loading ? 'Speichere...' : 'Passwort ändern'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">E-Mail</div>
                      <div className="text-xs text-slate-600">{user.email}</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAdmin ? 'bg-violet-100' : isPremium ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <RoleIcon className={`h-5 w-5 ${
                        isAdmin ? 'text-violet-600' : isPremium ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Rolle</div>
                      <div className="text-xs text-slate-600">{currentRole.label}</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>

                {isAdmin && (
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Admin Zugang</div>
                          <div className="text-xs text-slate-600">Voller CMS Zugriff</div>
                        </div>
                      </div>
                    </div>
                    <a
                      href="/admin"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      <Shield className="h-4 w-4" />
                      Zum Admin Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {!isPremium && !isAdmin && (
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-violet-600 border-none shadow-xl text-white">
                <Crown className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-bold mb-2">Upgrade zu Premium</h3>
                <p className="text-sm text-white/90 mb-6">
                  Erhalte Zugriff auf exklusive Analysen und Features.
                </p>
                <a
                  href="/premium"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-blue-600 hover:bg-white/90 rounded-xl font-semibold transition-all shadow-lg"
                >
                  Jetzt upgraden
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            )}

            <Card className="p-6 bg-white border-none shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/news" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  📰 News
                </a>
                <a href="/analysen" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  📊 Analysen
                </a>
                <a href="/assets" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  💼 Assets
                </a>
                {isAdmin && (
                  <a href="/admin" className="block px-4 py-3 text-sm text-violet-700 hover:bg-violet-50 rounded-lg transition-colors font-semibold">
                    🔧 Admin Dashboard
                  </a>
                )}
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}