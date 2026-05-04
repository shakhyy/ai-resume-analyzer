'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Home, LogOut, Moon, Upload, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/upload', label: 'Upload', icon: Upload }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff3ff,transparent_32%),linear-gradient(180deg,#f8fafc,#eff6ff)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,.22),transparent_34%),linear-gradient(180deg,#08111f,#0f172a)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/50 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 lg:block">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-lg bg-sky-600 text-white">
            <FileText size={20} />
          </span>
          AI Resume Analyzer
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition dark:text-slate-300',
                pathname === item.href && 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/50 bg-white/65 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50 lg:px-8">
          <Link href="/dashboard" className="font-bold lg:hidden">
            AI Resume Analyzer
          </Link>
          <div className="hidden text-sm text-slate-500 dark:text-slate-400 lg:block">
            ATS scoring, job matching, and AI rewrite tools
          </div>
          <div className="flex items-center gap-2">
            <button className="button-secondary px-3" onClick={toggleTheme} aria-label="Toggle dark mode">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="button-secondary px-3" onClick={logout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <section className="p-4 lg:p-8">{children}</section>
      </div>
    </main>
  );
}
