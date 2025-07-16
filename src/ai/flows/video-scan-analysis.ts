
'use server';

import { downloadFileAsBase64 } from '@/services/storage';
import { ai } from '@/ai/genkit';
import { VideoScanAnalysisInput, VideoScanAnalysisInputSchema, VideoScanAnalysisOutput, VideoScanAnalysisOutputSchema } from '@/lib/types';

export async function videoScanAnalysis(input: VideoScanAnalysisInput): Promise<VideoScanAnalysisOutput> {
  return videoScanAnalysisFlow(input);
}

const videoScanAnalysisFlow = ai.defineFlow(
  {
    name: 'videoScanAnalysisFlow',
    inputSchema: VideoScanAnalysisInputSchema,
    outputSchema: VideoScanAnalysisOutputSchema,
  },
  async (input) => {
    if (!input?.gcsUri || !input?.mimeType?.startsWith('video/')) {
      throw new Error(`Invalid input: ${JSON.stringify(input)}`);
    }

    // Download video from GCS and convert to base64
    const videoBase64 = await downloadFileAsBase64(input.gcsUri);

    const { output } = await ai.generate({
      model: 'gemini-1.5-flash-preview',
      prompt: [
        {
          text: `You are an AI video analysis expert. Analyze the uploaded video and suggest up to 5 key moments. Each suggestion should include:
- startTime (in seconds)
- endTime (in seconds)
- description (short)

Respond ONLY in this JSON format:
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
            contentType: input.mimeType
          },
        },
      ],
      output: {
        schema: VideoScanAnalysisOutputSchema,
      },
    });

    return output!;
  }
);
