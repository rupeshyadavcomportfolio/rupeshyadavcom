import { NextResponse } from 'next/server';
import { getMediaList, addMediaItem, deleteMediaItem } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const media = await getMediaList();
  return NextResponse.json(media);
}

export async function POST(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle JSON media registration
    if (contentType.includes('application/json')) {
      const data = await request.json();
      const item = await addMediaItem(data);
      return NextResponse.json(item, { status: 201 });
    }

    // Handle direct multipart form file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const isVideo = file.type.startsWith('video') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;

      // Clean filename
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      let finalUrl = '';

      // TIER 1: Attempt Supabase Cloud Storage (Works seamlessly on Vercel & Persistent everywhere)
      if (supabaseServer) {
        const potentialBuckets = ['portfolio-media', 'media', 'portfolio', 'uploads', 'assets'];
        for (const bucket of potentialBuckets) {
          try {
            const { data: uploadData, error: uploadErr } = await supabaseServer.storage
              .from(bucket)
              .upload(safeName, buffer, {
                contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
                upsert: true,
              });

            if (!uploadErr && uploadData) {
              const { data: pubData } = supabaseServer.storage.from(bucket).getPublicUrl(safeName);
              if (pubData?.publicUrl) {
                finalUrl = pubData.publicUrl;
                break;
              }
            }
          } catch (storageErr) {
            // Try next bucket or fallback
          }
        }
      }

      // TIER 2: Attempt Local Filesystem (Local development: public/uploads)
      if (!finalUrl) {
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const filePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(filePath, buffer);
          finalUrl = `/uploads/${safeName}`;
        } catch (fsErr: any) {
          // If read-only serverless environment like Vercel /var/task
          console.warn('Local fs write skipped (serverless environment):', fsErr.message);
        }
      }

      // TIER 3: Base64 Data URL Fallback (Guaranteed to work anywhere without local filesystem)
      if (!finalUrl) {
        if (!isVideo || file.size <= 4.5 * 1024 * 1024) {
          const mime = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');
          finalUrl = `data:${mime};base64,${buffer.toString('base64')}`;
        } else {
          return NextResponse.json(
            {
              error: `Video size (${sizeStr}) is too large for serverless memory. Please create the 'portfolio-media' public bucket in your Supabase Dashboard -> Storage or paste a video link (YouTube / Cloudinary).`,
            },
            { status: 400 }
          );
        }
      }

      const newItem = await addMediaItem({
        name: file.name,
        url: finalUrl,
        type: isVideo ? 'video' : 'image',
        size: sizeStr,
        dimensions: 'Responsive',
        aspect_ratio: 'Original',
      });

      return NextResponse.json(newItem, { status: 201 });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process media upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const success = await deleteMediaItem(id);
  return NextResponse.json({ success });
}
