'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating summaries or specific instructions for a video clip based on a user-provided prompt.
 *
 * - generatePromptBasedSummary -  A function that takes a video and prompt, and returns a summary based on that prompt.
 */

import {ai} from '@/ai/genkit';
import { PromptBasedSummaryInput, PromptBasedSummaryInputSchema, PromptBasedSummaryOutput, PromptBasedSummaryOutputSchema } from '@/lib/types';

export async function generatePromptBasedSummary(
  input: PromptBasedSummaryInput
): Promise<PromptBasedSummaryOutput> {
  return promptBasedSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptBasedSummaryPrompt',
  input: {schema: PromptBasedSummaryInputSchema},
  output: {schema: PromptBasedSummaryOutputSchema},
  prompt: `You are an expert video editor. Based on the video clip and the prompt, generate a summary or specific instructions for the clip.

Video: {{media url=videoDataUri}}
Prompt: {{{prompt}}}

Summary: `,
});

const promptBasedSummaryFlow = ai.defineFlow(
  {
    name: 'promptBasedSummaryFlow',
    inputSchema: PromptBasedSummaryInputSchema,
    outputSchema: PromptBasedSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
