import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Resume Analyzer',
  description: 'ATS resume scoring, AI analysis, and job match insights.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans text-slate-950 antialiased dark:text-slate-50">{children}</body>
    </html>
  );
}
