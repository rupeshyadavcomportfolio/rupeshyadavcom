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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            PORTFOLIO DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Manage creative projects, media assets, inquiries, and site configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-800 rounded-xl hover:bg-neutral-50 shadow-xs transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Work</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Category Launchers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'ADD GRAPHIC', href: '/admin/projects/new?type=graphic', icon: Image, color: 'text-blue-600' },
          { label: 'ADD VIDEO', href: '/admin/projects/new?type=video', icon: Video, color: 'text-rose-600' },
          { label: 'ADD WEBSITE', href: '/admin/projects/new?type=website', icon: Globe, color: 'text-emerald-600' },
          { label: 'ADD CASE STUDY', href: '/admin/projects/new?type=case_study', icon: FileText, color: 'text-purple-600' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between hover:border-neutral-400 hover:shadow-sm transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-black">
                  {action.label}
                </span>
              </div>
              <Plus className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          );
        })}
      </div>

      {/* Statistics Grid - Clickable shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/projects"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-neutral-900 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-neutral-950">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-neutral-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-neutral-950">
            {stats.total}
          </span>
          <span className="block text-[10px] text-neutral-400 mt-1 uppercase font-semibold">View all projects &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?status=published"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-emerald-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-emerald-600">
            {stats.published}
          </span>
          <span className="block text-[10px] text-emerald-600/80 mt-1 uppercase font-semibold">Live on website &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?status=draft"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-amber-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-amber-600">
            {stats.drafts}
          </span>
          <span className="block text-[10px] text-amber-600/80 mt-1 uppercase font-semibold">In progress &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?featured=true"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-yellow-500 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-700">Featured</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-neutral-950">
            {stats.featured}
          </span>
          <span className="block text-[10px] text-yellow-600 mt-1 uppercase font-semibold">Homepage spotlight &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?type=graphic"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-blue-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Graphic</span>
            <Image className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-neutral-950">
            {stats.graphic}
          </span>
          <span className="block text-[10px] text-blue-600 mt-1 uppercase font-semibold">Manage graphics &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?type=video"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-rose-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Video</span>
            <Video className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-neutral-950">
            {stats.video}
          </span>
          <span className="block text-[10px] text-rose-600 mt-1 uppercase font-semibold">Manage videos &rarr;</span>
        </Link>

        <Link
          href="/admin/projects?type=website"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-emerald-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Website</span>
            <Globe className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-neutral-950">
            {stats.website}
          </span>
          <span className="block text-[10px] text-emerald-600 mt-1 uppercase font-semibold">Manage websites &rarr;</span>
        </Link>

        <Link
          href="/admin/messages"
          className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-indigo-600 hover:shadow-sm transition-all group block"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Inquiries</span>
            <Mail className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-neutral-950">
            {stats.unreadMessages} Unread
          </span>
          <span className="block text-[10px] text-indigo-600 mt-1 uppercase font-semibold">Open inbox &rarr;</span>
        </Link>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-tight text-neutral-950">
            Recent Projects
          </h2>
          <Link
            href="/admin/projects"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1"
          >
            View All ({recentProjects.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3 font-bold">Project</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Category</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800 font-medium">
              {recentProjects.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.featured_image || '/placeholder.jpg'}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg shrink-0 bg-neutral-100 border border-neutral-200"
                      />
                      <div>
                        <span className="font-bold text-neutral-950 block truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-normal">
                          {p.year} • {p.client || 'Self'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 uppercase font-bold text-[11px] text-neutral-600">
                    {p.type}
                  </td>
                  <td className="px-5 py-4 font-normal text-neutral-700">{p.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        p.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="px-3 py-1 font-bold text-[11px] uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/work/${p.type}/${p.slug}`}
                        target="_blank"
                        className="p-1 text-neutral-400 hover:text-neutral-900"
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
