'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/types/portfolio';
import { Upload, Copy, Check, Trash2, Image, Video, Plus, Loader2 } from 'lucide-react';

export function MediaLibraryManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual URL registration state
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualType, setManualType] = useState<'image' | 'video'>('image');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const item = await res.json();
        setMediaList([item, ...mediaList]);
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl) return;

    setUploading(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualName || 'external-asset',
          url: manualUrl,
          type: manualType,
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setMediaList([item, ...mediaList]);
        setShowAddUrl(false);
        setManualName('');
        setManualUrl('');
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this media asset?')) return;

    const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMediaList(mediaList.filter((m) => m.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Assets Storage
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            MEDIA ASSET LIBRARY
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Upload images, project screenshots, and video assets, or register external CDN URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs cursor-pointer hover:opacity-90">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload File</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <button
            type="button"
            onClick={() => setShowAddUrl(!showAddUrl)}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add URL</span>
          </button>
        </div>
      </div>

      {/* Manual URL Form */}
      {showAddUrl && (
        <form onSubmit={handleAddManualUrl} className="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Register External Image / Video URL (e.g. Cloudinary, Unsplash)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Filename / Title"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs sm:col-span-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddUrl(false)}
              className="px-3 py-1.5 text-xs border rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-1.5 text-xs font-bold uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
            >
              Register Asset
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center">
              {item.type === 'video' ? (
                <div className="flex flex-col items-center justify-center text-neutral-400">
                  <Video className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Video File</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                />
              )}

              {/* Quick copy overlay */}
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.url)}
                className="absolute top-2 right-2 p-1.5 rounded-xs bg-black/70 text-white hover:bg-black transition-colors"
                title="Copy URL"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 flex flex-col flex-1 justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-950 dark:text-white block truncate" title={item.name}>
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {item.size || 'Web'} • {item.dimensions || 'Responsive'}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.url)}
                  className="text-neutral-500 hover:text-neutral-950 dark:hover:text-white font-medium cursor-pointer"
                >
                  {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
