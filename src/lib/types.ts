import {z} from 'genkit';

// From audio-to-video.ts
export const AudioToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the audio file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  mimeType: z.string().describe('The MIME type of the audio file.'),
});
export type AudioToVideoInput = z.infer<typeof AudioToVideoInputSchema>;
export const AudioToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt and audio.'
    ),
});
export type AudioToVideoOutput = z.infer<typeof AudioToVideoOutputSchema>;

// From auto-suggest-prompt.ts
export const AutoSuggestPromptInputSchema = z.object({
  userInput: z.string().describe('The user input to generate prompts for.'),
});
export type AutoSuggestPromptInput = z.infer<typeof AutoSuggestPromptInputSchema>;
export const AutoSuggestPromptOutputSchema = z.object({
  suggestedPrompts: z.array(z.string()).describe('Array of suggested prompts based on the input.'),
});
export type AutoSuggestPromptOutput = z.infer<typeof AutoSuggestPromptOutputSchema>;


// From background-music-generation.ts
export const GenerateBackgroundMusicInputSchema = z.object({
  videoDescription: z
    .string()
    .describe('A description of the video content to generate music for.'),
  musicPreferences: z
    .string()
    .optional()
    .describe('Optional preferences for the background music, such as genre, mood, or instruments.'),
});
export type GenerateBackgroundMusicInput = z.infer<typeof GenerateBackgroundMusicInputSchema>;
export const GenerateBackgroundMusicOutputSchema = z.object({
  musicDataUri: z
    .string()
    .describe(
      'A data URI containing the generated background music in a suitable format (e.g., audio/mpeg;base64,...).'
    ),
  musicDescription: z
    .string()
    .describe('A description of the generated music, including genre, mood, and instruments.'),
});
export type GenerateBackgroundMusicOutput = z.infer<typeof GenerateBackgroundMusicOutputSchema>;


// From clip-summarizer.ts
export const ClipSummarizerInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video clip. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  mimeType: z.string().describe('The MIME type of the video file.'),
});
export type ClipSummarizerInput = z.infer<typeof ClipSummarizerInputSchema>;
export const ClipSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video clip.'),
});
export type ClipSummarizerOutput = z.infer<typeof ClipSummarizerOutputSchema>;


// From create-clip.ts
export const CreateClipInputSchema = z.object({
  gcsUri: z.string().describe("The GCS URI of the source video file."),
  startTime: z.number().describe("The start time of the clip in seconds."),
  endTime: z.number().describe("The end time of the clip in seconds."),
  description: z.string().optional().describe("A description for the new clip."),
});
export type CreateClipInput = z.infer<typeof CreateClipInputSchema>;
export const CreateClipOutputSchema = z.object({
  clippedVideoGcsUri: z.string().describe("The GCS URI of the newly created video clip."),
});
export type CreateClipOutput = z.infer<typeof CreateClipOutputSchema>;


// From generate-clip-ideas.ts
export const GenerateClipIdeasInputSchema = z.object({
  videoDescription: z
    .string()
    .describe('The description of the video to generate clip ideas from.'),
});
export type GenerateClipIdeasInput = z.infer<typeof GenerateClipIdeasInputSchema>;
export const GenerateClipIdeasOutputSchema = z.object({
  clipIdeas: z
    .array(z.string())
    .describe('An array of clip ideas generated from the video description.'),
});
export type GenerateClipIdeasOutput = z.infer<typeof GenerateClipIdeasOutputSchema>;


// From generate-upload-url.ts
export const GenerateUploadUrlInputSchema = z.object({
  fileName: z.string().describe('The name of the file to be uploaded.'),
  mimeType: z.string().describe('The MIME type of the file.'),
});
export type GenerateUploadUrlInput = z.infer<typeof GenerateUploadUrlInputSchema>;
export const GenerateUploadUrlOutputSchema = z.object({
  uploadUrl: z.string().describe('The v4 signed URL for uploading the file.'),
  gcsUri: z.string().describe('The GCS URI of the file once uploaded.'),
});
export type GenerateUploadUrlOutput = z.infer<typeof GenerateUploadUrlOutputSchema>;

