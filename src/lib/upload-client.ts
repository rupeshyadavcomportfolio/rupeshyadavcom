import { supabase } from '@/lib/supabase';
import { MediaItem } from '@/types/portfolio';

export interface UploadOptions {
  onProgress?: (message: string) => void;
}

/**
 * Universal media uploader for images & videos.
 * Tier 1: Direct client-to-Supabase Storage upload (bypasses serverless limits, instant CDN URL).
 * Tier 2: Server-side API endpoint (/api/media with cloud, local fs, or data URL fallback).
 */
export async function uploadMediaFile(
  file: File,
  options?: UploadOptions
): Promise<MediaItem> {
  const isVideo = file.type.startsWith('video') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
  const sizeStr =
    file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // STEP 1: Attempt direct upload to Supabase Storage if configured
  if (supabase) {
    const buckets = ['portfolio-media', 'media', 'portfolio', 'uploads', 'assets'];
    for (const bucket of buckets) {
      try {
        options?.onProgress?.(`Uploading ${file.name} to cloud storage...`);
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(safeName, file, {
            cacheControl: '3600',
            contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(safeName);
          if (pubData?.publicUrl) {
            // Register asset with backend
            const res = await fetch('/api/media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: file.name,
                url: pubData.publicUrl,
                type: isVideo ? 'video' : 'image',
                size: sizeStr,
                dimensions: 'Responsive',
                aspect_ratio: 'Original',
              }),
            });

            if (res.ok) {
              const item = await res.json();
              return item;
            }
          }
        }
      } catch (err) {
        // Fall back to server multipart upload
      }
    }
  }

  // STEP 2: Fallback to server route /api/media
  options?.onProgress?.(`Uploading ${file.name}...`);
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/media', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload media. Please try again.');
  }

  return data as MediaItem;
}
