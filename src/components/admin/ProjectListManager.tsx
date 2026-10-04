'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  X,
  AlertCircle,
  Check,
  Filter,
} from 'lucide-react';

function ProjectListContent({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>(() =>
    [...initialProjects].sort((a, b) => {
      const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
      const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
      return timeB - timeA;
    })
  );
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize filters from URL search params if provided
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const featuredParam = searchParams.get('featured');

    if (typeParam) setTypeFilter(typeParam);
    if (statusParam) setStatusFilter(statusParam);
    if (featuredParam === 'true') setFeaturedFilter('true');
  }, [searchParams]);

  // Auto-hide feedback message after 4s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const filtered = useMemo(() => {
    return projects
      .slice()
      .sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
        const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
        return timeB - timeA; // Latest upload first
      })
      .filter((p) => {
        if (typeFilter !== 'all' && p.type !== typeFilter) return false;
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (featuredFilter === 'true' && !p.featured) return false;
        if (featuredFilter === 'false' && p.featured) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.client?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [projects, search, typeFilter, statusFilter, featuredFilter]);

  const handleDuplicate = async (id: string, title: string) => {
    setLoadingActionId(`dup-${id}`);
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const copy = await res.json();
        setProjects([copy, ...projects]);
        setFeedback({ type: 'success', message: `✓ Successfully duplicated "${title}"!` });
        router.refresh();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'Failed to duplicate project' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Duplication error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const executeDelete = async (id: string, title: string) => {
    setLoadingActionId(`del-${id}`);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        setFeedback({ type: 'success', message: `✓ Deleted project "${title}".` });
        setConfirmingDeleteId(null);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback({ type: 'error', message: err.error || 'Failed to delete project' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Delete error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  // Toggle single item selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all filtered items
  const isAllSelected = filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.id));
  const isSomeSelected = filtered.some((p) => selectedIds.includes(p.id)) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filtered.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedIds, ...filtered.map((p) => p.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
    setConfirmBulkDelete(false);
  };

  // Execute Bulk Delete
  const executeBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setLoadingActionId('bulk-delete');
    try {
      const idsToDelete = [...selectedIds];
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => !idsToDelete.includes(p.id)));
        setSelectedIds([]);
        setConfirmBulkDelete(false);
        setFeedback({
          type: 'success',
          message: `✓ Successfully deleted ${idsToDelete.length} selected project${idsToDelete.length > 1 ? 's' : ''}!`,
        });
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback({ type: 'error', message: err.error || 'Failed to delete selected projects' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Bulk delete error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  // Bulk Status Update (Published or Draft)
  const handleBulkStatus = async (newStatus: 'published' | 'draft') => {
    if (selectedIds.length === 0) return;
    setLoadingActionId(`bulk-status-${newStatus}`);
    try {
      const idsToUpdate = [...selectedIds];
      await Promise.all(
        idsToUpdate.map((id) =>
          fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      );

      setProjects((prev) =>
        prev.map((p) => (idsToUpdate.includes(p.id) ? { ...p, status: newStatus } : p))
      );
      setFeedback({
        type: 'success',
        message: `✓ Updated ${idsToUpdate.length} project${idsToUpdate.length > 1 ? 's' : ''} to ${newStatus === 'published' ? 'Published' : 'Draft'}!`,
      });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Bulk status error' });
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
        setFeedback({
          type: 'success',
          message: `✓ "${p.title}" is now ${newStatus === 'published' ? 'Published (Public)' : 'Draft (Hidden)'}!`,
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', message: 'Failed to update project status' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Update error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    const newFeatured = !p.featured;
    setLoadingActionId(`feat-${p.id}`);
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map((item) => (item.id === p.id ? updated : item)));
        setFeedback({
          type: 'success',
          message: `✓ "${p.title}" ${newFeatured ? 'added to' : 'removed from'} homepage Featured list!`,
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', message: 'Failed to toggle featured status' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Update error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusFilter('all');
    setFeaturedFilter('all');
  };

  const hasActiveFilters = search || typeFilter !== 'all' || statusFilter !== 'all' || featuredFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-5 border border-neutral-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search projects by title, client, slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-950 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl focus:outline-none cursor-pointer"
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
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Spotlight</option>
            <option value="true">★ Featured Only</option>
            <option value="false">Standard Only</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Bulk Action Bar (Visible when 1 or more projects are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-neutral-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-150 sticky top-4 z-30">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-black text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-neutral-200">
              {selectedIds.length} {selectedIds.length === 1 ? 'project' : 'projects'} selected
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer transition-colors"
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer transition-colors"
            >
              {isAllSelected ? 'Deselect all' : `Select all (${filtered.length})`}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatus('published')}
              disabled={loadingActionId === 'bulk-status-published'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-emerald-400 rounded-xl transition-colors cursor-pointer"
              title="Set selected projects to Published"
            >
              {loadingActionId === 'bulk-status-published' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              <span>Publish</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStatus('draft')}
              disabled={loadingActionId === 'bulk-status-draft'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl transition-colors cursor-pointer"
              title="Set selected projects to Draft"
            >
              {loadingActionId === 'bulk-status-draft' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>Draft</span>
            </button>

            {/* 2-Click Bulk Delete */}
            {confirmBulkDelete ? (
              <div className="inline-flex items-center gap-1 bg-red-950 border border-red-500/50 p-1 rounded-xl shadow-xs animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={executeBulkDelete}
                  disabled={loadingActionId === 'bulk-delete'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                  title="Confirm bulk permanent deletion"
                >
                  {loadingActionId === 'bulk-delete' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete {selectedIds.length} Projects?</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmBulkDelete(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmBulkDelete(true)}
                disabled={loadingActionId === 'bulk-delete'}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-2">
            <span>
              Showing {filtered.length} of {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700 rounded-md">
                Filtered
              </span>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-medium text-neutral-500">
              No projects found matching the current search criteria.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-bold uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-950 cursor-pointer"
                      title={isAllSelected ? 'Deselect all' : 'Select all projects'}
                    />
                  </th>
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
                  const isSelected = selectedIds.includes(p.id);
                  const isLoading =
                    loadingActionId === `dup-${p.id}` ||
                    loadingActionId === `del-${p.id}` ||
                    loadingActionId === `status-${p.id}` ||
                    loadingActionId === `feat-${p.id}` ||
                    loadingActionId === 'bulk-delete';

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-red-50/40 hover:bg-red-50/60 border-l-4 border-l-red-500'
                          : 'hover:bg-neutral-50/70'
                      }`}
                    >
                      <td className="w-12 px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-950 cursor-pointer"
                          title={`Select ${p.title}`}
                        />
                      </td>
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

                      {/* Status Toggle Button */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          title="Click to toggle between Published and Draft"
                          disabled={isLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-full cursor-pointer transition-colors ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {loadingActionId === `status-${p.id}` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : p.status === 'published' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{p.status}</span>
                        </button>
                      </td>

                      {/* Featured 1-Click Toggle Button */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          disabled={isLoading}
                          title="Click to toggle Homepage Featured spotlight"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                            p.featured
                              ? 'bg-yellow-50 text-yellow-800 border border-yellow-300 hover:bg-yellow-100'
                              : 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-700'
                          }`}
                        >
                          {loadingActionId === `feat-${p.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Star
                              className={`w-3.5 h-3.5 ${
                                p.featured ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-400'
                              }`}
                            />
                          )}
                          <span>{p.featured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Actions */}
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
                            onClick={() => handleDuplicate(p.id, p.title)}
                            disabled={isLoading}
                            className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer transition-colors"
                            title="Duplicate Project"
                          >
                            {loadingActionId === `dup-${p.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Link
                            href={`/work/${p.type}/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {confirmingDeleteId === p.id ? (
                            <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl p-1 animate-in fade-in duration-100 shadow-xs">
                              <button
                                type="button"
                                onClick={() => executeDelete(p.id, p.title)}
                                disabled={loadingActionId === `del-${p.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                                title="Confirm permanent deletion"
                              >
                                {loadingActionId === `del-${p.id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Delete?</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteId(null)}
                                className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingDeleteId(p.id)}
                              disabled={isLoading}
                              className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                              title="Delete Project"
                            >
                              {loadingActionId === `del-${p.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
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

export function ProjectListManager({ initialProjects }: { initialProjects: Project[] }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Loading projects...</div>}>
      <ProjectListContent initialProjects={initialProjects} />
    </Suspense>
  );
}
