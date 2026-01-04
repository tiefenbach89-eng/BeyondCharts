"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

// Wrap the component that uses useSearchParams in Suspense
function LoginContent() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check for error in URL params - FIXED: useEffect instead of useState
  useEffect(() => {
    const urlError = searchParams?.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        // Success - redirect
        router.push('/konto');
        router.refresh();
      } else {
        // REGISTER
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
            data: {
              role: 'free', // Default role
            },
          },
        });
        
        if (error) throw error;

        if (data.user) {
          setSuccess('✅ Registrierung erfolgreich! Bitte bestätige deine Email-Adresse. Wir haben dir eine Email geschickt.');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {mode === 'login' ? 'Willkommen zurück' : 'Account erstellen'}
          </h1>
          <p className="text-slate-600">
            {mode === 'login' ? 'Melde dich an um fortzufahren' : 'Erstelle deinen kostenlosen Account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Email */}
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="deine@email.com"
                  required
                  disabled={loading || !!success}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading || !!success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="mt-2 text-xs text-slate-500">
                  Mindestens 6 Zeichen
                </p>
              )}
            </div>

            {/* Submit */}
            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'login' ? 'Anmelden...' : 'Registrieren...'}</span>
                  </div>
                ) : (
                  mode === 'login' ? 'Anmelden' : 'Kostenlosen Account erstellen'
                )}
              </button>
            )}
          </form>

          {/* Toggle Mode */}
          {!success && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                {mode === 'login' 
                  ? 'Noch kein Account? Jetzt registrieren' 
                  : 'Bereits registriert? Anmelden'}
              </button>
            </div>
          )}

          {/* Info Box for Registration */}
          {mode === 'register' && !success && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-900">
                <strong>✨ Kostenlos starten:</strong> Nach der Registrierung erhältst du vollen Zugang zu News und Analysen. Premium-Features können später hinzugefügt werden.
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Zurück zur Startseite
          </a>
        </div>

      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
