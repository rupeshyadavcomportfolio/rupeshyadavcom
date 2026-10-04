'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface Props {
  initialProject?: Project;
  initialType?: ProjectType;
}

export function ProjectEditor({ initialProject, initialType = 'graphic' }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialProject?.id);

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

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'case_study' | 'seo' | 'publishing' | 'preview'>('basic');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  // SEO Readiness Validation Checks
  const validationChecks = [
    { name: 'Project Title', valid: Boolean(formData.title?.trim()) },
    { name: 'URL Slug', valid: Boolean(formData.slug?.trim()) },
    { name: 'Category Selected', valid: Boolean(formData.category?.trim()) },
    { name: 'Featured Media Image/Video', valid: Boolean(formData.featured_image?.trim() || formData.video_url?.trim()) },
    { name: 'Short Description', valid: Boolean(formData.short_description?.trim()) },
    { name: 'Alt Text for Accessibility', valid: Boolean(formData.alt_text?.trim()) },
    { name: 'SEO Title', valid: Boolean(formData.seo?.seo_title?.trim()) },
    { name: 'SEO Meta Description', valid: Boolean(formData.seo?.seo_description?.trim() || formData.short_description?.trim()) },
  ];

  const canPublish = validationChecks.every((c) => c.valid);

  const handleSave = async (statusOverride?: ProjectStatus) => {
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    const payload = {
      ...formData,
      status: statusOverride || formData.status || 'draft',
    };

    try {
      const url = isEditing ? `/api/projects/${initialProject!.id}` : '/api/projects';
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
      if (!isEditing) {
        router.push(`/admin/projects/${data.id}`);
      } else {
        setFormData(data);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="p-1.5 text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </span>
            <h1 className="text-xl font-black uppercase text-neutral-950 dark:text-white truncate max-w-md">
              {formData.title || 'Untitled Project'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing && formData.slug && (
            <a
              href={`/work/${formData.type}/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xs"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs hover:opacity-90 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Project saved and cache revalidated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'media', label: '2. Media & Formats' },
          { id: 'details', label: '3. Narrative & Tools' },
          ...(formData.type === 'case_study' ? [{ id: 'case_study', label: '4. Case Study Narrative' }] : []),
          { id: 'seo', label: 'SEO & Metadata' },
          { id: 'publishing', label: 'Publishing Checklist' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-xs transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Basic Project Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aura Sound — Audio Identity Campaign"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="aura-sound-audio-campaign"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Work Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectType })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs uppercase font-semibold"
              >
                <option value="graphic">Graphic</option>
                <option value="video">Video</option>
                <option value="website">Website</option>
                <option value="case_study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Primary Category
              </label>
              <input
                type="text"
                placeholder="Social Media Design / Reels / Landing Page"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Client (Optional)
              </label>
              <input
                type="text"
                placeholder="Client or Brand Name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs uppercase font-semibold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
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
                className="w-4 h-4 rounded-xs"
              />
              <label htmlFor="featured_cb" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Short Description (1-2 sentences) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Concise overview of the creative output..."
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
            />
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA & FORMATS */}
      {activeTab === 'media' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Media Assets & Format Configuration
          </h2>

          {/* Featured Image URL & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Featured Image URL <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://... or /uploads/filename.jpg"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="flex-1 px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>
            {formData.featured_image && (
              <div className="w-48 aspect-16/10 bg-neutral-100 overflow-hidden border border-neutral-300 rounded-xs mt-2">
                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Alt text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Accessible Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aura Sound wireless headphones marketing graphic by Rupesh Yadav"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
            />
          </div>

          {/* GRAPHIC FORMAT SELECTOR (Specific to Graphics) */}
          {formData.type === 'graphic' && (
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Graphic Format & Aspect Ratio Preset
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(formatPresets).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatSelect(fmt)}
                    className={`p-2.5 text-xs text-left font-medium border rounded-xs transition-colors cursor-pointer ${
                      formData.format_name === fmt
                        ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#181818] hover:border-neutral-400'
                    }`}
                  >
                    <span className="block font-bold truncate">{fmt}</span>
                    <span className="text-[10px] opacity-75">{formatPresets[fmt].ratio}</span>
                  </button>
                ))}
              </div>

              {/* Custom Size Inputs */}
              {formData.format_name === 'Custom' && (
                <div className="p-4 bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Custom Dimension Calculator
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={formData.custom_width}
                        onChange={(e) => {
                          const w = Number(e.target.value);
                          calculateCustomRatio(w, formData.custom_height || 1080);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={formData.custom_height}
                        onChange={(e) => {
                          const h = Number(e.target.value);
                          calculateCustomRatio(formData.custom_width || 1080, h);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-xs"
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

          {/* VIDEO SPECIFIC FIELDS */}
          {formData.type === 'video' && (
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Video Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                    Video File / MP4 URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://...mp4 or /uploads/video.mp4"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                    Video Type
                  </label>
                  <select
                    value={formData.video_type}
                    onChange={(e) => setFormData({ ...formData, video_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
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
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                    Duration (e.g. 0:45)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WEBSITE SPECIFIC FIELDS */}
          {formData.type === 'website' && (
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Website Showcase Fields
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                    Live Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                    Design / Development Role
                  </label>
                  <input
                    type="text"
                    placeholder="UI/UX + Next.js Development"
                    value={formData.design_role}
                    onChange={(e) => setFormData({ ...formData, design_role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DETAILS & NARRATIVE */}
      {activeTab === 'details' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Narrative & Tool Stack
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Full Project Description
            </label>
            <textarea
              rows={6}
              placeholder="Detailed explanation of the creative brief, art direction, and methodology..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Software & Tools (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Adobe Photoshop, Figma, Illustrator"
                value={formData.tools?.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Services Provided (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Social Media Design, Art Direction"
                value={formData.services?.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    services: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CASE STUDY SPECIFIC NARRATIVE */}
      {activeTab === 'case_study' && formData.type === 'case_study' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Case Study Deep Dive
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
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
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
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
                  className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
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
                  className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
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
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Real Outcomes & Impact (Do not fabricate metrics)
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
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO & METADATA */}
      {activeTab === 'seo' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            SEO & OpenGraph Metadata
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
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
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
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
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-neutral-700 rounded-xs"
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
                className="w-4 h-4 rounded-xs"
              />
              <label htmlFor="noindex_cb" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                Exclude from search indexing (noindex)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PUBLISHING & SEO READINESS CHECKLIST */}
      {activeTab === 'publishing' && (
        <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              SEO Readiness & Content Quality Checklist
            </h2>
            <span
              className={`px-2.5 py-1 text-xs font-bold uppercase rounded-xs ${
                canPublish
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {canPublish ? 'Ready to Publish' : 'Action Required'}
            </span>
          </div>

          <div className="space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {validationChecks.map((item) => (
              <div key={item.name} className="pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {item.name}
                </span>
                {item.valid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle className="w-4 h-4" /> Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Incomplete
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 leading-relaxed">
            <strong>Publishing Notice:</strong> This checklist validates structural data, search crawlability, and accessibility tokens. Newly published projects are automatically injected into the dynamic XML sitemap (<code className="text-neutral-800 dark:text-neutral-200">/sitemap.xml</code>).
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 rounded-xs"
            >
              Keep as Draft
            </button>
            <button
              type="button"
              disabled={saving || !canPublish}
              onClick={() => handleSave('published')}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs disabled:opacity-40"
            >
              Publish Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
