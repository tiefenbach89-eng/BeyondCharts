"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, AlertCircle, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if we're in reset mode (coming from email link)
  useState(() => {
    const type = searchParams?.get('type');
    if (type === 'recovery') {
      setMode('reset');
    }
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/passwort-zuruecksetzen?type=recovery`,
      });

      if (error) throw error;

      setSuccess('✅ Email wurde gesendet! Bitte überprüfe dein Postfach und klicke auf den Link in der Email.');
      setEmail('');
    } catch (err: any) {
      console.error('Password reset request error:', err);

      // Translate common Supabase errors to German
      const germanErrors: Record<string, string> = {
        'Email not confirmed': 'Diese Email-Adresse wurde noch nicht bestätigt.',
        'User not found': 'Keine Benutzer mit dieser Email-Adresse gefunden.',
        'Invalid email': 'Ungültige Email-Adresse.',
        'For security purposes, you can only request this once every 60 seconds': 'Aus Sicherheitsgründen kannst du dies nur einmal pro Minute anfordern.',
      };

      setError(germanErrors[err.message] || err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein!');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein!');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('✅ Passwort erfolgreich geändert! Du wirst weitergeleitet...');

      setTimeout(() => {
        router.push('/konto');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);

      // Translate common Supabase errors to German
      const germanErrors: Record<string, string> = {
        'New password should be different from the old password': 'Das neue Passwort muss sich vom alten unterscheiden.',
        'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
      };

      setError(germanErrors[err.message] || err.message || 'Ein Fehler ist aufgetreten');
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
            {mode === 'request' ? 'Passwort zurücksetzen' : 'Neues Passwort setzen'}
          </h1>
          <p className="text-slate-600">
            {mode === 'request'
              ? 'Gib deine Email-Adresse ein, um einen Reset-Link zu erhalten'
              : 'Wähle ein neues, sicheres Passwort'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">

          {mode === 'request' ? (
            // REQUEST RESET MODE
            <form onSubmit={handleRequestReset} className="space-y-6">

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
                  E-Mail Adresse
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
                      <span>Sende Email...</span>
                    </div>
                  ) : (
                    'Reset-Link anfordern'
                  )}
                </button>
              )}
            </form>
          ) : (
            // RESET PASSWORD MODE
            <form onSubmit={handleResetPassword} className="space-y-6">

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

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Neues Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Mindestens 6 Zeichen"
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
              </div>

              {/* Confirm Password */}
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
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Passwort wiederholen"
                    required
                    disabled={loading || !!success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Mindestens 6 Zeichen
                </p>
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
                      <span>Passwort wird gespeichert...</span>
                    </div>
                  ) : (
                    'Passwort zurücksetzen'
                  )}
                </button>
              )}
            </form>
          )}

          {/* Info Box */}
          {mode === 'request' && !success && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-900">
                <strong>💡 Hinweis:</strong> Du erhältst eine Email mit einem Link zum Zurücksetzen deines Passworts.
                Der Link ist 60 Minuten gültig.
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Login
          </a>
        </div>

      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PasswordResetContent />
    </Suspense>
  );
}
