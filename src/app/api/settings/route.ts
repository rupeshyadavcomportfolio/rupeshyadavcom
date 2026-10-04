import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updated = await updateSiteSettings(data);

    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
