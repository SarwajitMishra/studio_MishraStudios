'use server';

/**
 * @fileOverview An AI agent that edits the background of an image based on a user prompt.
 *
 * - editImageBackground - A function that handles the background editing process.
 */

import {ai} from '@/ai/genkit';
import { downloadFileAsBase64 } from '@/services/storage';
import { EditImageBackgroundInput, EditImageBackgroundInputSchema, EditImageBackgroundOutput, EditImageBackgroundOutputSchema } from '@/lib/types';

export async function editImageBackground(input: EditImageBackgroundInput): Promise<EditImageBackgroundOutput> {
  return editImageBackgroundFlow(input);
}

const editImageBackgroundFlow = ai.defineFlow(
  {
    name: 'editImageBackgroundFlow',
    inputSchema: EditImageBackgroundInputSchema,
    outputSchema: EditImageBackgroundOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to editImageBackgroundFlow. Received: ${JSON.stringify(input)}`);
    }

    const base64Image = await downloadFileAsBase64(input.gcsUri);
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { inlineData: { data: base64Image, mimeType: input.mimeType } } },
        { text: `Edit the image to change its background. Keep the main subject as is, but replace the background based on the following description: "${input.prompt}".` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return { imageDataUri: media.url };
  }
);
