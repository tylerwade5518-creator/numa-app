'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Step = 1 | 2 | 3;

type AccountForm = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type BirthForm = {
  day: string;
  month: string;
  year: string;
};

type StoredProfile = {
  bandId: string;
  account: AccountForm;
  birth: BirthForm;
  sign: string;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Simple year range – you can adjust later if you want
const years = Array.from({ length: 70 }, (_, i) => `${1955 + i}`);

function getZodiacSign(monthIndex: number, day: number): string {
  // monthIndex: 0–11 (0 = Jan)
  if ((monthIndex === 0 && day >= 20) || (monthIndex === 1 && day <= 18)) return 'Aquarius';
  if ((monthIndex === 1 && day >= 19) || (monthIndex === 2 && day <= 20)) return 'Pisces';
  if ((monthIndex === 2 && day >= 21) || (monthIndex === 3 && day <= 19)) return 'Aries';
  if ((monthIndex === 3 && day >= 20) || (monthIndex === 4 && day <= 20)) return 'Taurus';
  if ((monthIndex === 4 && day >= 21) || (monthIndex === 5 && day <= 20)) return 'Gemini';
  if ((monthIndex === 5 && day >= 21) || (monthIndex === 6 && day <= 22)) return 'Cancer';
  if ((monthIndex === 6 && day >= 23) || (monthIndex === 7 && day <= 22)) return 'Leo';
  if ((monthIndex === 7 && day >= 23) || (monthIndex === 8 && day <= 22)) return 'Virgo';
  if ((monthIndex === 8 && day >= 23) || (monthIndex === 9 && day <= 22)) return 'Libra';
  if ((monthIndex === 9 && day >= 23) || (monthIndex === 10 && day <= 21)) return 'Scorpio';
  if ((monthIndex === 10 && day >= 22) || (monthIndex === 11 && day <= 21)) return 'Sagittarius';
  return 'Capricorn';
}

export default function SetupClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bandId = searchParams.get('band') || '';

  const [step, setStep] = useState<Step>(1);
  const [account, setAccount] = useState<AccountForm>({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [birth, setBirth] = useState<BirthForm>({
    day: '',
    month: '',
    year: '',
  });
  const [sign, setSign] = useState<string>('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Prefill if we already set this band up on this device (local-only for now)
  useEffect(() => {
    if (!bandId) return;
    if (typeof window === 'undefined') return;
    const key = `numa_band_profile_${bandId}`;
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredProfile;
        setAccount(parsed.account);
        setBirth(parsed.birth);
        setSign(parsed.sign);
        setStep(3); // treat as already synced, show review
      } catch {
        // ignore parse error
      }
    }
  }, [bandId]);

  const hasValidBirthdate = useMemo(() => {
    const monthIndex = months.indexOf(birth.month);
    const dayNum = Number(birth.day);
    const yearNum = Number(birth.year);
    if (monthIndex < 0 || !dayNum || !yearNum) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    return true;
  }, [birth]);

  useEffect(() => {
    if (!hasValidBirthdate) {
      setSign('');
      return;
    }
    const monthIndex = months.indexOf(birth.month);
    const dayNum = Number(birth.day);
    const zodiac = getZodiacSign(monthIndex, dayNum);
    setSign(zodiac);
  }, [birth, hasValidBirthdate]);

  if (!bandId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-100">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 text-center border border-slate-700/70">
          <h1 className="text-xl font-semibold mb-2">No Band Detected</h1>
          <p className="text-sm text-slate-300">
            This setup link is missing a band ID. Try tapping your NUMA Band again to start setup.
          </p>
        </div>
      </div>
    );
  }

  const onAccountChange =
    (field: keyof AccountForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAccount(prev => ({ ...prev, [field]: e.target.value }));
    };

  const onBirthChange =
    (field: keyof BirthForm) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBirth(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleNextFromAccount = () => {
    setError(null);
    if (!account.name.trim() || !account.username.trim() || !account.email.trim() || !account.password.trim()) {
      setError('Please fill in all fields to continue.');
      return;
    }
    // basic username format check
    if (!/^[a-zA-Z0-9._-]+$/.test(account.username)) {
      setError('Username can only contain letters, numbers, dots, dashes, and underscores.');
      return;
    }
    setStep(2);
  };

  const handleNextFromStarSync = () => {
    setError(null);
    if (!hasValidBirthdate || !sign) {
      setError('Choose a valid birthdate so we can complete Star Sync.');
      return;
    }
    setStep(3);
  };

  const handleFinish = () => {
    setError(null);
    if (!agree) {
      setError('Please confirm that you want to link this band to your account.');
      return;
    }
    setSubmitting(true);
    try {
      if (typeof window !== 'undefined') {
        const payload: StoredProfile = {
          bandId,
          account,
          birth,
          sign,
        };
        const key = `numa_band_profile_${bandId}`;
        window.localStorage.setItem(key, JSON.stringify(payload));
      }
      router.replace(`/dashboard?band=${encodeURIComponent(bandId)}`);
    } catch (e) {
      setSubmitting(false);
      setError('Something went wrong finishing setup. Please try again.');
    }
  };

  // small helper for starry background
  const BackgroundStars = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.55),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(30,64,175,0.55),_transparent_55%)] opacity-80" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      {/* a couple of tiny “stars” */}
      <div className="absolute top-12 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
      <div className="absolute top-24 right-16 w-1 h-1 bg-white/80 rounded-full animate-pulse" />
      <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-white/70 rounded-full animate-pulse" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-slate-100 flex items-center justify-center px-4 py-10">
      <BackgroundStars />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 border border-slate-700/70 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        {/* Header / progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {step === 1 && 'Step 1 of 3 • Claim Your Band'}
            {step === 2 && 'Step 2 of 3 • Star Sync'}
            {step === 3 && 'Step 3 of 3 • Review & Enter'}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Band • <span className="text-slate-300">{bandId}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-800/80 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-sky-400 transition-all duration-500"
            style={{
              width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
            }}
          />
        </div>

        {/* Content per step */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Who&apos;s this band for?</h1>
            <p className="text-sm text-slate-300 mb-6">
              We&apos;ll link this band to your NUMA account so only you control its taps,
              dashboard, and stardust insights.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={account.name}
                  onChange={onAccountChange('name')}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Lyra"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  @Username
                </label>
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                  <span className="pl-3 pr-1 text-slate-500 text-sm">@</span>
                  <input
                    type="text"
                    value={account.username}
                    onChange={onAccountChange('username')}
                    className="flex-1 bg-transparent border-0 outline-none text-sm px-2 py-2.5"
                    placeholder="starlit.lyra"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Your public NUMA handle. We&apos;ll use it later if social features unlock.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={account.email}
                  onChange={onAccountChange('email')}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={account.password}
                  onChange={onAccountChange('password')}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Minimum 8 characters. You&apos;ll use this to sign in later when NUMA expands.
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleNextFromAccount}
              className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
            >
              Next • Star Sync
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Star Sync</h1>
            <p className="text-sm text-slate-300 mb-6">
              Choose your birthdate. We&apos;ll map your solar sign and align your stardust profile.
              Light shooting stars and constellations trace as your sky locks in.
            </p>

            <div className="relative mb-4">
              {/* Wheel-ish layout using three selects */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Month
                  </label>
                  <select
                    value={birth.month}
                    onChange={onBirthChange('month')}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Month</option>
                    {months.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-20">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Day
                  </label>
                  <select
                    value={birth.day}
                    onChange={onBirthChange('day')}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => `${i + 1}`).map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Year
                  </label>
                  <select
                    value={birth.year}
                    onChange={onBirthChange('year')}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Year</option>
                    {years.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3">
              {!hasValidBirthdate || !sign ? (
                <p className="text-xs text-slate-400">
                  Tracing constellations… select your full birthdate to see your solar sign.
                </p>
              ) : (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Constellations aligned
                  </p>
                  <p className="text-lg font-semibold text-slate-50">{sign}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    This is the sign we&apos;ll use to shape your daily dashboard, horoscopes,
                    and stardust discoveries.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextFromStarSync}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
              >
                Lock My Star Sync
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Review & Enter</h1>
            <p className="text-sm text-slate-300 mb-6">
              This is how we&apos;ll register your band and stardust profile before opening
              your dashboard.
            </p>

            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Band Link
                </p>
                <p className="font-mono text-xs text-slate-200">
                  {bandId}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  This band will be tied to your NUMA account.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Account
                </p>
                <p className="text-slate-50">
                  {account.name || '—'}{' '}
                  <span className="text-slate-400">
                    {account.username ? `@${account.username}` : ''}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  {account.email || 'No email set'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Stardust Profile
                </p>
                <p className="text-slate-50">
                  {birth.month || '—'} {birth.day || ''}{birth.day && ','} {birth.year || ''}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Solar Sign: <span className="font-semibold">{sign || '—'}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              />
              <label htmlFor="agree" className="text-xs text-slate-300">
                I understand this NUMA Band will be linked to my account on this device and
                used to open my dashboard and Discover Your Stardust each day.
              </label>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(2);
                }}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
              >
                {submitting ? 'Opening Your Dashboard…' : 'Finish Setup & Open Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
