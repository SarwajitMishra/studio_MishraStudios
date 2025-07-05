'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating summaries or specific instructions for a video clip based on a user-provided prompt.
 *
 * - generatePromptBasedSummary -  A function that takes a video and prompt, and returns a summary based on that prompt.
 * - PromptBasedSummaryInput - The input type for the generatePromptBasedSummary function.
 * - PromptBasedSummaryOutput - The return type for the generatePromptBasedSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptBasedSummaryInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video clip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('The prompt to use to generate the summary.'),
});
export type PromptBasedSummaryInput = z.infer<typeof PromptBasedSummaryInputSchema>;

const PromptBasedSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the video clip.'),
});
export type PromptBasedSummaryOutput = z.infer<typeof PromptBasedSummaryOutputSchema>;

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
