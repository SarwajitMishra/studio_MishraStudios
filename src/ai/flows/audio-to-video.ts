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
import { textToVideo } from './text-to-video';

const AudioToVideoInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
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

// For now, this flow will ignore the audio and just use the text prompt to generate a video.
// A more advanced implementation could transcribe the audio to text first.
const audioToVideoFlow = ai.defineFlow(
  {
    name: 'audioToVideoFlow',
    inputSchema: AudioToVideoInputSchema,
    outputSchema: AudioToVideoOutputSchema,
  },
  async (input) => {
    // Note: The audioDataUri is ignored in this basic implementation.
    const result = await textToVideo({ prompt: input.prompt });
    return { videoDataUri: result.videoDataUri };
  }
);
