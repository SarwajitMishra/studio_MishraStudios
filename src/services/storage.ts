
'use server';

import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName = process.env.GCS_BUCKET_NAME || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// The private key needs to have its newlines preserved.
// When setting this in your .env.local, wrap the key in double quotes.
// Example: GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GCS_CLIENT_EMAIL;

if (!projectId || !bucketName || !privateKey || !clientEmail) {
  let missingVars = [];
  if (!projectId) missingVars.push("GOOGLE_CLOUD_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!bucketName) missingVars.push("GCS_BUCKET_NAME or NEXT_PUBLIC_FIREbase_STORAGE_BUCKET");
  if (!privateKey) missingVars.push("GCS_PRIVATE_KEY");
  if (!clientEmail) missingVars.push("GCS_CLIENT_EMAIL");
  
  const errorMessage = `Storage service is not configured. Missing environment variables: ${missingVars.join(', ')}. Please check your .env.local file. Ensure GCS_PRIVATE_KEY is wrapped in double quotes.`;
  
  // This check will run on the server when the module is loaded.
  if (process.env.NODE_ENV === 'development') {
    console.warn(errorMessage);
  } else {
    // In production, we should fail hard if configuration is missing.
    throw new Error(errorMessage);
  }
}

const storage = new Storage({
  projectId: projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
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
    console.error(`Error generating signed URL: ${error.message}`, { code: error.code });
    if (error.code === 403 || error.message.includes('permission')) {
        throw new Error("Permission denied. The service account is missing the 'Service Account Token Creator' role in your Google Cloud IAM settings. Please add this role to the service account.");
    }
    throw new Error(`Failed to generate upload URL. Ensure GCS credentials in .env.local are correct. Original error: ${error.message}`);
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
        throw error;
    }
}
