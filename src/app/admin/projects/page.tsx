import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getProjects } from '@/lib/db';
import { ProjectListManager } from '@/components/admin/ProjectListManager';

export default async function AdminProjectsPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
          Content Repository
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
          PROJECTS MANAGER
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Add, edit, duplicate, and publish creative projects across graphic, video, website, and case studies.
        </p>
      </div>

      <ProjectListManager initialProjects={projects} />
    </div>
  );
}
