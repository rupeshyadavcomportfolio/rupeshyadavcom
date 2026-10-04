'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectType, ProjectStatus } from '@/types/portfolio';
import {
  Save,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Loader2,
  Sparkles,
  Globe,
  Film,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface Props {
  initialProject?: Project;
  initialType?: ProjectType;
}

export function ProjectEditor({ initialProject, initialType = 'graphic' }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialProject?.id);

  // File Upload Refs
  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>(() => {
    if (initialProject) return initialProject;
    return {
      title: '',
      slug: '',
      type: initialType,
      category: initialType === 'graphic' ? 'Social Media Design' : initialType === 'video' ? 'Reels' : initialType === 'website' ? 'Website Design' : 'Branding',
      subcategory: '',
      client: '',
      year: new Date().getFullYear().toString(),
      short_description: '',
      description: '',
      tools: ['Photoshop', 'Illustrator'],
      services: ['Graphic Design'],
      tags: ['design'],
      featured: false,
      status: 'draft',
      featured_image: '',
      aspect_ratio: initialType === 'video' ? '9:16' : '16:9',
      format_name: initialType === 'graphic' ? 'Instagram Post' : '',
      orientation: initialType === 'video' ? 'portrait' : 'landscape',
      custom_width: 1080,
      custom_height: 1080,
      alt_text: '',
      caption: '',
      video_url: '',
      video_type: 'Short Video',
      duration: '0:30',
      website_url: '',
      design_role: 'Design + Development',
      development_role: 'Next.js App Router',
      desktop_screenshot: '',
      tablet_screenshot: '',
      mobile_screenshot: '',
      gallery: [],
      case_study: {
        overview: '',
        problem: '',
        goal: '',
        research: '',
        strategy: '',
        creative_direction: '',
        design_process: '',
        implementation: '',
        results: '',
      },
      seo: {
        seo_title: '',
        seo_description: '',
        focus_keyword: '',
        secondary_keywords: [],
        canonical_url: '',
        no_index: false,
      },
    };
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'case_study' | 'seo' | 'publishing'>('basic');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchingWebsite, setFetchingWebsite] = useState(false);
  const [websiteFetchMsg, setWebsiteFetchMsg] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const handleDeleteProject = async () => {
    if (!initialProject?.id) return;
    setDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${initialProject.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.error || 'Failed to delete project');
        setConfirmDelete(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete error');
      setConfirmDelete(false);
    } finally {
      setDeletingProject(false);
    }
  };

  // File Upload Handler (Images & Videos from Device/Gallery)
  const handleFileUpload = async (file: File, target: 'featured' | 'video' | 'gallery') => {
    if (!file) return;
    setUploadingFile(true);
    setUploadMsg(`Uploading ${file.name}...`);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const item = await res.json();

      if (target === 'featured') {
        setFormData((prev) => ({
          ...prev,
          featured_image: item.url,
          desktop_screenshot: prev.type === 'website' ? item.url : prev.desktop_screenshot,
          alt_text: prev.alt_text || `${prev.title || file.name} preview by Rupesh Yadav`,
        }));
        setUploadMsg(`✓ Photo uploaded successfully from gallery!`);
      } else if (target === 'video') {
        setFormData((prev) => ({
          ...prev,
          video_url: item.url,
        }));
        setUploadMsg(`✓ Video uploaded successfully from gallery!`);
      } else if (target === 'gallery') {
        setFormData((prev) => ({
          ...prev,
          gallery: [
            ...(prev.gallery || []),
            {
              url: item.url,
              alt: `${prev.title || 'Project'} asset`,
              aspect_ratio: '1:1',
            },
          ],
        }));
        setUploadMsg(`✓ Added ${file.name} to gallery!`);
      }
    } catch (err: any) {
      setUploadMsg(`Upload error: ${err.message || 'Failed to upload'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  // Auto fetch website screenshot & metadata
  const handleAutoFetchWebsite = async (overrideUrl?: string) => {
    let targetUrl = (overrideUrl || formData.website_url || '').trim();
    if (!targetUrl) {
      setWebsiteFetchMsg('Please enter a website URL first.');
      return;
    }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    setFetchingWebsite(true);
    setWebsiteFetchMsg(null);

    try {
      const res = await fetch(`/api/website-preview?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch website preview');

      setFormData((prev) => {
        const cleanName = data.clean_url || 'Website Project';
        const newTitle = prev.title || data.title || cleanName;
        return {
          ...prev,
          website_url: data.url,
          featured_image: data.screenshot_url,
          desktop_screenshot: data.screenshot_url,
          title: newTitle,
          short_description: prev.short_description || data.description || `High-performance modern web application built for ${cleanName}.`,
          alt_text: prev.alt_text || `${newTitle} homepage preview screenshot by Rupesh Yadav`,
          slug: prev.slug || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        };
      });
      setWebsiteFetchMsg('✓ Website homepage screenshot & details fetched successfully!');
    } catch (err: any) {
      setWebsiteFetchMsg(`Error: ${err.message || 'Could not fetch preview'}`);
    } finally {
      setFetchingWebsite(false);
    }
  };

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && isEditing ? prev.slug : slugified,
      alt_text: prev.alt_text ? prev.alt_text : `${val} by Rupesh Yadav`,
      seo: {
        ...prev.seo,
        seo_title: prev.seo?.seo_title ? prev.seo.seo_title : `${val} | Rupesh Yadav`,
      },
    }));
  };

  // Format presets mapping
  const formatPresets: Record<string, { ratio: string; orientation: 'portrait' | 'landscape' | 'square' }> = {
    'Instagram Post': { ratio: '1:1', orientation: 'square' },
    'Instagram Portrait': { ratio: '4:5', orientation: 'portrait' },
    'Instagram Story': { ratio: '9:16', orientation: 'portrait' },
    'Facebook Post': { ratio: '16:9', orientation: 'landscape' },
    'Facebook Cover': { ratio: '16:9', orientation: 'landscape' },
    'LinkedIn Post': { ratio: '1:1', orientation: 'square' },
    'YouTube Thumbnail': { ratio: '16:9', orientation: 'landscape' },
    'Poster': { ratio: '3:4', orientation: 'portrait' },
    'Banner': { ratio: '16:9', orientation: 'landscape' },
    'Flyer': { ratio: '3:4', orientation: 'portrait' },
    'Presentation': { ratio: '16:9', orientation: 'landscape' },
    'Website Banner': { ratio: '16:9', orientation: 'landscape' },
    'Custom': { ratio: 'Custom', orientation: 'landscape' },
  };

  const handleFormatSelect = (fmt: string) => {
    if (fmt === 'Custom') {
      setFormData((prev) => ({ ...prev, format_name: fmt }));
    } else {
      const preset = formatPresets[fmt];
      if (preset) {
        setFormData((prev) => ({
          ...prev,
          format_name: fmt,
          aspect_ratio: preset.ratio,
          orientation: preset.orientation,
        }));
      }
    }
  };

  const calculateCustomRatio = (w: number, h: number) => {
    if (!w || !h) return;
    const orientation = w === h ? 'square' : w > h ? 'landscape' : 'portrait';
    setFormData((prev) => ({
      ...prev,
      custom_width: w,
      custom_height: h,
      orientation,
      aspect_ratio: `${w}:${h}`,
    }));
  };

  // Validation Checks
  const validationChecks = [
    { name: 'Title Provided', valid: Boolean(formData.title?.trim()) },
    { name: 'Slug Provided', valid: Boolean(formData.slug?.trim()) },
    { name: 'Category Selected', valid: Boolean(formData.category?.trim()) },
    { name: 'Short Description Provided', valid: Boolean(formData.short_description?.trim()) },
    { name: 'Primary Media/Featured Image Attached', valid: Boolean(formData.featured_image?.trim() || formData.video_url?.trim()) },
    { name: 'Alt Text Configured', valid: Boolean(formData.alt_text?.trim()) },
  ];

  const canPublish = validationChecks.every((c) => c.valid);

  // Save / Update Handler
  const handleSave = async (statusOverride?: ProjectStatus) => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const targetTitle = (formData.title || '').trim();
      let targetSlug = (formData.slug || '').trim();

      if (!targetTitle) {
        setActiveTab('basic');
        throw new Error('Project Title is required. Please enter a title on the Basic Info tab.');
      }

      if (!targetSlug) {
        targetSlug = targetTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!targetSlug) targetSlug = `project-${Date.now()}`;
      } else {
        // Strip any protocol or domain slashes if user pasted a link
        targetSlug = targetSlug.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/(^-|-$)/g, '');
      }

      const payload: Partial<Project> = {
        ...formData,
        title: targetTitle,
        slug: targetSlug,
        status: statusOverride || formData.status || 'draft',
      };

      const url = isEditing ? `/api/projects/${initialProject?.id}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      setSaveSuccess(true);
      setFormData(data);

      if (!isEditing) {
        setTimeout(() => {
          router.push(`/admin/projects/${data.id}`);
        }, 800);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving project');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </span>
            <h1 className="text-xl font-black uppercase text-neutral-950 truncate max-w-md">
              {formData.title || 'Untitled Project'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEditing && formData.slug && (
            <a
              href={`/work/${formData.type}/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-700 hover:text-neutral-950 rounded-xl hover:bg-neutral-50 shadow-xs"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-800 rounded-xl hover:bg-neutral-50 shadow-xs cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving || deletingProject}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish</span>
          </button>

          {isEditing && (
            confirmDelete ? (
              <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl p-1 shadow-xs animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={deletingProject}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {deletingProject ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete?</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={saving || deletingProject}
                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Project saved and cache revalidated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'media', label: '2. Media & Uploads' },
          { id: 'details', label: '3. Narrative & Tools' },
          ...(formData.type === 'case_study' ? [{ id: 'case_study', label: '4. Case Study Narrative' }] : []),
          { id: 'seo', label: 'SEO & Metadata' },
          { id: 'publishing', label: 'Publishing Checklist' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 shadow-xs'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Basic Project Information
          </h2>

          {/* Quick Auto-Generate Website Info & Screenshot */}
          {formData.type === 'website' && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Instant Website Screenshot & Info Generator
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Yaha website ka live link dalein aur button dabayein — homepage screenshot, title aur details automatically set ho jayenge, alag se photo upload karne ki zaroorat nahi hai!
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://client-website.com"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="button"
                  disabled={fetchingWebsite}
                  onClick={() => handleAutoFetchWebsite()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  {fetchingWebsite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate Screenshot</span>
                </button>
              </div>
              {websiteFetchMsg && (
                <p className="text-xs font-semibold text-emerald-800">{websiteFetchMsg}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aura Sound — Audio Identity Campaign"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="aura-sound-audio-campaign"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Work Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectType })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl uppercase font-semibold focus:outline-none focus:border-neutral-900"
              >
                <option value="graphic">Graphic</option>
                <option value="video">Video</option>
                <option value="website">Website</option>
                <option value="case_study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Primary Category
              </label>
              <input
                type="text"
                placeholder="Social Media Design / Reels / Landing Page"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Client (Optional)
              </label>
              <input
                type="text"
                placeholder="Client or Brand Name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl uppercase font-semibold focus:outline-none focus:border-neutral-900"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="featured_cb"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded-md"
              />
              <label htmlFor="featured_cb" className="text-xs font-bold uppercase tracking-wider text-neutral-800 cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Short Description (1-2 sentences) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Concise overview of the creative output..."
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <span>Next: Media Assets &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA & FORMATS */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Media Assets & Device Uploads
            </h2>
            {uploadMsg && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {uploadMsg}
              </span>
            )}
          </div>

          {/* 1. FEATURED IMAGE UPLOAD (Gallery or URL) */}
          <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-900">
                  Featured Image / Thumbnail <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Gallery se photo upload karein ya image URL paste karein.
                </p>
              </div>

              {/* GALLERY UPLOAD BUTTON */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={featuredFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'featured');
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingFile}
                  onClick={() => featuredFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  {uploadingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload from Gallery / Files</span>
                </button>
              </div>
            </div>

            {/* URL input fallback */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste image URL (https://... or /uploads/...)"
                value={formData.featured_image || ''}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900"
              />
              {formData.type === 'website' && (
                <button
                  type="button"
                  disabled={fetchingWebsite}
                  onClick={() => handleAutoFetchWebsite()}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
                >
                  {fetchingWebsite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Auto-Screenshot</span>
                </button>
              )}
            </div>

            {/* Preview Box */}
            {formData.featured_image && (
              <div className="pt-2">
                <div className="w-64 aspect-16/10 bg-white overflow-hidden border border-neutral-300 rounded-xl shadow-xs">
                  <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover object-top" />
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">Current Preview</span>
              </div>
            )}
          </div>

          {/* Alt text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Accessible Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aura Sound wireless headphones marketing graphic by Rupesh Yadav"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900"
            />
          </div>

          {/* 2. VIDEO SPECIFIC FIELDS & GALLERY UPLOAD */}
          {formData.type === 'video' && (
            <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Video File & Configuration
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Gallery se MP4 video upload karein ya direct video URL paste karein.
                  </p>
                </div>

                {/* VIDEO FILE UPLOAD BUTTON */}
                <div>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    ref={videoFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'video');
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingFile}
                    onClick={() => videoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    {uploadingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Film className="w-3.5 h-3.5" />}
                    <span>Upload Video from Gallery</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                    Video URL / Path
                  </label>
                  <input
                    type="text"
                    placeholder="https://...mp4 or /uploads/video.mp4"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                    Video Type
                  </label>
                  <select
                    value={formData.video_type}
                    onChange={(e) => setFormData({ ...formData, video_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none"
                  >
                    <option value="Short Video">Short Video</option>
                    <option value="Reels">Reels / Shorts</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Product Video">Product Video</option>
                    <option value="Explainer">Explainer</option>
                    <option value="Long Form">Long Form</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                    Duration (e.g. 0:45)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {formData.video_url && (
                <div className="pt-2">
                  <div className="w-64 aspect-9/16 max-h-64 bg-black rounded-xl overflow-hidden shadow-xs">
                    <video src={formData.video_url} controls className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">Video Player Preview</span>
                </div>
              )}
            </div>
          )}

          {/* 3. WEBSITE SPECIFIC FIELDS */}
          {formData.type === 'website' && (
            <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Website Showcase Fields
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                    Live Website URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="button"
                      disabled={fetchingWebsite}
                      onClick={() => handleAutoFetchWebsite()}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      {fetchingWebsite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Fetch Screenshot</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                    Design / Development Role
                  </label>
                  <input
                    type="text"
                    placeholder="UI/UX + Next.js Development"
                    value={formData.design_role}
                    onChange={(e) => setFormData({ ...formData, design_role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. GALLERY / ADDITIONAL IMAGES UPLOAD */}
          <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Additional Project Gallery Images
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Gallery se multiple images upload karein taaki project page par carousel/grid ban sake.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={galleryFileInputRef}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      await handleFileUpload(file, 'gallery');
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingFile}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Images to Gallery</span>
                </button>
              </div>
            </div>

            {formData.gallery && formData.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {formData.gallery.map((item, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-white group shadow-2xs">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          gallery: formData.gallery?.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400 border border-dashed border-neutral-300 rounded-xl bg-white">
                No additional gallery images added yet. Click above to upload.
              </div>
            )}
          </div>

          {/* Graphic Format Presets */}
          {formData.type === 'graphic' && (
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Graphic Format & Aspect Ratio Preset
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(formatPresets).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatSelect(fmt)}
                    className={`p-3 text-xs text-left font-medium border rounded-xl transition-all cursor-pointer ${
                      formData.format_name === fmt
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <span className="block font-bold truncate">{fmt}</span>
                    <span className="text-[10px] opacity-75">{formatPresets[fmt].ratio}</span>
                  </button>
                ))}
              </div>

              {formData.format_name === 'Custom' && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Custom Dimension Calculator
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-neutral-600 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={formData.custom_width}
                        onChange={(e) => {
                          const w = Number(e.target.value);
                          calculateCustomRatio(w, formData.custom_height || 1080);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-600 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={formData.custom_height}
                        onChange={(e) => {
                          const h = Number(e.target.value);
                          calculateCustomRatio(formData.custom_width || 1080, h);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Calculated Ratio: <strong>{formData.aspect_ratio}</strong> • Orientation: <strong>{formData.orientation}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              <span>&larr; Back to Basic</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <span>Next: Details & Tools &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DETAILS & NARRATIVE */}
      {activeTab === 'details' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Narrative & Tool Stack
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Full Project Description
            </label>
            <textarea
              rows={6}
              placeholder="Detailed explanation of the creative brief, art direction, and methodology..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-xl focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Software & Tools (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Adobe Photoshop, Figma, Premiere Pro"
                value={formData.tools?.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Services Provided (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Video Editing, Motion Graphics, Art Direction"
                value={formData.services?.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    services: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              <span>&larr; Back to Media</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(formData.type === 'case_study' ? 'case_study' : 'seo')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <span>{formData.type === 'case_study' ? 'Next: Case Study Narrative &rarr;' : 'Next: SEO & Metadata &rarr;'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CASE STUDY SPECIFIC NARRATIVE */}
      {activeTab === 'case_study' && formData.type === 'case_study' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Case Study Deep Dive
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Project Overview
              </label>
              <textarea
                rows={3}
                value={formData.case_study?.overview}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    case_study: { ...formData.case_study, overview: e.target.value },
                  })
                }
                className="w-full p-3 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                  The Problem / Challenge
                </label>
                <textarea
                  rows={3}
                  value={formData.case_study?.problem}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      case_study: { ...formData.case_study, problem: e.target.value },
                    })
                  }
                  className="w-full p-3 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                  Strategic Goal
                </label>
                <textarea
                  rows={3}
                  value={formData.case_study?.goal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      case_study: { ...formData.case_study, goal: e.target.value },
                    })
                  }
                  className="w-full p-3 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Strategy & Creative Direction
              </label>
              <textarea
                rows={3}
                value={formData.case_study?.creative_direction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    case_study: { ...formData.case_study, creative_direction: e.target.value },
                  })
                }
                className="w-full p-3 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Real Outcomes & Impact
              </label>
              <textarea
                rows={3}
                value={formData.case_study?.results}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    case_study: { ...formData.case_study, results: e.target.value },
                  })
                }
                className="w-full p-3 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              <span>&larr; Back to Narrative</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <span>Next: SEO & Metadata &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SEO & METADATA */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            SEO & OpenGraph Metadata
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Custom SEO Title Tag
            </label>
            <input
              type="text"
              placeholder={`${formData.title || 'Project'} | Rupesh Yadav`}
              value={formData.seo?.seo_title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, seo_title: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              SEO Meta Description (Under 160 chars)
            </label>
            <textarea
              rows={3}
              placeholder="Concise description tailored for Google search results..."
              value={formData.seo?.seo_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, seo_description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                placeholder="e.g. social media design"
                value={formData.seo?.focus_keyword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, focus_keyword: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="noindex_cb"
                checked={Boolean(formData.seo?.no_index)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, no_index: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded-md"
              />
              <label htmlFor="noindex_cb" className="text-xs font-bold uppercase tracking-wider text-neutral-800 cursor-pointer">
                Exclude from search indexing (noindex)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab(formData.type === 'case_study' ? 'case_study' : 'details')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              <span>&larr; Back to Narrative</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('publishing')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <span>Go to Publishing Checklist &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: PUBLISHING & SEO READINESS CHECKLIST */}
      {activeTab === 'publishing' && (
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              SEO Readiness & Content Quality Checklist
            </h2>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                canPublish
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {canPublish ? 'Ready to Publish' : 'Action Required'}
            </span>
          </div>

          <div className="space-y-3 divide-y divide-neutral-100">
            {validationChecks.map((item) => (
              <div key={item.name} className="pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800">
                  {item.name}
                </span>
                {item.valid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle className="w-4 h-4" /> Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Incomplete
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 leading-relaxed">
            <strong>Publishing Notice:</strong> This checklist validates structural data, search crawlability, and accessibility tokens. Newly published projects are automatically injected into the dynamic XML sitemap (<code className="text-neutral-900 font-semibold">/sitemap.xml</code>).
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Keep as Draft
            </button>
            <button
              type="button"
              disabled={saving || !canPublish}
              onClick={() => handleSave('published')}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white rounded-xl disabled:opacity-40 hover:bg-neutral-800 shadow-xs transition-colors cursor-pointer"
            >
              Publish Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
