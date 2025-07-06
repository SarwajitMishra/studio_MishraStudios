'use server';
/**
 * @fileOverview A flow to generate a signed URL for file uploads.
 */
import {ai} from '@/ai/genkit';
import { generateV4UploadSignedUrl } from '@/services/storage';
import { GenerateUploadUrlInput, GenerateUploadUrlInputSchema, GenerateUploadUrlOutput, GenerateUploadUrlOutputSchema } from '@/lib/types';

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
