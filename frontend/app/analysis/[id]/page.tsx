'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { apiFetch, reportUrl } from '@/lib/api';
import { ResumeAnalysis } from '@/lib/types';
import { BarChart3, Brain, BriefcaseBusiness, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const [resume, setResume] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [improving, setImproving] = useState(false);

  useEffect(() => {
    apiFetch<ResumeAnalysis>(`/resumes/${params.id}`)
      .then(setResume)
      .finally(() => setLoading(false));
  }, [params.id]);

  async function improve() {
    setImproving(true);
    const data = await apiFetch<{ improvedResume: string }>(`/resumes/${params.id}/improve`, {
      method: 'POST'
    });
    setResume((current) =>
      current ? { ...current, analysis: { ...current.analysis, improvedResume: data.improvedResume } } : current
    );
    setImproving(false);
  }

  function downloadReport() {
    const token = localStorage.getItem('token');
    fetch(reportUrl(params.id), { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume-analysis.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  if (loading) {
    return (
      <AppShell>
        <div className="glass rounded-2xl p-8">Loading analysis...</div>
      </AppShell>
    );
  }

  if (!resume) {
    return (
      <AppShell>
        <div className="glass rounded-2xl p-8">Analysis not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="glass rounded-2xl p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-600">ATS Score</p>
          <div className="mt-5 grid place-items-center">
            <div className="grid size-48 place-items-center rounded-full border-[14px] border-sky-200 bg-white text-center shadow-inner dark:border-sky-500/30 dark:bg-white/10">
              <div>
                <p className="text-5xl font-bold text-sky-600 dark:text-sky-200">{resume.analysis.atsScore}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">out of 100</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {Object.entries(resume.analysis.scoreBreakdown).map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm font-semibold capitalize">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-sky-500" style={{ width: `${Math.min(100, Number(value) * 4)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={downloadReport} className="button-secondary mt-6 w-full">
            <Download size={18} />
            Download PDF Report
          </button>
        </aside>

        <section className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Analysis Result</p>
                <h1 className="mt-2 text-3xl font-bold">{resume.parsed.name || resume.originalName}</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-300">
                  Target role: {resume.jobRole || 'General'} • Job Match: {resume.analysis.jobMatchPercentage}%
                </p>
              </div>
              <button onClick={improve} className="button-primary" disabled={improving}>
                {improving ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                Generate Improved Resume
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel icon={Sparkles} title="Extracted Skills" items={resume.parsed.skills} />
            <Panel icon={BriefcaseBusiness} title="Missing Skills" items={resume.analysis.missingSkills} />
            <Panel icon={Brain} title="Suggestions" items={resume.analysis.suggestions} />
            <Panel icon={BarChart3} title="Weak Sections" items={resume.analysis.weakSections} />
          </div>

          {resume.analysis.improvedResume && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold">Improved Resume Content</h2>
              <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-5 text-sm leading-7 text-slate-50">
                {resume.analysis.improvedResume}
              </pre>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Panel({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
          <Icon size={20} />
        </span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span key={item} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-100">
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">None identified.</p>
        )}
      </div>
    </div>
  );
}
