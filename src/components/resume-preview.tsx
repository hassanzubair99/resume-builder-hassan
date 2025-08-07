'use client';

import React from 'react';
import type { ResumeData } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Linkedin, Globe, User, Briefcase, GraduationCap, Star, LucideProps } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shrink-0">
    {children}
  </div>
);

const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>, children: React.ReactNode}) => (
    <section className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
        </div>
        {children}
    </section>
);


export const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData }, ref) => {
    const { personal, summary, experience, education, skills } = resumeData;

    return (
      <div ref={ref} className="print-card">
        <Card className="w-full max-w-[210mm] mx-auto shadow-lg aspect-[1/1.414] p-8 md:p-12 text-sm">
          <CardContent className="p-0">
            <header className="flex items-center gap-8 mb-8">
              {personal.image && (
                <Avatar className="h-32 w-32 shrink-0">
                  <AvatarImage src={personal.image} alt={personal.name} />
                  <AvatarFallback><User size={48}/></AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold text-primary">{personal.name}</h1>
                <p className="text-xl text-muted-foreground mt-1">{personal.title}</p>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    {personal.email && <div className="flex items-center gap-2"><Mail size={14} className="text-primary"/> {personal.email}</div>}
                    {personal.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/> {personal.phone}</div>}
                    {personal.location && <div className="flex items-center gap-2"><MapPin size={14} className="text-primary"/> {personal.location}</div>}
                    {personal.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} className="text-primary"/> {personal.linkedin}</div>}
                    {personal.website && <div className="flex items-center gap-2"><Globe size={14} className="text-primary"/> {personal.website}</div>}
                </div>
              </div>
            </header>

            <Separator className="my-8" />
            
            <main className="space-y-10">
              <Section title="Summary" icon={User}>
                  <p className="text-muted-foreground leading-relaxed">{summary}</p>
              </Section>
            
              <Section title="Experience" icon={Briefcase}>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-base">{exp.role}</h3>
                        <p className="text-muted-foreground text-xs">{exp.startDate} - {exp.endDate}</p>
                      </div>
                      <p className="text-muted-foreground italic text-sm mb-1">{exp.company}</p>
                      <div className="text-muted-foreground whitespace-pre-wrap pl-4 text-xs">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
              
              <Section title="Education" icon={GraduationCap}>
                 <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-base">{edu.degree}</h3>
                        <p className="text-muted-foreground text-xs">{edu.startDate} - {edu.endDate}</p>
                      </div>
                      <p className="text-muted-foreground italic text-sm mb-1">{edu.institution}</p>
                       <div className="text-muted-foreground whitespace-pre-wrap pl-4 text-xs">
                        {edu.description}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
              
              <Section title="Skills" icon={Star}>
                  <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                          <div key={skill.id} className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                              {skill.name}
                          </div>
                      ))}
                  </div>
              </Section>
            </main>
          </CardContent>
        </Card>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
