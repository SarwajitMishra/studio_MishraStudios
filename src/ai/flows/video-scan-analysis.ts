
'use server';

import { downloadFileAsBase64 } from '@/services/storage';
import { ai } from '@/ai/genkit';
import { VideoScanAnalysisInput, VideoScanAnalysisInputSchema, VideoScanAnalysisOutput, VideoScanAnalysisOutputSchema } from '@/lib/types';

console.log('[video-scan-analysis.ts] Module loaded.');

export async function videoScanAnalysis(input: VideoScanAnalysisInput): Promise<VideoScanAnalysisOutput> {
  console.log('[videoScanAnalysis] Function called. Running flow with input:', input);
  // Use ai.run to ensure proper Genkit instrumentation
  return await ai.run(
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
      const videoBase64 = await downloadFileAsBase64(input.gcsUri);

      const { text } = await ai.generate({
        model: 'googleai/gemini-pro-vision',
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
          // Higher temperature for more creative/varied descriptions.
          // Keep it reasonable to avoid nonsensical output.
          temperature: 0.3,
        },
      });

      console.log('[videoScanAnalysisFlow] Raw model output text:', text);

      try {
        // The model returns a string, so we need to parse it as JSON.
        const parsedOutput = JSON.parse(text);
        console.log('[videoScanAnalysisFlow] Successfully parsed JSON:', parsedOutput);
        // Validate the parsed output against our Zod schema.
        return VideoScanAnalysisOutputSchema.parse(parsedOutput);
      } catch (e) {
        console.error('[videoScanAnalysisFlow] Failed to parse model output as JSON:', e);
        throw new Error('The AI model returned an invalid response. Please try again.');
      }
    },
    input
  );
}