// From image-to-video.ts
export const ImageToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the image file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  mimeType: z.string().describe("The MIME type of the image file."),
});
export type ImageToVideoInput = z.infer<typeof ImageToVideoInputSchema>;
export const ImageToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt and image.'
    ),
});
export type ImageToVideoOutput = z.infer<typeof ImageToVideoOutputSchema>;


// From prompt-based-summary.ts
export const PromptBasedSummaryInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video clip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('The prompt to use to generate the summary.'),
});
export type PromptBasedSummaryInput = z.infer<typeof PromptBasedSummaryInputSchema>;
export const PromptBasedSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the video clip.'),
});
export type PromptBasedSummaryOutput = z.infer<typeof PromptBasedSummaryOutputSchema>;


// From prompt-to-video.ts
export const PromptToVideoInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the video file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt for creating the video clip.'),
  mimeType: z.string().describe('The MIME type of the video file.'),
});
export type PromptToVideoInput = z.infer<typeof PromptToVideoInputSchema>;
export const PromptToVideoOutputSchema = z.object({
  videoClipDataUri: z
    .string()
    .describe(
      'A video clip data URI, created based on the user prompt.'
    ),
});
export type PromptToVideoOutput = z.infer<typeof PromptToVideoOutputSchema>;


// From text-to-speech-narration.ts
export const TextToSpeechNarrationInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.string().describe('The name of the voice to use. e.g. Algenib, Achernar'),
});
export type TextToSpeechNarrationInput = z.infer<typeof TextToSpeechNarrationInputSchema>;
export const TextToSpeechNarrationOutputSchema = z.object({
  media: z.string().describe('The audio data URI in WAV format.'),
});
export type TextToSpeechNarrationOutput = z.infer<typeof TextToSpeechNarrationOutputSchema>;


// From text-to-video.ts
export const TextToVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
});
export type TextToVideoInput = z.infer<typeof TextToVideoInputSchema>;
export const TextToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type TextToVideoOutput = z.infer<typeof TextToVideoOutputSchema>;


// From video-scan-analysis.ts
export const SuggestedClipSchema = z.object({
  description: z.string().describe("Description of the clip"),
  startTime: z.number().describe("Start time in seconds"),
  endTime: z.number().describe("End time in seconds"),
});
export type SuggestedClip = z.infer<typeof SuggestedClipSchema>;
export const VideoScanAnalysisInputSchema = z.object({
  gcsUri: z
    .string()
    .describe("The GCS URI of the video file to analyze. Format: gs://<bucket>/<file>"),
  mimeType: z
    .string()
    .describe("The MIME type of the video file (e.g., video/mp4)"),
});
export type VideoScanAnalysisInput = z.infer<typeof VideoScanAnalysisInputSchema>;
export const VideoScanAnalysisOutputSchema = z.object({
  suggestedClips: z.array(SuggestedClipSchema).describe("List of suggested clips"),
});
export type VideoScanAnalysisOutput = z.infer<typeof VideoScanAnalysisOutputSchema>;

// From edit-image-background.ts
export const EditImageBackgroundInputSchema = z.object({
  gcsUri: z
    .string()
    .describe(
      "The GCS URI of the image file. Expected format: 'gs://<bucket-name>/<file-name>'"
    ),
  prompt: z.string().describe('A natural language prompt describing the new background.'),
  mimeType: z.string().describe("The MIME type of the image file."),
});
export type EditImageBackgroundInput = z.infer<typeof EditImageBackgroundInputSchema>;

export const EditImageBackgroundOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'An image data URI with the edited background.'
    ),
});
export type EditImageBackgroundOutput = z.infer<typeof EditImageBackgroundOutputSchema>;


// From page.tsx
export type MediaType = "image" | "video" | "audio";

// From auto-caption.ts (Empty placeholder)
export const AutoCaptionInputSchema = z.object({});
export type AutoCaptionInput = z.infer<typeof AutoCaptionInputSchema>;
export const AutoCaptionOutputSchema = z.object({});
export type AutoCaptionOutput = z.infer<typeof AutoCaptionOutputSchema>;
