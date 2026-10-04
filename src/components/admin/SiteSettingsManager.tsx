'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteSettings } from '@/types/portfolio';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SiteSettingsManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (index: number, url: string) => {
    const updated = [...settings.social_links];
    updated[index].url = url;
    setSettings({ ...settings, social_links: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            System Configuration
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            SITE & OWNER SETTINGS
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure profile credentials, verified contacts, SEO defaults, and homepage display limits.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Settings</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Site settings updated and global layout revalidated!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Identity & Profile */}
      <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Owner Profile Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Owner Name
            </label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Professional Title / Tagline
            </label>
            <input
              type="text"
              required
              value={settings.professional_title}
              onChange={(e) => setSettings({ ...settings, professional_title: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Public Email
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Social Handle
            </label>
            <input
              type="text"
              value={settings.social_handle}
              onChange={(e) => setSettings({ ...settings, social_handle: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
            Profile Photo URL
          </label>
          <input
            type="text"
            value={settings.profile_photo}
            onChange={(e) => setSettings({ ...settings, profile_photo: e.target.value })}
            className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
            Editorial Biography
          </label>
          <textarea
            rows={3}
            value={settings.bio}
            onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
            className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
          />
        </div>
      </div>

      {/* 2. Social Links */}
      <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Social Handles & Profiles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settings.social_links.map((link, idx) => (
            <div key={link.platform}>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                {link.platform} URL
              </label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLink(idx, e.target.value)}
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Homepage Limits */}
      <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Homepage Section Project Limits
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Graphic Projects
            </label>
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
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Video Projects
            </label>
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
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Website Projects
            </label>
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
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Global SEO Defaults */}
      <div className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Global Default SEO & Analytics
        </h2>

        <div>
          <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
            Default SEO Meta Title
          </label>
          <input
            type="text"
            value={settings.default_seo_title}
            onChange={(e) => setSettings({ ...settings, default_seo_title: e.target.value })}
            className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
            Default SEO Meta Description
          </label>
          <textarea
            rows={2}
            value={settings.default_seo_description}
            onChange={(e) => setSettings({ ...settings, default_seo_description: e.target.value })}
            className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings.google_analytics_id || ''}
              onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Google Search Console Verification Tag
            </label>
            <input
              type="text"
              placeholder="google-site-verification token"
              value={settings.search_console_code || ''}
              onChange={(e) => setSettings({ ...settings, search_console_code: e.target.value })}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
