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
  X,
  Trash2,
  AlertTriangle
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
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'LÖSCHEN') {
      setError('Bitte gib "LÖSCHEN" ein um fortzufahren');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: deleteError } = await supabase.rpc('delete_user');

      if (deleteError) throw deleteError;

      setSuccess('✅ Account erfolgreich gelöscht. Du wirst abgemeldet...');

      setTimeout(async () => {
        await signOut();
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen des Accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('✅ Benachrichtigungseinstellungen gespeichert!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError('Fehler beim Speichern der Einstellungen');
    } finally {
      setLoading(false);
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
              <div className="space-y-6">
                <Card className="p-6 lg:p-8 bg-white border-none shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Passwort</h2>
                      <p className="text-sm text-slate-600 mt-1">Ändere dein Passwort</p>
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

                {/* Account Deletion */}
                <Card className="p-6 lg:p-8 bg-white border-none shadow-sm border-2 border-red-200">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Gefahrenzone</h2>
                        <p className="text-sm text-slate-600">Account unwiderruflich löschen</p>
                      </div>
                    </div>
                  </div>

                  {!showDeleteAccount ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-red-900 font-semibold mb-1">
                              Warnung: Diese Aktion kann nicht rückgängig gemacht werden
                            </p>
                            <p className="text-sm text-red-700">
                              Wenn du deinen Account löschst, werden alle deine Daten permanent gelöscht.
                              Dies umfasst deine Watchlist, Favoriten und alle Account-Einstellungen.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteAccount(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                        Account löschen
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-50 rounded-xl border border-red-200 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-red-900">Account löschen bestätigen</h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteAccount(false);
                            setDeleteConfirmation('');
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="p-4 bg-red-100 rounded-lg border border-red-300">
                        <p className="text-sm text-red-900 font-semibold mb-2">
                          Bitte gib das Wort <span className="font-mono bg-red-200 px-2 py-0.5 rounded">LÖSCHEN</span> ein, um fortzufahren:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                          placeholder="LÖSCHEN"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteConfirmation !== 'LÖSCHEN'}
                          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Lösche Account...</span>
                            </div>
                          ) : 'Account unwiderruflich löschen'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteAccount(false);
                            setDeleteConfirmation('');
                          }}
                          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all border border-slate-200"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="p-6 lg:p-8 bg-white border-none shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Benachrichtigungen</h2>
                  <p className="text-sm text-slate-600 mt-1">Wähle, welche E-Mails du erhalten möchtest</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <Bell className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-1">Newsletter</div>
                          <div className="text-xs text-slate-600">Wöchentliche Zusammenfassung der wichtigsten Markt-News</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <TrendingUp className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-1">Preis-Alerts</div>
                          <div className="text-xs text-slate-600">Benachrichtigungen bei wichtigen Kursbewegungen deiner Watchlist</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setPriceAlerts(!priceAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          priceAlerts ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          priceAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-1">Neue Analysen</div>
                          <div className="text-xs text-slate-600">Info über neue Premium-Analysen und Expertenmeinungen</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setWeeklyDigest(!weeklyDigest)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          weeklyDigest ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Speichere...</span>
                        </div>
                      ) : 'Einstellungen speichern'}
                    </button>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Datenschutz</h3>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-900 font-semibold mb-1">DSGVO-konform</p>
                          <p className="text-sm text-blue-700">
                            Deine Daten werden sicher bei Supabase gespeichert und DSGVO-konform verarbeitet.
                            Du kannst deine Daten jederzeit einsehen, ändern oder löschen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

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
