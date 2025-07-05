'use server';
/**
 * @fileOverview Converts text to speech using Genkit and supports multi-language and regional voices.
 *
 * - textToSpeechNarration - A function that converts the given text into speech and returns the audio data URI.
 * - TextToSpeechNarrationInput - The input type for the textToSpeechNarration function.
 * - TextToSpeechNarrationOutput - The return type for the textToSpeechNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TextToSpeechNarrationInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.string().describe('The name of the voice to use. e.g. Algenib, Achernar'),
});
export type TextToSpeechNarrationInput = z.infer<typeof TextToSpeechNarrationInputSchema>;

const TextToSpeechNarrationOutputSchema = z.object({
  media: z.string().describe('The audio data URI in WAV format.'),
});
export type TextToSpeechNarrationOutput = z.infer<typeof TextToSpeechNarrationOutputSchema>;

export async function textToSpeechNarration(input: TextToSpeechNarrationInput): Promise<TextToSpeechNarrationOutput> {
  return textToSpeechNarrationFlow(input);
}

const textToSpeechNarrationFlow = ai.defineFlow(
  {
    name: 'textToSpeechNarrationFlow',
    inputSchema: TextToSpeechNarrationInputSchema,
    outputSchema: TextToSpeechNarrationOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: input.voiceName},
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
