'use client';

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, FileText, Wand2 } from 'lucide-react';
import type { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { runEnhanceResume } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

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

const AiFabIcon = () => (
  <>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ai-fab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ef4444' }} />
          <stop offset="25%" style={{ stopColor: '#f97316' }} />
          <stop offset="50%" style={{ stopColor: '#eab308' }} />
          <stop offset="75%" style={{ stopColor: '#22c55e' }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
        </linearGradient>
      </defs>
    </svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="url(#ai-fab-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.79 0 1.55-.1 2.28-.29" />
      <path d="M15.42 4.1a9 9 0 0 1 5.48 3.8" />
      <path d="M12 8a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z" />
      <path d="M12 12v6" />
      <path d="m18 13 1.5-3" />
      <path d="m6 13-1.5-3" />
      <path d="m17 21 3-3" />
    </svg>
  </>
);


export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{ enhancedResume: ResumeData, suggestions: string[] } | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.personal.name.replace(' ', '_')}_Resume`,
  });

  const handleEnhanceResume = async () => {
    setIsEnhancing(true);
    try {
      const result = await runEnhanceResume(resumeData);
      setDialogContent(result);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Enhancement Failed',
        description: 'Could not enhance the resume. Please try again later.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const onApplyEnhancement = () => {
    if (dialogContent) {
      setResumeData(dialogContent.enhancedResume);
      setIsDialogOpen(false);
      toast({
        title: 'Resume Enhanced',
        description: 'Your resume has been updated with AI suggestions.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="rainbow-border">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm shadow-sm no-print rounded-t-lg">
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
      </div>

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

      <div className="ai-fab no-print">
        <button className="ai-fab-button" onClick={handleEnhanceResume} disabled={isEnhancing} title="Enhance Resume with AI">
          <div className="rainbow-border rounded-full w-full h-full">
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
              {isEnhancing ? <span className="ai-fab-loader"></span> : <AiFabIcon />}
            </div>
          </div>
        </button>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Resume Enhancement</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] p-1">
            <div className="overflow-y-auto pr-4">
              <h3 className="font-semibold mb-2 text-lg">AI Suggestions</h3>
              <ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground">
                {dialogContent?.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="overflow-y-auto">
              <h3 className="font-semibold mb-2 text-lg">New Resume Preview</h3>
               {dialogContent && <ResumePreview resumeData={dialogContent.enhancedResume} />}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onApplyEnhancement}><Wand2/> Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
