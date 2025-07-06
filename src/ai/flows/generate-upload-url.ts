'use server';
/**
 * @fileOverview A flow to generate a signed URL for file uploads.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateV4UploadSignedUrl } from '@/services/storage';

const GenerateUploadUrlInputSchema = z.object({
  fileName: z.string().describe('The name of the file to be uploaded.'),
  mimeType: z.string().describe('The MIME type of the file.'),
});
export type GenerateUploadUrlInput = z.infer<typeof GenerateUploadUrlInputSchema>;

const GenerateUploadUrlOutputSchema = z.object({
  uploadUrl: z.string().describe('The v4 signed URL for uploading the file.'),
  gcsUri: z.string().describe('The GCS URI of the file once uploaded.'),
});
export type GenerateUploadUrlOutput = z.infer<typeof GenerateUploadUrlOutputSchema>;

export async function generateUploadUrl(
  input: GenerateUploadUrlInput
): Promise<GenerateUploadUrlOutput> {
  return generateUploadUrlFlow(input);
}

const generateUploadUrlFlow = ai.defineFlow(
  {
    name: 'generateUploadUrlFlow',
    inputSchema: GenerateUploadUrlInputSchema,
    outputSchema: GenerateUploadUrlOutputSchema,
  },
  async ({ fileName, mimeType }) => {
    return generateV4UploadSignedUrl(fileName, mimeType);
  }
);
