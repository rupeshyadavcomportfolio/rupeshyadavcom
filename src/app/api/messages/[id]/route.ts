import { NextResponse } from 'next/server';
import { updateMessageStatus, deleteMessage } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await request.json();
    const success = await updateMessageStatus(id, status);
    if (!success) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteMessage(id);
  if (!success) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
