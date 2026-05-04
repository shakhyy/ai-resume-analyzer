'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { API_URL } from '@/lib/api';
import { CloudUpload, FileText, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('Data Scientist');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError('Choose a PDF or DOCX resume first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', jobRole);

    try {
      const response = await fetch(`${API_URL}/resumes/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      router.push(`/analysis/${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <form onSubmit={submit} className="mx-auto max-w-4xl">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-600">Resume Upload</p>
          <h1 className="mt-2 text-3xl font-bold">Analyze a resume</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-300">
            Upload PDF or DOCX, enter a target job role, and receive ATS scoring with specific recommendations.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <label
            className="glass flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 p-8 text-center transition hover:border-sky-400"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setFile(event.dataTransfer.files[0]);
            }}
          >
            <input
              className="hidden"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <span className="grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
              <CloudUpload size={32} />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Drop resume here</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">
              Drag and drop your file or click to browse. Maximum file size is 8MB.
            </p>
            {file && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow dark:bg-white/10 dark:text-white">
                <FileText size={18} />
                {file.name}
              </div>
            )}
          </label>

          <aside className="glass rounded-2xl p-6">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Target Job Role</label>
            <input className="input mt-2" value={jobRole} onChange={(event) => setJobRole(event.target.value)} placeholder="e.g. Data Scientist" />
            <div className="mt-5 space-y-2 text-sm text-slate-500 dark:text-slate-300">
              <p>Supported examples:</p>
              <p className="rounded-lg bg-white/70 p-3 dark:bg-white/10">Data Scientist, Frontend Developer, Backend Developer, Full Stack Developer, Product Manager</p>
            </div>
            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
            <button className="button-primary mt-6 w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" size={18} />}
              Analyze Resume
            </button>
          </aside>
        </div>
      </form>
    </AppShell>
  );
}
