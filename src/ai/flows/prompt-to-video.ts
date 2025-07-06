'use server';

/**
 * @fileOverview An AI agent that creates a video clip based on a user prompt and an existing video.
 *
 * - promptToVideo - A function that handles the video clip creation process based on a prompt.
 * - PromptToVideoInput - The input type for the promptToVideo function.
 * - PromptToVideoOutput - The return type for the promptToVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { textToVideo } from './text-to-video';

const PromptToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  contentType: z.string().describe('The MIME type of the video file.'),
});
export type PromptToVideoInput = z.infer<typeof PromptToVideoInputSchema>;

const PromptToVideoOutputSchema = z.object({
  videoClipDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt.'
    ),
});
export type PromptToVideoOutput = z.infer<typeof PromptToVideoOutputSchema>;

export async function promptToVideo(input: PromptToVideoInput): Promise<PromptToVideoOutput> {
  return promptToVideoFlow(input);
}

// For now, this flow will ignore the uploaded video and just use the text prompt to generate a new clip.
// A more advanced implementation could use the video as context for generation.
const promptToVideoFlow = ai.defineFlow(
  {
    name: 'promptToVideoFlow',
    inputSchema: PromptToVideoInputSchema,
    outputSchema: PromptToVideoOutputSchema,
  },
  async (input) => {
    // Note: The gcsUri is ignored in this basic implementation, but contentType is required for consistency.
    const result = await textToVideo({ prompt: input.prompt });
    return { videoClipDataUri: result.videoDataUri };
  }
);
