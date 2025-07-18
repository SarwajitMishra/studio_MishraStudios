'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on an audio file and a user prompt.
 *
 * - audioToVideo - A function that handles the video clip creation process.
 */

import {ai} from '@/ai/genkit';
import { downloadFileAsBase64 } from '@/services/storage';
import { AudioToVideoInput, AudioToVideoInputSchema, AudioToVideoOutput, AudioToVideoOutputSchema } from '@/lib/types';

export async function audioToVideo(input: AudioToVideoInput): Promise<AudioToVideoOutput> {
  return audioToVideoFlow(input);
}

const audioToVideoFlow = ai.defineFlow(
  {
    name: 'audioToVideoFlow',
    inputSchema: AudioToVideoInputSchema,
    outputSchema: AudioToVideoOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to audioToVideoFlow. Received: ${JSON.stringify(input)}`);
    }

    const base64Audio = await downloadFileAsBase64(input.gcsUri);
    // A more advanced implementation could transcribe the audio to text first.
    // For now, we will use the audio as context for generating a representative image.
    const { media } = await ai.generate({
      model: 'gemini-2.0-flash-preview-image-generation',
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
