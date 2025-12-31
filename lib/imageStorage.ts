// lib/imageStorage.ts
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