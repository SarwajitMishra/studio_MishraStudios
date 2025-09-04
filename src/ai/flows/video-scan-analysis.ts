
'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  VideoScanAnalysisInput,
  VideoScanAnalysisInputSchema,
  VideoScanAnalysisOutput, VideoScanAnalysisOutputSchema
} from '@/lib/types';

/**
 * This is a wrapper function that is exported from the file.
 * It is responsible for calling the Genkit flow and returning the output.
 * @param input The input for the video scan analysis flow.
 * @returns The output of the video scan analysis flow.
 */
export async function videoScanAnalysis(
  input: VideoScanAnalysisInput
): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysis] Calling flow with input:', input);
  return videoScanAnalysisFlow(input);
}

/**
 * Freemium pipeline: Analyzes video based on simulated transcript only.
 */
async function runTranscriptOnlyFlow(
  input: VideoScanAnalysisInput
): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysisFlow] Running Freemium (audio-only) pipeline.');
  // Step 1: Transcribe audio.
  // In a real implementation, you would use a service like Google Speech-to-Text.
  // We will simulate a transcript for now.
  const simulatedTranscript = `[00:00:12] Welcome to Mishra Studios... 
[00:00:25] Today we are going to learn about AI video editing.
[00:01:40] Here's a powerful editing trick you can use...
[00:02:15] And that's how you create a compelling short clip.`;

  console.log('[videoScanAnalysisFlow] Simulated transcript generated.');

  // Step 2: Pass transcript to an LLM to get clip suggestions.
  const { output } = await ai.generate({
    model: 'gemini-pro',
    prompt: `You are a video content editor.
Here is a transcript of the video with timestamps:
${simulatedTranscript}

From the transcript, extract up to 5 interesting segments worth clipping. For each, provide:
- startTime in seconds
- endTime in seconds
- short description of why it's important

Respond ONLY with valid JSON that conforms to this Zod schema:
{
  "suggestedClips": [
    {
      "description": "string",
      "startTime": "number",
      "endTime": "number"
    }
  ]
}`,
    config: { temperature: 0.1 },
    output: {
      format: 'json',
      schema: VideoScanAnalysisOutputSchema,
    },
  });

  console.log('[videoScanAnalysisFlow] Raw model output for freemium:', output);
  if (!output) {
    console.error('[videoScanAnalysisFlow] Freemium model returned no output.');
    return { suggestedClips: [] };
  }
  
  // The output is already parsed as JSON because of the output format option.
  const suggestedClips = output.suggestedClips;

  console.log('[videoScanAnalysisFlow] Final suggested clips for freemium:', suggestedClips);
  // Validate the final output against our Zod schema.
  return VideoScanAnalysisOutputSchema.parse({ suggestedClips });
}

/**
 * Premium pipeline: Analyzes video using a multimodal (vision) model.
 */
async function runAudioVisualFlow(
  input: VideoScanAnalysisInput
): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysisFlow] Running Premium (audio-visual) pipeline.');
  
  // For premium, we would use a vision model to analyze the video frames directly.
  // This is a placeholder for a more advanced implementation.
  const { output } = await ai.generate({
    model: 'gemini-pro-vision',
    prompt: [
      {
        text: `Analyze this video and identify up to 5 clip-worthy moments.
For each moment, return:
- Start and end time (seconds) as startTime and endTime
- One-sentence description

Focus on:
- Transitions
- Interesting expressions
- Noteworthy quotes
- Visual highlights

Respond ONLY with valid JSON that conforms to this Zod schema:
{
  "suggestedClips": [
    {
      "description": "string",
      "startTime": "number",
      "endTime": "number"
    }
  ]
}`
      },
      { media: { gcsUri: input.gcsUri, mimeType: input.mimeType } }
    ],
    config: { temperature: 0.2 },
    output: {
      format: 'json',
      schema: VideoScanAnalysisOutputSchema,
    }
  });

  console.log('[videoScanAnalysisFlow] Raw model output for premium:', output);
  if (!output) {
    console.error('[videoScanAnalysisFlow] Premium model returned no output.');
    return { suggestedClips: [] };
  }

  return VideoScanAnalysisOutputSchema.parse({ suggestedClips: output.suggestedClips });
}


const videoScanAnalysisFlow = ai.defineFlow(
  {
    name: 'videoScanAnalysisFlow',
    inputSchema: VideoScanAnalysisInputSchema,
    outputSchema: VideoScanAnalysisOutputSchema,
  },
  async (input) => {
    console.log('[videoScanAnalysisFlow] Flow started with input:', input);
    if (!input?.gcsUri || !input?.mimeType?.startsWith('video/')) {
      throw new Error(`Invalid input: ${JSON.stringify(input)}`);
    }

    // Router logic based on the user's plan.
    const plan = input.plan || 'freemium';

    if (plan === 'premium') {
      return runAudioVisualFlow(input);
    } else {
      return runTranscriptOnlyFlow(input);
    }
  }
);
