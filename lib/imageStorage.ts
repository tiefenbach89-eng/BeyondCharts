// lib/imageStorage.ts
<<<<<<< HEAD
import { randomUUID } from "crypto";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Upload a base64-encoded image to Supabase Storage (public bucket)
 * and return its public URL.
 */
export async function uploadImageFromBase64(base64Data: string): Promise<string> {
  const match = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid base64 image data");
  }

  const mime = match[1];
  const b64 = match[2];

  const buffer = Buffer.from(b64, "base64");
  const ext = mime.split("/")[1] || "png";

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
  const objectPath = `images/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;

  const supabase = supabaseServer();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data?.publicUrl) {
    throw new Error("Failed to obtain public URL from Supabase");
  }

  return data.publicUrl;
}

/**
 * Convert base64 images into a public Supabase URL.
 * If imageUrl is already a URL/path, return as-is.
 */
export async function processImageUrl(
  imageUrl: string | undefined
): Promise<string | undefined> {
  if (!imageUrl) return undefined;

  // already a URL or local path
  if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // base64 => upload
  if (imageUrl.startsWith("data:image/")) {
    return await uploadImageFromBase64(imageUrl);
  }

  return imageUrl;
}
=======
import fs from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Save base64 image to public/uploads directory
 * Returns the public URL path
 */
export async function saveBase64Image(base64Data: string): Promise<string> {
  // Ensure upload directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Extract mime type and data
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const [, extension, data] = matches;
  const buffer = Buffer.from(data, 'base64');

  // Generate unique filename
  const filename = `${Date.now()}-${randomBytes(8).toString('hex')}.${extension}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Save file
  await fs.writeFile(filepath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

/**
 * Convert base64 to public URL if needed
 * If already a URL, return as-is
 */
export async function processImageUrl(imageUrl: string | undefined): Promise<string | undefined> {
  if (!imageUrl) return undefined;
  
  // If it's already a public URL, return it
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it's base64, save it and return the URL
  if (imageUrl.startsWith('data:image/')) {
    return await saveBase64Image(imageUrl);
  }

  return imageUrl;
}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
