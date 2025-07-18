
'use server';

import { ai } from '@/ai/genkit';
import {
  SuggestedClip,
  VideoScanAnalysisInput,
  VideoScanAnalysisInputSchema,
  VideoScanAnalysisOutput,
  VideoScanAnalysisOutputSchema,
} from '@/lib/types';

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
    const { text } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: `You are a video content editor.
Here is a transcript of the video with timestamps:
${simulatedTranscript}

From the transcript, extract up to 5 interesting segments worth clipping. For each, provide:
- startTime in seconds
- endTime in seconds
- short description of why it's important

Respond ONLY with valid JSON in the format:
{
  "suggestedClips": [
    {
      "description": "Intro to the video topic",
      "startTime": 12,
      "endTime": 28
    }
  ]
}`,
      config: { temperature: 0.1 },
    });

    console.log('[videoScanAnalysisFlow] Raw model output:', text);
    let suggestedClips: SuggestedClip[] = [];
    try {
      const parsed = JSON.parse(text);
      suggestedClips = parsed.suggestedClips || [];
    } catch (e) {
      console.error('[videoScanAnalysisFlow] Failed to parse model output:', e);
      // Return an empty array on failure
      suggestedClips = [];
    }

    console.log('[videoScanAnalysisFlow] Final suggested clips:', suggestedClips);
    // Validate the final output against our Zod schema.
    return VideoScanAnalysisOutputSchema.parse({ suggestedClips });
  }
);

// Export a wrapper function that calls the flow
export async function videoScanAnalysis(
  input: VideoScanAnalysisInput
): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysis] Calling flow with input:', input);
  return videoScanAnalysisFlow(input);
}
