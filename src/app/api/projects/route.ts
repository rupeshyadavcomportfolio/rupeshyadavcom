import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;
  const category = searchParams.get('category') || undefined;
  const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
  const search = searchParams.get('search') || undefined;

  const projects = await getProjects({ type, status, category, featured, search });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newProject = await createProject(data);

    // Targeted caching revalidations
    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath(`/work/${newProject.type}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
