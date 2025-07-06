'use server';

/**
 * @fileOverview Text-to-Video flow using Gemini 2.0 Flash image generation.
 *
 * - textToVideo - A function that generates a video from a text prompt.
 */

import {ai} from '@/ai/genkit';
import { TextToVideoInput, TextToVideoInputSchema, TextToVideoOutput, TextToVideoOutputSchema } from '@/lib/types';

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
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {videoDataUri: media.url};
  }
);
