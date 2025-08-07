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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ThemeToggleButton } from '@/components/theme-toggle';

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
    <Wand2 />
);


export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [dialogContent, setDialogContent] = useState<{ enhancedResume: ResumeData, suggestions: string[] } | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.personal.name.replace(' ', '_')}_Resume`,
  });

  const handleEnhanceClick = () => {
    setIsAiPromptOpen(true);
  };

  const handleRunEnhancement = async () => {
    setIsAiPromptOpen(false);
    setIsEnhancing(true);
    try {
      const result = await runEnhanceResume({ resume: resumeData, prompt: aiPrompt });
      setDialogContent(result);
      setIsResultDialogOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Enhancement Failed',
        description: errorMessage,
      });
    } finally {
      setIsEnhancing(false);
      setAiPrompt('');
    }
  };
  
  const onApplyEnhancement = () => {
    if (dialogContent) {
      setResumeData(dialogContent.enhancedResume);
      setIsResultDialogOpen(false);
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
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <Button onClick={handlePrint}>
                Download PDF
              </Button>
            </div>
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
        <button className="ai-fab-button" onClick={handleEnhanceClick} disabled={isEnhancing} title="Enhance Resume with AI">
          <div className="rainbow-border rounded-full w-full h-full">
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
              {isEnhancing ? <span className="ai-fab-loader"></span> : <AiFabIcon />}
            </div>
          </div>
        </button>
      </div>

      <Dialog open={isAiPromptOpen} onOpenChange={setIsAiPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enhance Resume with AI</DialogTitle>
            <DialogDescription>
              Enter a prompt to guide the AI, or leave it blank for general improvements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ai-prompt" className="text-right">
                Prompt
              </Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 'Make my resume sound more professional for a startup'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiPromptOpen(false)}>Cancel</Button>
            <Button onClick={handleRunEnhancement}>Enhance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
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
