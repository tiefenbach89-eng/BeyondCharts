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

    setStep('name');
  };

  const handleStepTwo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/konto?confirmed=true`,
          data: {
            name: name || null,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 flex items-center justify-center p-6">
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full items-center">

        {/* LEFT SIDE - Registration Form */}
        <div className="w-full max-w-lg mx-auto">

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

            {/* STEP 1: Email + Password */}
            {step === 'credentials' && (
              <form onSubmit={handleStepOne} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Erstelle einen Account
                  </h2>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    E-Mail-Adresse
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="deine@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Mindestens 8 Zeichen"
                      required
                      minLength={8}
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">{getStrengthLabel()}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 space-y-1">
                    <p className={`text-xs ${password.length >= 8 ? 'text-green-400' : 'text-slate-400'} flex items-center gap-2`}>
                      {password.length >= 8 ? <Check className="h-3 w-3" /> : '○'} Mindestens 8, nicht mehr als 72 Zeichen
                    </p>
                    <p className={`text-xs ${/[a-z]/.test(password) ? 'text-green-400' : 'text-slate-400'} flex items-center gap-2`}>
                      {/[a-z]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Kleinbuchstabe
                    </p>
                    <p className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-400'} flex items-center gap-2`}>
                      {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Großbuchstabe
                    </p>
                    <p className={`text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-slate-400'} flex items-center gap-2`}>
                      {/[^A-Za-z0-9]/.test(password) ? <Check className="h-3 w-3" /> : '○'} 1 Sonderzeichen
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Weiter
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

                <div className="text-center text-xs text-slate-400">
                  Durch deine Registrierung stimmst du den{' '}
                  <a href="/agb" className="text-blue-400 hover:text-blue-300 underline">AGB</a>
                  {' '}zu und bestätigst, dass du die{' '}
                  <a href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline">Datenschutzerklärung</a>
                  {' '}zur Kenntnis genommen hast.
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Zurück
                </button>
              </form>
            )}

            {/* STEP 2: Name */}
            {step === 'name' && (
              <form onSubmit={handleStepTwo} className="space-y-6">
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Dein Name oder Spitzname?
                  </h2>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Name / Spitzname
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Wie möchtest du genannt werden?"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Fast geschafft!
                  </h2>
                  <p className="text-slate-400">
                    Du erhältst in Kürze eine Bestätigungs-E-Mail. Bitte klicke auf den darin enthaltenen Link, um dein Konto zu aktivieren.
                  </p>
                </div>

                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Zum Login
                </button>

                <div className="text-sm text-slate-400">
                  Du hast keinen Aktivierungslink erhalten?
                  <br />
                  <button className="text-blue-400 hover:text-blue-300 font-semibold mt-2">
                    Aktivierungslink erneut anfordern
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-white/60 flex items-center justify-center gap-4">
            <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
            <span>•</span>
            <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </div>

        {/* RIGHT SIDE - Illustration & Benefits */}
        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="mb-8">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-sm">PLUS</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Behalte deine Dividenden im Blick
            </h3>
            <p className="text-white/80 text-sm mb-6">
              Berechne deine Dividendenrendite, erhalte Prognosen zu Ausschüttungen und einen Kalender für alle Auszahlungstermine.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm">Premium Analysen & Insights</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm">Echtzeit-Dividendenkalender</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm">Erweiterte Chart-Funktionen</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
