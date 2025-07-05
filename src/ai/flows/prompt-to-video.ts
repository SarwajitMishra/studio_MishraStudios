'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on a user prompt.
 *
 * - promptToVideo - A function that handles the video clip creation process based on a prompt.
 * - PromptToVideoInput - The input type for the promptToVideo function.
 * - PromptToVideoOutput - The return type for the promptToVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptToVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
});
export type PromptToVideoInput = z.infer<typeof PromptToVideoInputSchema>;

const PromptToVideoOutputSchema = z.object({
  videoClipDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt.'
    ),
});
export type PromptToVideoOutput = z.infer<typeof PromptToVideoOutputSchema>;

export async function promptToVideo(input: PromptToVideoInput): Promise<PromptToVideoOutput> {
  return promptToVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptToVideoPrompt',
  input: {schema: PromptToVideoInputSchema},
  output: {schema: PromptToVideoOutputSchema},
  prompt: `You are an AI video editor. Your task is to create a video clip based on the user's prompt.

User Prompt: {{{prompt}}}
Video: {{media url=videoDataUri}}

Create a video clip based on the prompt. Return the video clip as a data URI.`,
});

const promptToVideoFlow = ai.defineFlow(
  {
    name: 'promptToVideoFlow',
    inputSchema: PromptToVideoInputSchema,
    outputSchema: PromptToVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
