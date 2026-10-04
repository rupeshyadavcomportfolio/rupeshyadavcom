'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/portfolio';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Star,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export function ProjectListManager({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.client?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, search, typeFilter, statusFilter]);

  const handleDuplicate = async (id: string) => {
    setLoadingActionId(`dup-${id}`);
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const copy = await res.json();
        setProjects([copy, ...projects]);
        router.refresh();
      }
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setLoadingActionId(`del-${id}`);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        router.refresh();
      }
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleToggleStatus = async (p: Project) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    setLoadingActionId(`status-${p.id}`);
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map((item) => (item.id === p.id ? updated : item)));
        router.refresh();
      }
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-5 border border-neutral-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search projects by title, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-950 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="graphic">Graphic</option>
            <option value="video">Video</option>
            <option value="website">Website</option>
            <option value="case_study">Case Study</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>Found {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-500">
            No projects found matching the current search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-bold">Work Item</th>
                  <th className="px-5 py-3 font-bold">Type</th>
                  <th className="px-5 py-3 font-bold">Format / Aspect</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Featured</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-800 font-medium">
                {filtered.map((p) => {
                  const isLoading =
                    loadingActionId === `dup-${p.id}` ||
                    loadingActionId === `del-${p.id}` ||
                    loadingActionId === `status-${p.id}`;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.featured_image || '/placeholder.jpg'}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl shrink-0 bg-neutral-100 border border-neutral-200"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-950 block truncate max-w-sm">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-normal">
                              /{p.type}/{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 uppercase font-bold text-[11px] text-neutral-700">
                        {p.type}
                      </td>

                      <td className="px-5 py-4 text-[11px] text-neutral-600 font-normal">
                        {p.aspect_ratio || '16:9'} {p.format_name ? `(${p.format_name})` : ''}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          title="Click to toggle published status"
                          disabled={isLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-full cursor-pointer transition-colors ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.status === 'published' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{p.status}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-600">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">No</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/projects/${p.id}`}
                            className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(p.id)}
                            disabled={isLoading}
                            className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer transition-colors"
                            title="Duplicate Project"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/work/${p.type}/${p.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.title)}
                            disabled={isLoading}
                            className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                            title="Delete Project"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
