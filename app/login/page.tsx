"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, AlertCircle, Check, Eye, EyeOff, Chrome } from 'lucide-react';
import { FaApple } from 'react-icons/fa';

// Wrap the component that uses useSearchParams in Suspense
function LoginContent() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSuccess('✅ Erfolgreich angemeldet! Du wirst weitergeleitet...');

      setTimeout(() => {
        router.push('/konto');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error('Auth error:', err);

      const germanErrors: Record<string, string> = {
        'Invalid login credentials': 'Ungültige Anmeldedaten. Bitte überprüfe deine Email und Passwort.',
        'Email not confirmed': 'Bitte bestätige zuerst deine Email-Adresse.',
        'Invalid email': 'Ungültige Email-Adresse.',
        'Email rate limit exceeded': 'Zu viele Versuche. Bitte warte einen Moment.',
      };

      setError(germanErrors[err.message] || err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Fehler bei Google Anmeldung');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Fehler bei Apple Anmeldung');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            BeyondCharts
          </h1>
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-sm font-semibold text-white">PREMIUM ANALYTICS</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Willkommen zurück
            </h2>
            <p className="text-slate-400">
              Melde dich an um fortzufahren
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                E-Mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="deine@email.com"
                  required
                  disabled={loading || !!success}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Passwort
                </label>
                <a
                  href="/passwort-zuruecksetzen"
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Passwort vergessen?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading || !!success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Anmelden...</span>
                </div>
              ) : 'Anmelden'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-400">oder</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <Chrome className="h-5 w-5" />
                Mit Google anmelden
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <FaApple className="h-5 w-5" />
                Mit Apple anmelden
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Noch kein Account? Jetzt registrieren
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-white/60 flex items-center justify-center gap-4">
          <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
          <span>•</span>
          <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
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
