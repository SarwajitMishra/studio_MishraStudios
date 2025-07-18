'use server';

import { downloadFileAsBase64 } from '@/services/storage';
import { ai } from '@/ai/genkit';
import { VideoScanAnalysisInput, VideoScanAnalysisInputSchema, VideoScanAnalysisOutput, VideoScanAnalysisOutputSchema, SuggestedClip } from '@/lib/types';

// Simulate fetching user plan. In a real app, this would come from your auth/database.
async function getUserPlan(userId?: string): Promise<'freemium' | 'premium'> {
  // For simulation purposes, we'll default to premium to use the vision model.
  // Change to 'freemium' to test the text-based path.
  return 'premium';
}

// Freemium Pipeline: Text-based analysis
async function runFreemiumFlow(input: VideoScanAnalysisInput): Promise<SuggestedClip[]> {
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
    model: 'gemini-pro',
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

  console.log('[videoScanAnalysisFlow] Freemium raw model output:', text);
  try {
    const parsed = JSON.parse(text);
    return parsed.suggestedClips || [];
  } catch (e) {
    console.error('[videoScanAnalysisFlow] Freemium failed to parse model output:', e);
    return [];
  }
}

// Premium Pipeline: Vision-based analysis
async function runPremiumFlow(input: VideoScanAnalysisInput): Promise<SuggestedClip[]> {
  console.log('[videoScanAnalysisFlow] Running Premium (audio-visual) pipeline.');

  // Step 1: Download video from GCS
  const videoBase64 = await downloadFileAsBase64(input.gcsUri);
  console.log('[videoScanAnalysisFlow] Premium video downloaded from GCS.');

  // Step 2: Analyze with Gemini Pro Vision
  const { text } = await ai.generate({
    model: 'gemini-pro-vision',
    prompt: [
      {
        text: `Analyze this video and identify up to 5 clip-worthy moments.
For each moment, return a start time, end time, and a one-sentence description, focusing on interesting expressions, noteworthy quotes, or visual highlights.

Respond ONLY with valid JSON in the format:
{
  "suggestedClips": [
    {
      "description": "Intro scene",
      "startTime": 0,
      "endTime": 15
    }
  ]
}`
      },
      {
        media: {
          url: `data:${input.mimeType};base64,${videoBase64}`,
          contentType: input.mimeType,
        },
      },
    ],
    config: { temperature: 0.3 },
  });

  console.log('[videoScanAnalysisFlow] Premium raw model output:', text);
  try {
    const parsed = JSON.parse(text);
    return parsed.suggestedClips || [];
  } catch (e) {
    console.error('[videoScanAnalysisFlow] Premium failed to parse model output:', e);
    return [];
  }
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

    const plan = await getUserPlan(); // In a real app, you might pass a userId
    let suggestedClips: SuggestedClip[] = [];

    if (plan === 'freemium') {
      suggestedClips = await runFreemiumFlow(input);
    } else {
      suggestedClips = await runPremiumFlow(input);
    }

    console.log('[videoScanAnalysisFlow] Final suggested clips:', suggestedClips);
    // Validate the final output against our Zod schema.
    return VideoScanAnalysisOutputSchema.parse({ suggestedClips });
  }
);

// Export a wrapper function that calls the flow
export async function videoScanAnalysis(input: VideoScanAnalysisInput): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysis] Calling flow with input:', input);
  return videoScanAnalysisFlow(input);
}
