'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing the entire resume using generative AI.
 *
 * The flow accepts the complete resume data, optimizes various sections, and provides overall suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {ResumeData} from '@/types/resume';

const ResumeDataSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string(),
    website: z.string(),
    image: z.string(),
  }),
  summary: z.string(),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),
  skills: z.array(z.object({id: z.string(), name: z.string()})),
});

const EnhanceResumeInputSchema = z.object({
  resume: ResumeDataSchema,
  prompt: z.string().optional().describe("An optional user-provided prompt to guide the AI."),
});

export type EnhanceResumeInput = z.infer<typeof EnhanceResumeInputSchema>;

const EnhanceResumeOutputSchema = z.object({
  enhancedResume: ResumeDataSchema.describe("The fully enhanced resume data, with all text fields optimized."),
  suggestions: z.array(z.string()).describe("A list of specific, high-level suggestions for improving the overall resume."),
});
export type EnhanceResumeOutput = z.infer<typeof EnhanceResumeOutputSchema>;


export async function enhanceResume(input: EnhanceResumeInput): Promise<EnhanceResumeOutput> {
  return enhanceResumeFlow(input);
}

const enhanceResumePrompt = ai.definePrompt({
  name: 'enhanceResumePrompt',
  input: {schema: EnhanceResumeInputSchema},
  output: {schema: EnhanceResumeOutputSchema},
  prompt: `You are an AI resume enhancement expert. Your task is to review the entire resume provided and improve it.
  
  Your response should be structured into two parts:
  1.  'enhancedResume': Return the complete, updated resume JSON object. For each experience entry and the summary, rewrite the text to be more impactful and professional. Use action verbs and quantify achievements where possible. Do not change the structure, only the content of the text fields.
  2.  'suggestions': Provide a list of high-level suggestions that could further improve the resume. This could include advice on content, formatting, or missing information.
  {{#if prompt}}

  Follow these instructions from the user:
  {{prompt}}
  {{/if}}

  Here is the resume data in JSON format:
  {{{jsonStringify resume}}}
  `,
});


const enhanceResumeFlow = ai.defineFlow(
  {
    name: 'enhanceResumeFlow',
    inputSchema: EnhanceResumeInputSchema,
    outputSchema: EnhanceResumeOutputSchema,
  },
  async (input) => {
    const {output} = await enhanceResumePrompt(input);
    return output!;
  }
);
