'use server';

import { downloadFileAsBase64 } from '@/services/storage';
import { ai } from '@/ai/genkit';
import { VideoScanAnalysisInput, VideoScanAnalysisInputSchema, VideoScanAnalysisOutput, VideoScanAnalysisOutputSchema } from '@/lib/types';

// Define the flow
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

    // Download video from GCS and convert to base64
    console.log('[videoScanAnalysisFlow] Downloading file from GCS:', input.gcsUri);
    const videoBase64 = await downloadFileAsBase64(input.gcsUri);
    console.log('[videoScanAnalysisFlow] File downloaded successfully.');

    const { text } = await ai.generate({
      model: 'gemini-pro-vision',
      prompt: [
        {
          text: `You are an AI video analysis expert. Analyze the uploaded video and suggest up to 5 key moments. Each suggestion should include:
- startTime (in seconds)
- endTime (in seconds)
- description (short)

Respond ONLY with valid JSON in the format:
{
  "suggestedClips": [
    {
      "description": "Intro scene",
      "startTime": 0,
      "endTime": 15
    }
  ]
}`,
        },
        {
          media: {
            url: `data:${input.mimeType};base64,${videoBase64}`,
            contentType: input.mimeType,
          },
        },
      ],
      config: {
        temperature: 0.3,
      },
    });

    console.log('[videoScanAnalysisFlow] Raw model output:', text);

    try {
      // The model returns a string, so we need to parse it as JSON.
      const parsedOutput = JSON.parse(text);
      // Validate the parsed output against our Zod schema.
      return VideoScanAnalysisOutputSchema.parse(parsedOutput);
    } catch (e) {
      console.error('[videoScanAnalysisFlow] Failed to parse model output as JSON:', e);
      throw new Error('The AI model returned an invalid response. Please try again.');
    }
  }
);

// Export a wrapper function that calls the flow
export async function videoScanAnalysis(input: VideoScanAnalysisInput): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysis] Calling flow with input:', input);
  return videoScanAnalysisFlow(input);
}
