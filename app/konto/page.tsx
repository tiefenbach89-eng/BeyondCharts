"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { createBrowserClient } from '@supabase/ssr';
import { 
  User, 
  Crown, 
  Shield, 
  LogOut, 
  Mail,
  Lock,
  Sparkles, 
  Settings,
  Check,
  ArrowRight,
  AlertCircle,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AccountPage() {
  const { user, role, isPremium, isAdmin, loading: authLoading, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'free' | 'premium' | 'admin'>('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      // Get all users from auth.users (requires service role in production!)
      // For now, we'll show a message
      setUsers([]);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            role: newUserRole,
          },
        },
      });

      if (error) throw error;

      setSuccess(`User ${newUserEmail} erfolgreich erstellt!`);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('free');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Users');
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
            href="/konto"
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

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${currentRole.color}">
            <RoleIcon className="h-5 w-5" />
            <span className="text-sm font-bold">{currentRole.label}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Account Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Overview */}
            <Card className="p-8 bg-white border-none shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Konto Übersicht</h2>
              
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

            {/* Admin: User Management */}
            {isAdmin && (
              <Card className="p-8 bg-white border-none shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Erstelle neue Admins oder Premium User</p>
                  </div>
                  <button
                    onClick={() => setShowUserManagement(!showUserManagement)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-xl transition-all font-semibold text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    {showUserManagement ? 'Schließen' : 'Neuer User'}
                  </button>
                </div>

                {showUserManagement && (
                  <form onSubmit={handleCreateUser} className="space-y-4 p-6 bg-slate-50 rounded-xl">
                    {error && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
                        <Check className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{success}</p>
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
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                          placeholder="user@example.com"
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
                          type={showPassword ? "text" : "password"}
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                          placeholder="Mindestens 6 Zeichen"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Rolle
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['free', 'premium', 'admin'] as const).map((r) => {
                          const config = roleConfig[r];
                          const Icon = config.icon;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setNewUserRole(r)}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                newUserRole === r
                                  ? 'border-violet-600 bg-violet-50'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <Icon className={`h-6 w-6 mx-auto mb-2 ${
                                newUserRole === r ? 'text-violet-600' : 'text-slate-400'
                              }`} />
                              <div className={`text-sm font-semibold ${
                                newUserRole === r ? 'text-violet-900' : 'text-slate-700'
                              }`}>
                                {config.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Erstelle User...' : 'User erstellen'}
                    </button>
                  </form>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tipp:</strong> Neue Admins können sich sofort anmelden und haben vollen CMS-Zugriff.
                  </p>
                </div>
              </Card>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Premium CTA */}
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

            {/* Quick Links */}
            <Card className="p-6 bg-white border-none shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="/news"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  📰 News
                </a>
                <a
                  href="/analysen"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  📊 Analysen
                </a>
                <a
                  href="/assets"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  💼 Assets
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="block px-4 py-3 text-sm text-violet-700 hover:bg-violet-50 rounded-lg transition-colors font-semibold"
                  >
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