'use client';

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, FileText } from 'lucide-react';

import type { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';

const initialResumeData: ResumeData = {
  personal: {
    name: 'Your Name',
    title: 'Your Title (e.g., Software Engineer)',
    email: 'your.email@example.com',
    phone: '(123) 456-7890',
    location: 'Your City, State',
    linkedin: 'linkedin.com/in/yourprofile',
    website: 'yourportfolio.com',
    image: '',
  },
  summary:
    'A brief summary about your professional background, skills, and career goals. Tailor this to the job you are applying for.',
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Sample Company Inc.',
      role: 'Software Engineer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: '- Developed and maintained web applications using React, Node.js, and TypeScript.\n- Collaborated with cross-functional teams to define, design, and ship new features.\n- Improved application performance by 20% through code optimization.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      startDate: 'Sep 2018',
      endDate: 'May 2022',
      description: '- Graduated with honors.\n- Member of the coding club.',
    },
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'React' },
    { id: crypto.randomUUID(), name: 'TypeScript' },
    { id: crypto.randomUUID(), name: 'Node.js' },
    { id: crypto.randomUUID(), name: 'Next.js' },
    { id: crypto.randomUUID(), name: 'Tailwind CSS' },
  ],
};

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.personal.name.replace(' ', '_')}_Resume`,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm shadow-sm no-print">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Resume Architect
            </h1>
          </div>
          <Button onClick={handlePrint}>
            <Download />
            Download PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="no-print">
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>
          <div className="print-container">
            <ResumePreview ref={previewRef} resumeData={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
