'use server';

/**
 * @fileOverview AI agent that automatically generates clip ideas from a video.
 *
 * - generateClipIdeas - A function that generates clip ideas for a video.
 */

import {ai} from '@/ai/genkit';
import { GenerateClipIdeasInput, GenerateClipIdeasInputSchema, GenerateClipIdeasOutput, GenerateClipIdeasOutputSchema } from '@/lib/types';

export async function generateClipIdeas(input: GenerateClipIdeasInput): Promise<GenerateClipIdeasOutput> {
  return generateClipIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClipIdeasPrompt',
  input: {schema: GenerateClipIdeasInputSchema},
  output: {schema: GenerateClipIdeasOutputSchema},
  prompt: `You are a creative video editor who is skilled at coming up with engaging clip ideas.

  Given the description of the video, generate a list of clip ideas that would be interesting to viewers.
  Return the clip ideas as an array of strings.

  Video Description: {{{videoDescription}}}
  `,
});

const generateClipIdeasFlow = ai.defineFlow(
  {
    name: 'generateClipIdeasFlow',
    inputSchema: GenerateClipIdeasInputSchema,
    outputSchema: GenerateClipIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
