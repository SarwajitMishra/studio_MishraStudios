'use server';
/**
 * @fileOverview Converts text to speech using Genkit and supports multi-language and regional voices.
 *
 * - textToSpeechNarration - A function that converts the given text into speech and returns the audio data URI.
 */

import {ai} from '@/ai/genkit';
import wav from 'wav';
import { TextToSpeechNarrationInput, TextToSpeechNarrationInputSchema, TextToSpeechNarrationOutput, TextToSpeechNarrationOutputSchema } from '@/lib/types';

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
