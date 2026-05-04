'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { apiFetch, AuthPayload } from '@/lib/api';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch<AuthPayload>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#dff3ff,transparent_34%),linear-gradient(180deg,#ffffff,#eff6ff)] px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-8">
        <Link href="/" className="mb-8 flex items-center gap-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-lg bg-sky-600 text-white">
            <FileText size={20} />
          </span>
          AI Resume Analyzer
        </Link>
        <h1 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {isLogin ? 'Log in to continue analyzing resumes.' : 'Start scoring and improving your resume today.'}
        </p>
        <div className="mt-6 space-y-4">
          <input className="input" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        <button className="button-primary mt-6 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={18} />}
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link className="font-bold text-sky-700" href={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Sign up' : 'Login'}
          </Link>
        </p>
      </form>
    </main>
  );
}
