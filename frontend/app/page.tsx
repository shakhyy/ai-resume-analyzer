'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Brain, CheckCircle2, FileUp, Sparkles } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'ATS Score', copy: 'Score resumes across keywords, skills, experience, and formatting.' },
  { icon: Brain, title: 'AI Suggestions', copy: 'Find weak sections and generate sharper resume content.' },
  { icon: FileUp, title: 'PDF or DOCX', copy: 'Upload, parse, and save resume history in one workflow.' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#dff3ff,transparent_35%),linear-gradient(180deg,#ffffff,#eff6ff)] text-slate-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-lg bg-sky-600 text-white">
            <Sparkles size={20} />
          </span>
          AI Resume Analyzer
        </Link>
        <div className="flex gap-3">
          <Link className="button-secondary" href="/login">
            Login
          </Link>
          <Link className="button-primary" href="/signup">
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-14 pt-10 lg:min-h-[calc(100vh-82px)] lg:grid-cols-[1fr_.9fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
            <CheckCircle2 size={16} />
            Resume intelligence for modern job seekers
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-normal text-slate-950 md:text-7xl">
            AI Resume Analyzer
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload your resume, get a precise ATS score, see missing skills for your target role, and generate stronger resume content in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary" href="/signup">
              Analyze My Resume <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary" href="/login">
              View Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="glass rounded-2xl p-5 shadow-glow"
        >
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">ATS Score</p>
                <p className="text-5xl font-bold text-sky-600">78/100</p>
              </div>
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">Strong match</div>
            </div>
            <div className="mt-6 space-y-3">
              {['Keywords', 'Skills', 'Experience', 'Formatting'].map((label, index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>{label}</span>
                    <span>{[24, 21, 18, 15][index]}/25</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-sky-500" style={{ width: `${[88, 80, 72, 64][index]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-100 bg-white p-4">
                <feature.icon className="mb-3 text-sky-600" size={22} />
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
