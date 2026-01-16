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
  Key,
  Settings,
  Activity,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  Bell,
  CreditCard,
  X
} from "lucide-react";

type TabType = 'overview' | 'security' | 'settings';

// Wrap the component that uses useSearchParams in Suspense
function AccountContent() {
  const { user, role, isPremium, isAdmin, loading: authLoading, signOut } = useAuth();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
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
      setTimeout(() => setSuccess(''), 8000);
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
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roleConfig = {
    guest: {
      icon: User,
      label: "Gast",
      color: "bg-slate-100 text-slate-700",
      borderColor: "border-slate-200",
      bgGradient: "from-slate-50 to-slate-100",
      glow: ""
    },
    free: {
      icon: User,
      label: "Free",
      color: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-200",
      bgGradient: "from-blue-50 to-blue-100",
      glow: "from-blue-500/20"
    },
    premium: {
      icon: Crown,
      label: "Premium",
      color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
      borderColor: "border-orange-300",
      bgGradient: "from-amber-50 to-orange-100",
      glow: "from-amber-500/30 to-orange-500/30"
    },
    admin: {
      icon: Shield,
      label: "Administrator",
      color: "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
      borderColor: "border-violet-300",
      bgGradient: "from-violet-50 to-purple-100",
      glow: "from-violet-500/30 to-purple-500/30"
    }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.guest;
  const RoleIcon = currentRole.icon;

  const tabs = [
    { id: 'overview' as TabType, label: 'Übersicht', icon: Activity },
    { id: 'security' as TabType, label: 'Sicherheit', icon: Shield },
    { id: 'settings' as TabType, label: 'Einstellungen', icon: Settings },
  ];

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Nicht angemeldet</h2>
          <p className="text-slate-600 mb-6">Bitte melde dich an um dein Konto zu verwalten.</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Global Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 animate-in slide-in-from-top duration-300">
            <Check className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header with Profile Card */}
        <div className="mb-8">
          <Card className="p-6 lg:p-8 bg-white border-none shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {currentRole.glow && (
                    <div className={`absolute -inset-4 bg-gradient-to-r ${currentRole.glow} rounded-3xl blur-2xl opacity-50 animate-pulse`} />
                  )}
                  <div className={`relative w-20 h-20 rounded-2xl ${currentRole.color} flex items-center justify-center shadow-xl`}>
                    <RoleIcon className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Mein Account</h1>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg mt-2 ${currentRole.color} text-xs font-bold`}>
                    <RoleIcon className="h-3.5 w-3.5" />
                    {currentRole.label}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Abmelden</span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 border-b border-slate-200 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all relative
                    ${isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-semibold">News gelesen</p>
                        <p className="text-2xl font-bold text-blue-900">-</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700">Bald verfügbar</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-violet-600 font-semibold">Analysen</p>
                        <p className="text-2xl font-bold text-violet-900">-</p>
                      </div>
                    </div>
                    <p className="text-xs text-violet-700">Bald verfügbar</p>
                  </Card>
                </div>

                {/* Account Info */}
                <Card className="p-6 lg:p-8 bg-white border-none shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Account Informationen</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">E-Mail</div>
                          <div className="text-xs text-slate-600">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-600 font-semibold">Bestätigt</span>
                        <Check className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isAdmin ? 'bg-violet-100' : isPremium ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          <RoleIcon className={`h-5 w-5 ${
                            isAdmin ? 'text-violet-600' : isPremium ? 'text-amber-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Account-Typ</div>
                          <div className="text-xs text-slate-600">{currentRole.label}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Mitglied seit</div>
                          <div className="text-xs text-slate-600">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' }) : 'Unbekannt'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="p-6 lg:p-8 bg-white border-none shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Sicherheit</h2>
                    <p className="text-sm text-slate-600 mt-1">Verwalte deine Sicherheitseinstellungen</p>
                  </div>

                  {!showPasswordChange && (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      <Key className="h-4 w-4" />
                      Passwort ändern
                    </button>
                  )}
                </div>

                {/* Password Change Form */}
                {showPasswordChange ? (
                  <form onSubmit={handlePasswordChange} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900">Neues Passwort setzen</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

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
                          className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="Mindestens 6 Zeichen"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                          className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="Passwort wiederholen"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Speichere...</span>
                          </div>
                        ) : 'Passwort ändern'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all border border-slate-200"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold text-slate-900">2-Faktor-Authentifizierung</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Noch nicht aktiviert</p>
                      <button disabled className="text-sm text-slate-400 font-semibold cursor-not-allowed">
                        Bald verfügbar
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">Login-Aktivität</span>
                      </div>
                      <p className="text-sm text-slate-600">Bald verfügbar</p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="p-6 lg:p-8 bg-white border-none shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Einstellungen</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Benachrichtigungen</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-slate-600" />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Email Benachrichtigungen</div>
                            <div className="text-xs text-slate-600">Erhalte Updates per E-Mail</div>
                          </div>
                        </div>
                        <button disabled className="text-sm text-slate-400 font-semibold cursor-not-allowed">
                          Bald verfügbar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Datenschutz</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600">
                          Deine Daten werden sicher bei Supabase gespeichert und DSGVO-konform verarbeitet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Admin Access Card */}
            {isAdmin && (
              <Card className="p-6 bg-gradient-to-br from-violet-600 to-purple-600 border-none shadow-xl text-white">
                <Shield className="h-10 w-10 mb-3" />
                <h3 className="text-lg font-bold mb-2">Admin Zugang</h3>
                <p className="text-sm text-white/90 mb-4">
                  Voller CMS Zugriff auf alle Funktionen
                </p>
                <a
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-violet-600 hover:bg-white/90 rounded-xl font-semibold transition-all shadow-lg"
                >
                  <Shield className="h-4 w-4" />
                  Zum Admin Dashboard
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            )}

            {/* Upgrade Card */}
            {!isPremium && !isAdmin && (
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-violet-600 border-none shadow-xl text-white">
                <Crown className="h-10 w-10 mb-3" />
                <h3 className="text-lg font-bold mb-2">Upgrade zu Premium</h3>
                <p className="text-sm text-white/90 mb-4">
                  Erhalte Zugriff auf exklusive Analysen und Features.
                </p>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Alle Premium-Analysen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Erweiterte Charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Prioritäts-Support</span>
                  </div>
                </div>
                <a
                  href="/premium"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-blue-600 hover:bg-white/90 rounded-xl font-semibold transition-all shadow-lg"
                >
                  Jetzt upgraden
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="p-6 bg-white border-none shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="/news"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span className="flex-1">News</span>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </a>
                <a
                  href="/analysen"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <BarChart3 className="h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  <span className="flex-1">Analysen</span>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </a>
                <a
                  href="/assets"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="flex-1">Assets</span>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </a>
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
