import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { getDashboardStats, getProjects } from '@/lib/db';
import {
  FolderKanban,
  Image,
  Video,
  Globe,
  FileText,
  CheckCircle,
  FileEdit,
  Star,
  Mail,
  Plus,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const [stats, recentProjects] = await Promise.all([
    getDashboardStats(),
    getProjects(),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            PORTFOLIO DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage creative projects, media assets, inquiries, and site configuration.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Work</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Category Launchers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'ADD GRAPHIC', href: '/admin/projects/new?type=graphic', icon: Image, color: 'text-blue-500' },
          { label: 'ADD VIDEO', href: '/admin/projects/new?type=video', icon: Video, color: 'text-rose-500' },
          { label: 'ADD WEBSITE', href: '/admin/projects/new?type=website', icon: Globe, color: 'text-emerald-500' },
          { label: 'ADD CASE STUDY', href: '/admin/projects/new?type=case_study', icon: FileText, color: 'text-purple-500' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 group-hover:underline">
                  {action.label}
                </span>
              </div>
              <Plus className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          );
        })}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Projects</span>
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black text-neutral-950 dark:text-white">
            {stats.total}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.published}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {stats.drafts}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Featured</span>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          <span className="text-3xl font-black text-neutral-950 dark:text-white">
            {stats.featured}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Graphic</span>
            <Image className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats.graphic}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Video</span>
            <Video className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats.video}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Website</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats.website}
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inquiries</span>
            <Mail className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats.unreadMessages} Unread
          </span>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
            Recent Projects
          </h2>
          <Link
            href="/admin/projects"
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
          >
            View All ({recentProjects.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-5 py-3 font-bold">Project</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Category</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
              {recentProjects.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.featured_image}
                        alt=""
                        className="w-10 h-10 object-cover rounded-xs shrink-0 bg-neutral-200"
                      />
                      <div>
                        <span className="font-bold text-neutral-950 dark:text-white block truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {p.year} • {p.client || 'Self'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 uppercase font-semibold text-[11px] text-neutral-600 dark:text-neutral-400">
                    {p.type}
                  </td>
                  <td className="px-5 py-4">{p.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                        p.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="px-2.5 py-1 font-bold text-[11px] uppercase bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-xs"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/work/${p.type}/${p.slug}`}
                        target="_blank"
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        title="View Live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
