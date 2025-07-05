'use server';

/**
 * @fileOverview AI agent that automatically generates clip ideas from a video.
 *
 * - generateClipIdeas - A function that generates clip ideas for a video.
 * - GenerateClipIdeasInput - The input type for the generateClipIdeas function.
 * - GenerateClipIdeasOutput - The return type for the generateClipIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClipIdeasInputSchema = z.object({
  videoDescription: z
    .string()
    .describe('The description of the video to generate clip ideas from.'),
});
export type GenerateClipIdeasInput = z.infer<typeof GenerateClipIdeasInputSchema>;

const GenerateClipIdeasOutputSchema = z.object({
  clipIdeas: z
    .array(z.string())
    .describe('An array of clip ideas generated from the video description.'),
});
export type GenerateClipIdeasOutput = z.infer<typeof GenerateClipIdeasOutputSchema>;

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
