'use server';

import { Storage } from '@google-cloud/storage';

const credentials =
  process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    ? {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    : undefined;

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials,
});

const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("GCS_BUCKET_NAME environment variable is not set. File uploads will fail. Please set it in your .env file.");
  }
}

/**
 * Generates a v4 signed URL for uploading a file to Google Cloud Storage.
 * @param fileName The name of the file to upload.
 * @param contentType The MIME type of the file.
 * @returns A promise that resolves to the signed URL and the GCS URI.
 */
export async function generateV4UploadSignedUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; gcsUri: string }> {
  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME environment variable is not set.");
  }
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  };

  const [uploadUrl] = await file.getSignedUrl(options);
  const gcsUri = `gs://${bucketName}/${fileName}`;

  return { uploadUrl, gcsUri };
}
