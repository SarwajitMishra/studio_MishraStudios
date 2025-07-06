'use server';

/**
 * @fileOverview An AI agent that summarizes a video clip.
 *
 * - clipSummarizer - A function that handles the video summarization process.
 */

import {ai} from '@/ai/genkit';
import { downloadFileAsBase64 } from '@/services/storage';
import { ClipSummarizerInput, ClipSummarizerInputSchema, ClipSummarizerOutput, ClipSummarizerOutputSchema } from '@/lib/types';

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
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to clipSummarizerFlow. Received: ${JSON.stringify(input)}`);
    }

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
