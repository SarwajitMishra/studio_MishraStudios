'use server';

/**
 * @fileOverview Text-to-Video flow using Gemini 2.0 Flash image generation.
 *
 * - textToVideo - A function that generates a video from a text prompt.
 * - TextToVideoInput - The input type for the textToVideo function.
 * - TextToVideoOutput - The return type for the textToVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextToVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
});
export type TextToVideoInput = z.infer<typeof TextToVideoInputSchema>;

const TextToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type TextToVideoOutput = z.infer<typeof TextToVideoOutputSchema>;

export async function textToVideo(input: TextToVideoInput): Promise<TextToVideoOutput> {
  return textToVideoFlow(input);
}

const textToVideoFlow = ai.defineFlow(
  {
    name: 'textToVideoFlow',
    inputSchema: TextToVideoInputSchema,
    outputSchema: TextToVideoOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {videoDataUri: media.url};
  }
);
