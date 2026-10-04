'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/types/portfolio';
import { Upload, Copy, Check, Trash2, Plus, Video, Loader2 } from 'lucide-react';

export function MediaLibraryManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualName, setManualName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const item = await res.json();
      setMediaList([item, ...mediaList]);
      router.refresh();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl) return;

    setUploading(true);
    try {
      const isVideo = /\.(mp4|webm|mov)$/i.test(manualUrl);
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualName || manualUrl.split('/').pop() || 'media_asset',
          url: manualUrl,
          type: isVideo ? 'video' : 'image',
          size: 'External',
          dimensions: 'Unknown',
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setMediaList([item, ...mediaList]);
        setManualUrl('');
        setManualName('');
        setShowAddUrl(false);
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Assets Storage
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            MEDIA ASSET LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Upload images, project screenshots, and video assets, or register external CDN URLs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs cursor-pointer transition-colors">
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add URL</span>
          </button>
        </div>
      </div>

      {/* Manual URL Form */}
      {showAddUrl && (
        <form onSubmit={handleAddManualUrl} className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Register External Image / Video URL (e.g. Cloudinary, Unsplash)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Filename / Title"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="px-3.5 py-2.5 text-xs bg-neutral-50 hover:bg-neutral-50/80 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950"
            />
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="px-3.5 py-2.5 text-xs bg-neutral-50 hover:bg-neutral-50/80 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 sm:col-span-2"
            />
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddUrl(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
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
            className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center">
              {item.type === 'video' ? (
                <div className="flex flex-col items-center justify-center text-neutral-500">
                  <Video className="w-8 h-8 mb-1 text-neutral-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Video File</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Quick copy overlay */}
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.url)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 text-white shadow-xs transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3.5 flex flex-col flex-1 justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-950 block truncate" title={item.name}>
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {item.size || 'Web'} • {item.dimensions || 'Responsive'}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.url)}
                  className="text-neutral-600 hover:text-neutral-950 font-bold uppercase tracking-wider cursor-pointer"
                >
                  {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
