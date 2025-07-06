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
import { downloadFileAsBase64 } from '@/services/storage';

const ClipSummarizerInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video clip. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  mimeType: z.string().describe('The MIME type of the video file.'),
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

const clipSummarizerFlow = ai.defineFlow(
  {
    name: 'clipSummarizerFlow',
    inputSchema: ClipSummarizerInputSchema,
    outputSchema: ClipSummarizerOutputSchema,
  },
  async (input) => {
    console.log('[DEBUG] clipSummarizerFlow received input:', input);
    const base64Video = await downloadFileAsBase64(input.gcsUri);
    const { output } = await ai.generate({
      output: { schema: ClipSummarizerOutputSchema },
      prompt: [
        { text: `You are an expert video analyst. Analyze the provided video clip and generate a concise summary of its content. Return only the summary text.` },
        { media: { inlineData: { data: base64Video, mimeType: input.mimeType } } },
      ],
    });
    return output!;
  }
);
