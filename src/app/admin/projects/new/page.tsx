import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { ProjectEditor } from '@/components/admin/ProjectEditor';
import { ProjectType } from '@/types/portfolio';

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const { type } = await searchParams;
  const validTypes: ProjectType[] = ['graphic', 'video', 'website', 'case_study'];
  const projectType: ProjectType = validTypes.includes(type as any)
    ? (type as ProjectType)
    : 'graphic';

  return <ProjectEditor initialType={projectType} />;
}
