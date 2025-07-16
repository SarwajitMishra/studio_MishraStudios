
'use server';

import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName = process.env.GCS_BUCKET_NAME || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const googleApplicationCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!projectId || !bucketName) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("Project ID or GCS Bucket Name environment variable is not set. File uploads will fail. Please set them in your .env.local file.");
  }
}

// Explicitly provide credentials if the environment variable is set.
// This is crucial for local development and environments without ADC.
const storage = new Storage({ 
  projectId,
  keyFilename: googleApplicationCredentials 
});

/**
 * Generates a v4 signed URL for uploading a file to Google Cloud Storage.
 * @param fileName The name of the file to upload.
 * @param mimeType The MIME type of the file.
 * @returns A promise that resolves to the signed URL and the GCS URI.
 */
export async function generateV4UploadSignedUrl(fileName: string, mimeType: string): Promise<{ uploadUrl: string; gcsUri: string }> {
  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.");
  }
  
  if (!googleApplicationCredentials && process.env.NODE_ENV === 'development') {
    console.warn("GOOGLE_APPLICATION_CREDENTIALS is not set. URL signing will likely fail. Please provide a service account key file path in your .env.local file.");
  }

  // Defensively remove any "gs://" prefix from the bucket name to prevent duplication.
  const cleanBucketName = bucketName.replace(/^gs:\/\//, '');

  const bucket = storage.bucket(cleanBucketName);
  const file = bucket.file(fileName);

  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: mimeType,
  };

  try {
    const [uploadUrl] = await file.getSignedUrl(options);
    const gcsUri = `gs://${cleanBucketName}/${fileName}`;
    return { uploadUrl, gcsUri };
  } catch (error: any) {
    console.error("Error generating signed URL:", error.message);
    if (error.message.includes('client_email')) {
        throw new Error("Failed to sign URL. Make sure your GOOGLE_APPLICATION_CREDENTIALS service account key is correctly configured and has 'Service Account Token Creator' role.");
    }
    throw error;
  }
}

/**
 * Downloads a file from Google Cloud Storage and returns it as a Base64 encoded string.
 * @param gcsUri The GCS URI of the file to download (e.g., 'gs://bucket-name/file-name').
 * @returns A promise that resolves to the Base64 encoded content of the file.
 */
export async function downloadFileAsBase64(gcsUri: string): Promise<string> {
    if (!gcsUri) {
        throw new Error('GCS URI is empty or undefined.');
    }

    // A more robust regex to capture bucket and file path
    const match = gcsUri.match(/^gs:\/\/([a-zA-Z0-9._-]+)\/(.+)$/);
    if (!match) {
        throw new Error(`Invalid GCS URI format. Expected 'gs://<bucket-name>/<file-name>'. Received: '${gcsUri}'`);
    }
    
    const [, bucketNameFromUri, fileName] = match;

    if (!bucketNameFromUri) {
        throw new Error(`Could not parse bucket name from URI: '${gcsUri}'`);
    }
    if (!fileName) {
        throw new Error(`Could not parse file name from URI: '${gcsUri}'`);
    }
    
    try {
        const file = storage.bucket(bucketNameFromUri).file(fileName);
        const [contents] = await file.download();
        return contents.toString('base64');
    } catch (error: any) {
        console.error(`GCS download failed for URI: ${gcsUri}. Error: ${error.message}`);
        throw new Error(`Failed to download file from GCS: ${error.message}`);
    }
}
