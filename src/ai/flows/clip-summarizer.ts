'use server';

/**
 * @fileOverview An AI agent that summarizes a video clip.
 *
 * - clipSummarizer - A function that handles the video summarization process.
 * - ClipSummarizerInput - The input type for the clipSummarizer function.
 * - ClipSummarizerOutput - The return type for the clipSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClipSummarizerInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video clip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClipSummarizerInput = z.infer<typeof ClipSummarizerInputSchema>;

const ClipSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video clip.'),
});
export type ClipSummarizerOutput = z.infer<typeof ClipSummarizerOutputSchema>;

export async function clipSummarizer(
  input: ClipSummarizerInput
): Promise<ClipSummarizerOutput> {
  return clipSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clipSummarizerPrompt',
  input: {schema: ClipSummarizerInputSchema},
  output: {schema: ClipSummarizerOutputSchema},
  prompt: `You are an expert video analyst. Analyze the provided video clip and generate a concise summary of its content.

Video: {{media url=videoDataUri}}

Return only the summary text.`,
});

const clipSummarizerFlow = ai.defineFlow(
  {
    name: 'clipSummarizerFlow',
    inputSchema: ClipSummarizerInputSchema,
    outputSchema: ClipSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
