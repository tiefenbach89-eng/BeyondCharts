// lib/imageStorage.ts
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
