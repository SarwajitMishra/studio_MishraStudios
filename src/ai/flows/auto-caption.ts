'use server';

/**
 * @fileOverview An AI agent that generates captions for a video clip.
 *
 * - autoCaption - A function that handles the caption generation process.
 */

import {ai} from '@/ai/genkit';
import { downloadFileAsBase64 } from '@/services/storage';
import { AutoCaptionInput, AutoCaptionInputSchema, AutoCaptionOutput, AutoCaptionOutputSchema } from '@/lib/types';

export async function autoCaption(
  input: AutoCaptionInput
): Promise<AutoCaptionOutput> {
  return autoCaptionFlow(input);
}

const autoCaptionFlow = ai.defineFlow(
  {
    name: 'autoCaptionFlow',
    inputSchema: AutoCaptionInputSchema,
    outputSchema: AutoCaptionOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to autoCaptionFlow. Received: ${JSON.stringify(input)}`);
    }

    const base64Video = await downloadFileAsBase64(input.gcsUri);

    const { output } = await ai.generate({
      output: { schema: AutoCaptionOutputSchema },
      prompt: [
        { text: `You are an expert audio transcriber. Your task is to generate captions for the provided video clip by transcribing its audio content. Return only the transcribed text.` },
        { media: { inlineData: { data: base64Video, mimeType: input.mimeType } } },
      ],
    });
    return output!;
  }
);
