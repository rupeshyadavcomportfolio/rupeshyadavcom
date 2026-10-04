import { NextResponse } from 'next/server';
import { duplicateProject } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const duplicated = await duplicateProject(id);
    if (!duplicated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/projects');

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to duplicate project' }, { status: 500 });
  }
}
