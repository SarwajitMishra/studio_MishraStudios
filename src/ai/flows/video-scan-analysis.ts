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

const VideoScanAnalysisInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video file to analyze. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  contentType: z.string().describe('The MIME type of the video file.'),
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
  // DEBUG: Log the input as it arrives at the server-side function.
  console.log('[DEBUG] videoScanAnalysis entry:', JSON.stringify(input, null, 2));

  if (!input.contentType) {
    console.error('[DEBUG] CRITICAL: contentType is missing from input.');
    throw new Error('A contentType is required but was not provided to the videoScanAnalysis flow.');
  }

  return videoScanAnalysisFlow(input);
}

const videoScanAnalysisFlow = ai.defineFlow(
  {
    name: 'videoScanAnalysisFlow',
    inputSchema: VideoScanAnalysisInputSchema,
    outputSchema: VideoScanAnalysisOutputSchema,
  },
  async (input) => {
    // DEBUG: Log the input as it enters the Genkit flow.
    console.log('[DEBUG] videoScanAnalysisFlow execution with input:', JSON.stringify(input, null, 2));

    const promptPayload = [
        { text: `You are an AI video analysis expert. Your task is to analyze the uploaded video and suggest key moments or scenes that might be interesting for the user to include in their video edit. For each suggestion, provide a concise description and its start and end times in seconds. Focus on identifying highlights, memorable scenes, or moments that would capture viewer attention. Limit the list to no more than 5 suggestions.` },
        { media: { url: input.gcsUri, mimeType: input.contentType } },
    ];
    
    // DEBUG: Log the exact object being sent to the AI model. This is the most important log.
    console.log('[DEBUG] Final payload for ai.generate:', JSON.stringify(promptPayload, null, 2));
    
    const { output } = await ai.generate({
      output: { schema: VideoScanAnalysisOutputSchema },
      prompt: promptPayload,
    });
    return output!;
  }
);
