'use server';

import {
  enhanceResume,
  type EnhanceResumeInput,
  type EnhanceResumeOutput,
} from '@/ai/flows/enhance-resume';
import {
  optimizeResumeContent,
  type OptimizeResumeContentInput,
  type OptimizeResumeContentOutput,
} from '@/ai/flows/optimize-resume-content';

export async function runOptimizeResumeContent(
  input: OptimizeResumeContentInput
): Promise<OptimizeResumeContentOutput> {
  try {
    const result = await optimizeResumeContent(input);
    if (!result) {
        throw new Error("Received an empty response from the AI service.");
    }
    return result;
  } catch (error) {
    console.error('Error optimizing resume content:', error);
    throw new Error('Failed to optimize content due to a server-side error. Please try again.');
  }
}

export async function runEnhanceResume(
  input: EnhanceResumeInput
): Promise<EnhanceResumeOutput> {
  try {
    const result = await enhanceResume(input);
    if (!result) {
        throw new Error("Received an empty response from the AI service.");
    }
    return result;
  } catch (error) {
    console.error('Error enhancing resume:', error);
    throw new Error('Failed to enhance resume due to a server-side error. Please try again.');
  }
}
