'use server';

/**
 * @fileOverview Provides auto-suggested prompts as the user types.
 *
 * - autoSuggestPrompt - A function that suggests prompts based on user input.
 */

import {ai} from '@/ai/genkit';
import { AutoSuggestPromptInput, AutoSuggestPromptInputSchema, AutoSuggestPromptOutput, AutoSuggestPromptOutputSchema } from '@/lib/types';

export async function autoSuggestPrompt(input: AutoSuggestPromptInput): Promise<AutoSuggestPromptOutput> {
  return autoSuggestPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoSuggestPromptPrompt',
  input: {schema: AutoSuggestPromptInputSchema},
  output: {schema: AutoSuggestPromptOutputSchema},
  prompt: `You are an AI assistant designed to suggest prompts for a video editing application.  Given the user's input, suggest relevant prompts that they can use to edit their video.

User Input: {{{userInput}}}

Respond with a JSON array of strings. Each string is a suggested prompt. Provide at least 3 suggestions.`,
});

const autoSuggestPromptFlow = ai.defineFlow(
  {
    name: 'autoSuggestPromptFlow',
    inputSchema: AutoSuggestPromptInputSchema,
    outputSchema: AutoSuggestPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
