'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { apiFetch } from '@/lib/api';
import { HistoryItem } from '@/lib/types';
import { ArrowRight, BarChart3, Briefcase, Clock, FileUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<HistoryItem[]>('/resumes')
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const latest = history[0];

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold">Resume intelligence workspace</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-300">
                  Upload a resume, choose a target role, and track every analysis in your history.
                </p>
              </div>
              <Link href="/upload" className="button-primary">
                <FileUp size={18} />
                Upload Resume
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Metric icon={BarChart3} label="Latest ATS" value={latest ? `${latest.analysis.atsScore}/100` : '--'} />
            <Metric icon={Briefcase} label="Job Match" value={latest ? `${latest.analysis.jobMatchPercentage}%` : '--'} />
            <Metric icon={Clock} label="Analyses" value={`${history.length}`} />
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <h2 className="text-xl font-bold">Resume History</h2>
            <div className="mt-4 space-y-3">
              {loading && <p className="text-sm text-slate-500">Loading history...</p>}
              {!loading && history.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                  <p className="font-semibold">No analyses yet</p>
                  <p className="mt-1 text-sm text-slate-500">Your uploaded resumes will appear here.</p>
                </div>
              )}
              {history.map((item) => (
                <Link
                  key={item._id}
                  href={`/analysis/${item._id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition hover:border-sky-200 hover:shadow-lg dark:border-white/10 dark:bg-white/10"
                >
                  <div>
                    <p className="font-bold">{item.originalName}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      {item.jobRole || 'General resume'} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-sky-700 dark:text-sky-200">{item.analysis.atsScore}/100</span>
                    <ArrowRight size={18} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">ATS Formula</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Keywords', '30 pts'],
              ['Skills', '25 pts'],
              ['Experience', '25 pts'],
              ['Formatting', '20 pts']
            ].map(([label, score]) => (
              <div key={label} className="flex justify-between rounded-lg bg-white/70 p-3 text-sm font-semibold dark:bg-white/10">
                <span>{label}</span>
                <span className="text-sky-700 dark:text-sky-200">{score}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="text-sky-600 dark:text-sky-300" size={24} />
      <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
