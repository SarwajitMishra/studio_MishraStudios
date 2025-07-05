'use server';

/**
 * @fileOverview An AI agent that generates captions for a video clip.
 *
 * - autoCaption - A function that handles the caption generation process.
 * - AutoCaptionInput - The input type for the autoCaption function.
 * - AutoCaptionOutput - The return type for the autoCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCaptionInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video clip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AutoCaptionInput = z.infer<typeof AutoCaptionInputSchema>;

const AutoCaptionOutputSchema = z.object({
  captions: z.string().describe('The generated captions for the video clip.'),
});
export type AutoCaptionOutput = z.infer<typeof AutoCaptionOutputSchema>;

export async function autoCaption(
  input: AutoCaptionInput
): Promise<AutoCaptionOutput> {
  return autoCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCaptionPrompt',
  input: {schema: AutoCaptionInputSchema},
  output: {schema: AutoCaptionOutputSchema},
  prompt: `You are an expert audio transcriber. Your task is to generate captions for the provided video clip by transcribing its audio content.

Video: {{media url=videoDataUri}}

Return only the transcribed text.`,
});

const autoCaptionFlow = ai.defineFlow(
  {
    name: 'autoCaptionFlow',
    inputSchema: AutoCaptionInputSchema,
    outputSchema: AutoCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
