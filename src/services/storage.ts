'use server';

import {config} from 'dotenv';
config(); // Ensure environment variables are loaded

import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const bucketName = process.env.GCS_BUCKET_NAME;

if (!projectId || !bucketName) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("GOOGLE_CLOUD_PROJECT_ID or GCS_BUCKET_NAME environment variable is not set. File uploads will fail. Please set them in your .env file.");
  }
}

// Explicitly provide the projectId to the Storage client. This helps resolve
// the correct project and credentials, especially in local development environments.
const storage = new Storage({ projectId });

/**
 * Generates a v4 signed URL for uploading a file to Google Cloud Storage.
 * @param fileName The name of the file to upload.
 * @param mimeType The MIME type of the file.
 * @returns A promise that resolves to the signed URL and the GCS URI.
 */
export async function generateV4UploadSignedUrl(fileName: string, mimeType: string): Promise<{ uploadUrl: string; gcsUri: string }> {
  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME environment variable is not set.");
  }
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: mimeType,
  };

  const [uploadUrl] = await file.getSignedUrl(options);
  const gcsUri = `gs://${bucketName}/${fileName}`;

  return { uploadUrl, gcsUri };
}

/**
 * Downloads a file from Google Cloud Storage and returns it as a Base64 encoded string.
 * @param gcsUri The GCS URI of the file to download (e.g., 'gs://bucket-name/file-name').
 * @returns A promise that resolves to the Base64 encoded content of the file.
 */
export async function downloadFileAsBase64(gcsUri: string): Promise<string> {
    const match = gcsUri.match(/^gs:\/\/([^\/]+)\/(.+)$/);
    if (!match) {
        throw new Error(`Invalid GCS URI format. Expected 'gs://<bucket-name>/<file-name>'. Received: '${gcsUri}'`);
    }

    const bucketNameFromUri = match[1];
    const fileName = match[2];

    const file = storage.bucket(bucketNameFromUri).file(fileName);
    try {
        const [contents] = await file.download();
        return contents.toString('base64');
    } catch (error: any) {
        console.error(`GCS download failed for URI: ${gcsUri}. Error: ${error.message}`);
        throw new Error(`Failed to download file from GCS: ${error.message}`);
    }
}
