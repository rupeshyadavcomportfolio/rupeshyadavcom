'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteSettings } from '@/types/portfolio';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  ExternalLink,
  Plus,
  Trash2,
  User,
  Globe,
  Share2,
  Sliders,
  Sparkles,
} from 'lucide-react';

export function SiteSettingsManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      const updated = await res.json();
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    setUploadingPhoto(true);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload photo');
      }

      const item = await res.json();
      setSettings((prev) => ({
        ...prev,
        profile_photo: item.url,
      }));
    } catch (err: any) {
      setError(`Photo upload error: ${err.message}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateSocialLink = (index: number, url: string) => {
    const updated = [...(settings.social_links || [])];
    updated[index].url = url;
    setSettings({ ...settings, social_links: updated });
  };

  const addSocialLink = () => {
    const updated = [...(settings.social_links || [])];
    updated.push({ platform: 'Platform', url: 'https://' });
    setSettings({ ...settings, social_links: updated });
  };

  const removeSocialLink = (index: number) => {
    const updated = [...(settings.social_links || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, social_links: updated });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-50/80 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors';
  const labelClass =
    'text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5';
  const cardClass =
    'bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs space-y-5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            System Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            SITE & OWNER SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Configure profile credentials, verified contacts, SEO defaults, and homepage display limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-700 hover:text-neutral-950 rounded-xl hover:bg-neutral-50 shadow-xs transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 rounded-xl animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Site settings successfully updated and live layouts refreshed!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Identity & Profile */}
      <div className={cardClass}>
        <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Owner Profile Details
          </h2>
        </div>

        {/* Profile Photo Upload Section */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-800 block">
                Profile Portrait / Avatar
              </label>
              <p className="text-[11px] text-neutral-500">
                Gallery se photo upload karein ya direct URL paste karein.
              </p>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                ref={photoFileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploadingPhoto}
                onClick={() => photoFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload Photo from Files</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            {settings.profile_photo ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-300 bg-white shrink-0 shadow-2xs">
                <img
                  src={settings.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-sm shrink-0">
                RY
              </div>
            )}

            <input
              type="text"
              placeholder="Photo URL (/rupesh-yadav.png or https://...)"
              value={settings.profile_photo}
              onChange={(e) => setSettings({ ...settings, profile_photo: e.target.value })}
              className={`${inputClass} flex-1`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Owner Full Name *</label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Professional Title / Tagline *</label>
            <input
              type="text"
              required
              value={settings.professional_title}
              onChange={(e) => setSettings({ ...settings, professional_title: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>

          <div>
            <label className={labelClass}>Public Email</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>

          <div>
            <label className={labelClass}>Social Handle</label>
            <input
              type="text"
              value={settings.social_handle}
              onChange={(e) => setSettings({ ...settings, social_handle: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Editorial Biography</label>
          <textarea
            rows={3}
            value={settings.bio}
            onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* 2. Social Links */}
      <div className={cardClass}>
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-neutral-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Social Handles & Profiles
            </h2>
          </div>
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settings.social_links?.map((link, idx) => (
            <div key={idx} className="p-3 bg-neutral-50/70 border border-neutral-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Platform Name (e.g. Behance)"
                  value={link.platform}
                  onChange={(e) => {
                    const updated = [...settings.social_links];
                    updated[idx].platform = e.target.value;
                    setSettings({ ...settings, social_links: updated });
                  }}
                  className="font-bold text-xs bg-transparent border-b border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 uppercase tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateSocialLink(idx, e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Homepage Limits */}
      <div className={cardClass}>
        <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Homepage Section Project Limits
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Graphic Projects</label>
            <input
              type="number"
              min={1}
              max={24}
              value={settings.homepage_limits?.graphic || 6}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage_limits: {
                    ...settings.homepage_limits,
                    graphic: Number(e.target.value),
                  },
                })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Video Projects</label>
            <input
              type="number"
              min={1}
              max={24}
              value={settings.homepage_limits?.video || 4}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage_limits: {
                    ...settings.homepage_limits,
                    video: Number(e.target.value),
                  },
                })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Website Projects</label>
            <input
              type="number"
              min={1}
              max={24}
              value={settings.homepage_limits?.website || 4}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage_limits: {
                    ...settings.homepage_limits,
                    website: Number(e.target.value),
                  },
                })
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 4. Global SEO Defaults */}
      <div className={cardClass}>
        <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Global Default SEO & Analytics
          </h2>
        </div>

        <div>
          <label className={labelClass}>Default SEO Meta Title</label>
          <input
            type="text"
            value={settings.default_seo_title}
            onChange={(e) => setSettings({ ...settings, default_seo_title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Default SEO Meta Description</label>
          <textarea
            rows={2}
            value={settings.default_seo_description}
            onChange={(e) => setSettings({ ...settings, default_seo_description: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings.google_analytics_id || ''}
              onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>

          <div>
            <label className={labelClass}>Google Search Console Verification Tag</label>
            <input
              type="text"
              placeholder="google-site-verification token"
              value={settings.search_console_code || ''}
              onChange={(e) => setSettings({ ...settings, search_console_code: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
