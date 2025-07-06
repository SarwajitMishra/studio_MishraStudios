'use server';

/**
 * @fileOverview Analyzes an uploaded video to suggest key moments or scenes.
 *
 * - videoScanAnalysis - A function that handles the video scan analysis process.
 * - VideoScanAnalysisInput - The input type for the videoScanAnalysis function.
 * - VideoScanAnalysisOutput - The return type for the videoScanAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { downloadFileAsBase64 } from '@/services/storage';

const VideoScanAnalysisInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video file to analyze. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  mimeType: z.string().describe('The MIME type of the video file.'),
});
export type VideoScanAnalysisInput = z.infer<typeof VideoScanAnalysisInputSchema>;

const SuggestedClipSchema = z.object({
  description: z
    .string()
    .describe('A concise description of the suggested clip.'),
  startTime: z.number().describe('The start time of the clip in seconds.'),
  endTime: z.number().describe('The end time of the clip in seconds.'),
});

const VideoScanAnalysisOutputSchema = z.object({
  suggestedClips: z
    .array(SuggestedClipSchema)
    .describe('An array of suggested clip ideas based on the video content.'),
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
    const base64Video = await downloadFileAsBase64(input.gcsUri);
    
    const { output } = await ai.generate({
      output: { schema: VideoScanAnalysisOutputSchema },
      prompt: [
        { text: `You are an AI video analysis expert. Your task is to analyze the uploaded video and suggest key moments or scenes that might be interesting for the user to include in their video edit. For each suggestion, provide a concise description and its start and end times in seconds. Focus on identifying highlights, memorable scenes, or moments that would capture viewer attention. Limit the list to no more than 5 suggestions.` },
        { media: { inlineData: { data: base64Video, mimeType: input.mimeType } } },
      ],
    });
    return output!;
  }
);
