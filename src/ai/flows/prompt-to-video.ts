
'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on a user prompt and an existing video.
 *
 * - promptToVideo - A function that handles the video clip creation process based on a prompt.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { downloadFileAsBase64 } from '@/services/storage';
import { PromptToVideoInput, PromptToVideoInputSchema, PromptToVideoOutput, PromptToVideoOutputSchema } from '@/lib/types';

export async function promptToVideo(input: PromptToVideoInput): Promise<PromptToVideoOutput> {
  return promptToVideoFlow(input);
}

const promptToVideoFlow = ai.defineFlow(
  {
    name: 'promptToVideoFlow',
    inputSchema: PromptToVideoInputSchema,
    outputSchema: PromptToVideoOutputSchema,
  },
  async (input) => {
    if (!input || !input.gcsUri || !input.mimeType) {
      throw new Error(`Invalid input provided to promptToVideoFlow. Received: ${JSON.stringify(input)}`);
    }

    const base64Video = await downloadFileAsBase64(input.gcsUri);
    const { media } = await ai.generate({
      model: googleAI.model('gemini-pro-vision'),
      prompt: [
        { media: { inlineData: { data: base64Video, mimeType: input.mimeType } } },
        { text: `Based on the provided video, generate a new image that matches this style and incorporates the following prompt: ${input.prompt}` },
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

    return { videoClipDataUri: media.url };
  }
);
