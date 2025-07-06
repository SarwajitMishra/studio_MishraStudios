'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on an image and a user prompt.
 *
 * - imageToVideo - A function that handles the video clip creation process.
 * - ImageToVideoInput - The input type for the imageToVideo function.
 * - ImageToVideoOutput - The return type for the imageToVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { downloadFileAsBase64 } from '@/services/storage';

const ImageToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the image file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  mimeType: z.string().describe("The MIME type of the image file."),
});
export type ImageToVideoInput = z.infer<typeof ImageToVideoInputSchema>;

const ImageToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt and image.'
    ),
});
export type ImageToVideoOutput = z.infer<typeof ImageToVideoOutputSchema>;

export async function imageToVideo(input: ImageToVideoInput): Promise<ImageToVideoOutput> {
  console.log('[SERVER-DEBUG] imageToVideo flow invoked with input:', JSON.stringify(input, null, 2));
  if (!input || !input.gcsUri || !input.mimeType) {
    console.error('[SERVER-ERROR] Invalid input received in imageToVideo:', input);
    throw new Error('Invalid input: The GCS URI or MIME type is missing for image to video conversion.');
  }
  return imageToVideoFlow(input);
}

const imageToVideoFlow = ai.defineFlow(
  {
    name: 'imageToVideoFlow',
    inputSchema: ImageToVideoInputSchema,
    outputSchema: ImageToVideoOutputSchema,
  },
  async (input) => {
    console.log('[SERVER-DEBUG] imageToVideoFlow started with input:', JSON.stringify(input, null, 2));
    if (!input || !input.gcsUri) {
      throw new Error('Invalid input: GCS URI is missing for image to video conversion.');
    }
    const base64Image = await downloadFileAsBase64(input.gcsUri);
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
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
