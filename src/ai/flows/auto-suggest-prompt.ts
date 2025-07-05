'use server';

/**
 * @fileOverview Provides auto-suggested prompts as the user types.
 *
 * - autoSuggestPrompt - A function that suggests prompts based on user input.
 * - AutoSuggestPromptInput - The input type for the autoSuggestPrompt function.
 * - AutoSuggestPromptOutput - The return type for the autoSuggestPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoSuggestPromptInputSchema = z.object({
  userInput: z.string().describe('The user input to generate prompts for.'),
});
export type AutoSuggestPromptInput = z.infer<typeof AutoSuggestPromptInputSchema>;

const AutoSuggestPromptOutputSchema = z.object({
  suggestedPrompts: z.array(z.string()).describe('Array of suggested prompts based on the input.'),
});
export type AutoSuggestPromptOutput = z.infer<typeof AutoSuggestPromptOutputSchema>;

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
