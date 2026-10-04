import { redirect, notFound } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getProjectById } from '@/lib/db';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectEditor initialProject={project} initialType={project.type} />;
}
