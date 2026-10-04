import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await request.json();
    const updated = await updateProject(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath(`/work/${updated.type}`);
    revalidatePath(`/work/${updated.type}/${updated.slug}`);
    if (updated.type === 'case_study') {
      revalidatePath(`/case-study/${updated.slug}`);
    }
    revalidatePath('/sitemap.xml');

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
  const success = await deleteProject(id);
  if (!success) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ success: true });
}
