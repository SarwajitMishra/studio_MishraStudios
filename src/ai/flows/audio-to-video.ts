'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on an audio file and a user prompt.
 *
 * - audioToVideo - A function that handles the video clip creation process.
 * - AudioToVideoInput - The input type for the audioToVideo function.
 * - AudioToVideoOutput - The return type for the audioToVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { downloadFileAsBase64 } from '@/services/storage';

const AudioToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the audio file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  mimeType: z.string().describe('The MIME type of the audio file.'),
});
export type AudioToVideoInput = z.infer<typeof AudioToVideoInputSchema>;

const AudioToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt and audio.'
    ),
});
export type AudioToVideoOutput = z.infer<typeof AudioToVideoOutputSchema>;

export async function audioToVideo(input: AudioToVideoInput): Promise<AudioToVideoOutput> {
  return audioToVideoFlow(input);
}

// Updated to use the audio as context for generation.
const audioToVideoFlow = ai.defineFlow(
  {
    name: 'audioToVideoFlow',
    inputSchema: AudioToVideoInputSchema,
    outputSchema: AudioToVideoOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri) {
      throw new Error('Invalid input: GCS URI is missing for audio to video conversion.');
    }
    const base64Audio = await downloadFileAsBase64(input.gcsUri);
    // A more advanced implementation could transcribe the audio to text first.
    // For now, we will use the audio as context for generating a representative image.
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { inlineData: { data: base64Audio, mimeType: input.mimeType } } },
        { text: `Based on the provided audio, generate a new image that visually represents the sound and incorporates the following prompt: ${input.prompt}` },
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
    
    return { videoDataUri: media.url };
  }
);
