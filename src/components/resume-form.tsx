'use client';

import React, { useState } from 'react';
import type { ResumeData, WorkExperience, Education, Skill, PersonalInfo } from '@/types/resume';
import { runOptimizeResumeContent } from '@/app/actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PlusCircle, Trash2, Wand2, User, Briefcase, GraduationCap, Star, Upload } from 'lucide-react';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const { toast } = useToast();
  const [optimizing, setOptimizing] = useState(false);
  const [dialogContent, setDialogContent] = useState({ optimized: '', suggestions: [] as string[] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateCallback, setUpdateCallback] = useState<(newContent: string) => void>(() => () => {});

  const handleChange = (section: keyof ResumeData, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleListItemChange = (
    section: 'experience' | 'education' | 'skills',
    index: number,
    field: string,
    value: string
  ) => {
    setResumeData(prev => {
      const newList = [...prev[section]];
      (newList[index] as any)[field] = value;
      return { ...prev, [section]: newList };
    });
  };

  const addListItem = (section: 'experience' | 'education' | 'skills') => {
    const newItem: WorkExperience | Education | Skill =
      section === 'experience'
        ? { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', description: '' }
        : section === 'education'
        ? { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '', description: '' }
        : { id: crypto.randomUUID(), name: '' };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeListItem = (section: 'experience' | 'education' | 'skills', id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id),
    }));
  };
  
  const handleOptimize = async (content: string, onApply: (newContent: string) => void) => {
    setOptimizing(true);
    try {
      const result = await runOptimizeResumeContent({ resumeContent: content });
      setDialogContent({ optimized: result.optimizedContent, suggestions: result.suggestions });
      setUpdateCallback(() => onApply);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'Could not optimize the content. Please try again later.',
      });
    } finally {
      setOptimizing(false);
    }
  };

  const onApplyOptimization = () => {
    updateCallback(dialogContent.optimized);
    setIsDialogOpen(false);
    toast({
      title: 'Content Updated',
      description: 'Your content has been optimized with AI.',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('personal', 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <Card className="rainbow-shadow">
        <CardContent className="p-0">
          <Accordion type="single" collapsible defaultValue="personal" className="w-full">
            
            <AccordionItem value="personal">
              <AccordionTrigger className="p-6"><div className="flex items-center gap-3"><User />Personal Details</div></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={resumeData.personal.image} alt={resumeData.personal.name} />
                      <AvatarFallback><User size={32}/></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="picture-upload">Profile Picture</Label>
                       <Input id="picture-upload" type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                       <p className="text-xs text-muted-foreground mt-1">Upload a professional headshot.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={resumeData.personal.name} onChange={e => handleChange('personal', 'name', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={resumeData.personal.title} onChange={e => handleChange('personal', 'title', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={resumeData.personal.email} onChange={e => handleChange('personal', 'email', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={resumeData.personal.phone} onChange={e => handleChange('personal', 'phone', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={resumeData.personal.location} onChange={e => handleChange('personal', 'location', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                      <Input id="linkedin" value={resumeData.personal.linkedin} onChange={e => handleChange('personal', 'linkedin', e.target.value)} />
                    </div>
                     <div>
                      <Label htmlFor="website">Website/Portfolio URL</Label>
                      <Input id="website" value={resumeData.personal.website} onChange={e => handleChange('personal', 'website', e.target.value)} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="summary">
              <AccordionTrigger className="p-6"><div className="flex items-center gap-3"><Briefcase />Professional Summary</div></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" value={resumeData.summary} onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))} rows={5} />
                  <Button variant="outline" size="sm" onClick={() => handleOptimize(resumeData.summary, (newContent) => setResumeData(p => ({ ...p, summary: newContent })))} disabled={optimizing}>
                    <Wand2 className="mr-2 h-4 w-4" /> {optimizing ? 'Optimizing...' : 'Optimize with AI'}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger className="p-6"><div className="flex items-center gap-3"><Briefcase />Work Experience</div></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4 rounded-md border p-4 relative">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeListItem('experience', exp.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div><Label>Company</Label><Input value={exp.company} onChange={e => handleListItemChange('experience', index, 'company', e.target.value)} /></div>
                        <div><Label>Role</Label><Input value={exp.role} onChange={e => handleListItemChange('experience', index, 'role', e.target.value)} /></div>
                        <div><Label>Start Date</Label><Input value={exp.startDate} onChange={e => handleListItemChange('experience', index, 'startDate', e.target.value)} /></div>
                        <div><Label>End Date</Label><Input value={exp.endDate} onChange={e => handleListItemChange('experience', index, 'endDate', e.target.value)} /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={exp.description} onChange={e => handleListItemChange('experience', index, 'description', e.target.value)} rows={4} />
                        <Button variant="outline" size="sm" onClick={() => handleOptimize(exp.description, (newContent) => handleListItemChange('experience', index, 'description', newContent))} disabled={optimizing}>
                           <Wand2 className="mr-2 h-4 w-4" /> {optimizing ? 'Optimizing...' : 'Optimize with AI'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addListItem('experience')}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
               <AccordionTrigger className="p-6"><div className="flex items-center gap-3"><GraduationCap />Education</div></AccordionTrigger>
               <AccordionContent className="px-6 pb-6">
                 <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="space-y-4 rounded-md border p-4 relative">
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeListItem('education', edu.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div><Label>Institution</Label><Input value={edu.institution} onChange={e => handleListItemChange('education', index, 'institution', e.target.value)} /></div>
                        <div><Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleListItemChange('education', index, 'degree', e.target.value)} /></div>
                        <div><Label>Start Date</Label><Input value={edu.startDate} onChange={e => handleListItemChange('education', index, 'startDate', e.target.value)} /></div>
                        <div><Label>End Date</Label><Input value={edu.endDate} onChange={e => handleListItemChange('education', index, 'endDate', e.target.value)} /></div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={edu.description} onChange={e => handleListItemChange('education', index, 'description', e.target.value)} rows={2} />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addListItem('education')}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                </div>
               </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="skills">
               <AccordionTrigger className="p-6"><div className="flex items-center gap-3"><Star />Skills</div></AccordionTrigger>
               <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Add your key skills.</p>
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                             <div key={skill.id} className="flex items-center gap-1 rounded-md border bg-secondary p-1">
                                <Input className="h-7 border-0 bg-transparent focus-visible:ring-0" value={skill.name} onChange={e => handleListItemChange('skills', index, 'name', e.target.value)} />
                                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeListItem('skills', skill.id)}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                             </div>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => addListItem('skills')}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                </div>
               </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AI Optimization Suggestions</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
            <div>
              <h3 className="font-semibold mb-2">Suggestions for Improvement:</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {dialogContent.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Optimized Content:</h3>
              <div className="rounded-md border bg-muted p-4 text-sm whitespace-pre-wrap">
                {dialogContent.optimized}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onApplyOptimization}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
