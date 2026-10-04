'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-8 shadow-sm rounded-2xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-neutral-950">
            RUPESH YADAV CMS
          </h1>
          <p className="text-xs text-neutral-500">
            Authorized administrator access only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO ADMIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
        <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
