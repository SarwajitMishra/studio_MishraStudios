
'use server';

import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName = process.env.GCS_BUCKET_NAME || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const serviceAccountKeyPath = path.resolve('./service-account.json');

let storage: Storage;

if (fs.existsSync(serviceAccountKeyPath)) {
  try {
    const keyFileContent = fs.readFileSync(serviceAccountKeyPath, 'utf-8');
    const key = JSON.parse(keyFileContent);
    if (!key.project_id || !key.client_email || !key.private_key) {
      throw new Error('service-account.json is malformed or missing required fields.');
    }
    storage = new Storage({
      projectId,
      keyFilename: serviceAccountKeyPath,
    });
  } catch (error: any) {
    console.error(`Failed to initialize Storage with key file: ${error.message}`);
    throw new Error(`Could not initialize cloud storage. Please ensure service-account.json is valid. Error: ${error.message}`);
  }
} else {
  console.warn(`Service account key not found at ${serviceAccountKeyPath}. Falling back to default credentials. This may fail in local development without 'gcloud auth application-default login'.`);
  storage = new Storage({ projectId });
}


if (!projectId || !bucketName) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("Project ID or GCS Bucket Name environment variable is not set. File uploads will fail. Please set them in your .env.local file.");
  }
}

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
    console.error(`Error generating signed URL: ${error.code} - ${error.message}`);
    if (error.code === 403 || error.message.includes('permission')) {
        throw new Error("Permission denied. The service account is missing the 'Service Account Token Creator' role in your Google Cloud IAM settings. Please add this role to the service account.");
    }
    if (error.message.includes('client_email')) {
        throw new Error("Authentication failed. Please ensure your 'service-account.json' file is correctly configured and has the 'Service Account Token Creator' role.");
    }
    throw new Error(`Failed to generate upload URL: ${error.message}`);
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
        throw new Error(`Failed to download file from GCS: ${error.message}`);
    }
}
