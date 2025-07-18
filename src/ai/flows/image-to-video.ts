'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on an image and a user prompt.
 *
 * - imageToVideo - A function that handles the video clip creation process.
 */

import {ai} from '@/ai/genkit';
import { downloadFileAsBase64 } from '@/services/storage';
import { ImageToVideoInput, ImageToVideoInputSchema, ImageToVideoOutput, ImageToVideoOutputSchema } from '@/lib/types';

export async function imageToVideo(input: ImageToVideoInput): Promise<ImageToVideoOutput> {
  return imageToVideoFlow(input);
}

const imageToVideoFlow = ai.defineFlow(
  {
    name: 'imageToVideoFlow',
    inputSchema: ImageToVideoInputSchema,
    outputSchema: ImageToVideoOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to imageToVideoFlow. Received: ${JSON.stringify(input)}`);
    }

    const base64Image = await downloadFileAsBase64(input.gcsUri);
    const {media} = await ai.generate({
      model: 'gemini-pro-vision',
      prompt: [
        {media: { inlineData: { data: base64Image, mimeType: input.mimeType } }},
        {text: input.prompt},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
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
