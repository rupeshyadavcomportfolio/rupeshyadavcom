import { NextResponse } from 'next/server';
import { deleteReview } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteReview(id);
  if (!success) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  revalidatePath('/');
  return NextResponse.json({ success: true });
}
