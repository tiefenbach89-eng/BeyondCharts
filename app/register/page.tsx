"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, AlertCircle, Check, Eye, EyeOff, User, ArrowRight, ArrowLeft, Chrome } from 'lucide-react';
import { FaApple } from 'react-icons/fa';

type Step = 'credentials' | 'name' | 'confirmation';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Password strength calculation
  const getPasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 50) return 'Schwach';
    if (passwordStrength < 75) return 'Mittel';
    return 'Stark';
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Passwort muss mindestens 1 Zahl enthalten');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Passwort muss mindestens 1 Großbuchstaben enthalten');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Passwort muss mindestens 1 Sonderzeichen enthalten');
      return;
    }

    // Check if email already exists
    setLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        setError('Diese Email-Adresse ist bereits registriert. Bitte melde dich an.');
        setLoading(false);
        return;
      }
    } catch (err: any) {
      // If error is "not found", that's good - email doesn't exist
      if (err.code !== 'PGRST116') {
        console.error('Email check error:', err);
      }
    } finally {
      setLoading(false);
    }

    setStep('name');
  };

  const handleStepTwo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name is required
    if (!name || name.trim().length === 0) {
      setError('Bitte gib einen Namen oder Spitznamen ein');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/konto?confirmed=true`,
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setStep('confirmation');
      }
    } catch (err: any) {
      console.error('Registrierung Fehler:', err);

      const germanErrors: Record<string, string> = {
        'User already registered': 'Diese Email-Adresse ist bereits registriert.',
        'Invalid email': 'Ungültige Email-Adresse.',
        'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
        'Signup disabled': 'Registrierung ist derzeit deaktiviert.',
        'Email rate limit exceeded': 'Zu viele Versuche. Bitte warte einen Moment.',
      };

      setError(germanErrors[err.message] || err.message || 'Ein Fehler ist aufgetreten');
      setStep('credentials');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Account erstellen
          </h1>
          <p className="text-slate-600">
            Erstelle deinen kostenlosen Account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">

          {/* Progress Indicator */}
          {step !== 'confirmation' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">
                  Schritt {step === 'credentials' ? '1' : '2'} von 2
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300"
                  style={{ width: step === 'credentials' ? '50%' : '100%' }}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Email + Password */}
          {step === 'credentials' && (
            <form onSubmit={handleStepOne} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  E-Mail-Adresse
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Mindestens 8 Zeichen"
                    required
                    minLength={8}
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600">{getStrengthLabel()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 space-y-1">
                  <p className={`text-xs ${password.length >= 8 ? 'text-green-600' : 'text-slate-500'} flex items-center gap-2`}>
                    {password.length >= 8 ? <Check className="h-3 w-3" /> : '○'} Mindestens 8 Zeichen
                  </p>
                  <p className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-500'} flex items-center gap-2`}>
                    {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Großbuchstabe
                  </p>
                  <p className={`text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-slate-500'} flex items-center gap-2`}>
                    {/[0-9]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Zahl
                  </p>
                  <p className={`text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-slate-500'} flex items-center gap-2`}>
                    {/[^A-Za-z0-9]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Sonderzeichen
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Weiter
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400">oder</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  <Chrome className="h-5 w-5" />
                  Mit Google anmelden
                </button>

                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  <FaApple className="h-5 w-5" />
                  Mit Apple anmelden
                </button>
              </div>

              <div className="text-center text-xs text-slate-500">
                Durch deine Registrierung stimmst du den{' '}
                <a href="/agb" className="text-blue-600 hover:text-blue-700 underline">AGB</a>
                {' '}zu und bestätigst, dass du die{' '}
                <a href="/datenschutz" className="text-blue-600 hover:text-blue-700 underline">Datenschutzerklärung</a>
                {' '}zur Kenntnis genommen hast.
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Bereits registriert? Anmelden
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Name */}
          {step === 'name' && (
            <form onSubmit={handleStepTwo} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zurück
                </button>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Dein Name oder Spitzname?
                </h2>
                <p className="text-sm text-slate-600">
                  Wie möchtest du in deinem Profil genannt werden?
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Name / Spitzname *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="z.B. Max oder Investor2024"
                    required
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Pflichtfeld - Dieser Name wird in deinem Profil angezeigt
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registrieren...</span>
                  </div>
                ) : 'Registrieren'}
              </button>
            </form>
          )}

          {/* STEP 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Fast geschafft!
                </h2>
                <p className="text-slate-600">
                  Du erhältst in Kürze eine Bestätigungs-E-Mail. Bitte klicke auf den darin enthaltenen Link, um dein Konto zu aktivieren.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-900">
                  📧 E-Mail gesendet an: <strong>{email}</strong>
                </p>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Zum Login
              </button>

              <div className="text-sm text-slate-600">
                Du hast keinen Aktivierungslink erhalten?
                <br />
                <button className="text-blue-600 hover:text-blue-700 font-semibold mt-2">
                  Aktivierungslink erneut anfordern
                </button>
              </div>
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
