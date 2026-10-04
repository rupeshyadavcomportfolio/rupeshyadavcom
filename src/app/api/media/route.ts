import { NextResponse } from 'next/server';
import { getMediaList, addMediaItem, deleteMediaItem } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
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

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Clean filename
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const isVideo = file.type.startsWith('video');
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;

      const newItem = await addMediaItem({
        name: file.name,
        url: `/uploads/${safeName}`,
        type: isVideo ? 'video' : 'image',
        size: sizeStr,
        dimensions: 'Responsive',
        aspect_ratio: 'Original',
      });

      return NextResponse.json(newItem, { status: 201 });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process media upload' }, { status: 500 });
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
