'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing resume content using generative AI.
 *
 * The flow accepts resume content as input and provides suggestions for improvements to the language, clarity, and organization.
 * It exports the optimizeResumeContent function, OptimizeResumeContentInput, and OptimizeResumeContentOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeContentInputSchema = z.object({
  resumeContent: z.string().describe('The complete text content of the resume to be optimized.'),
});

export type OptimizeResumeContentInput = z.infer<typeof OptimizeResumeContentInputSchema>;

const OptimizeResumeContentOutputSchema = z.object({
  optimizedContent: z.string().describe('The resume content with suggested improvements to language, clarity, and organization.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the resume content.'),
});

export type OptimizeResumeContentOutput = z.infer<typeof OptimizeResumeContentOutputSchema>;

export async function optimizeResumeContent(input: OptimizeResumeContentInput): Promise<OptimizeResumeContentOutput> {
  return optimizeResumeContentFlow(input);
}

const optimizeResumeContentPrompt = ai.definePrompt({
  name: 'optimizeResumeContentPrompt',
  input: {schema: OptimizeResumeContentInputSchema},
  output: {schema: OptimizeResumeContentOutputSchema},
  prompt: `You are an AI resume optimization expert. Your goal is to improve the language, clarity, and organization of the provided resume content.

  Provide the optimized resume content, incorporating your suggestions. Also, provide a list of specific suggestions that you made.

  Resume Content: {{{resumeContent}}}
  `,
});

const optimizeResumeContentFlow = ai.defineFlow(
  {
    name: 'optimizeResumeContentFlow',
    inputSchema: OptimizeResumeContentInputSchema,
    outputSchema: OptimizeResumeContentOutputSchema,
  },
  async input => {
    const {output} = await optimizeResumeContentPrompt(input);
    return output!;
  }
);
