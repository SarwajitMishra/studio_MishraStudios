'use server';

import { downloadFileAsBase64 } from '@/services/storage';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VideoScanAnalysisInputSchema = z.object({
  gcsUri: z
    .string()
    .describe("The GCS URI of the video file to analyze. Format: gs://<bucket>/<file>"),
  mimeType: z
    .string()
    .describe("The MIME type of the video file (e.g., video/mp4)"),
});
export type VideoScanAnalysisInput = z.infer<typeof VideoScanAnalysisInputSchema>;

const SuggestedClipSchema = z.object({
  description: z.string().describe("Description of the clip"),
  startTime: z.number().describe("Start time in seconds"),
  endTime: z.number().describe("End time in seconds"),
});

const VideoScanAnalysisOutputSchema = z.object({
  suggestedClips: z.array(SuggestedClipSchema).describe("List of suggested clips"),
});
export type VideoScanAnalysisOutput = z.infer<typeof VideoScanAnalysisOutputSchema>;

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

    const result = await ai.generate({
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

    return result.output!;
  }
);
