'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/types/portfolio';
import { uploadMediaFile } from '@/lib/upload-client';
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Plus,
  Video,
  Loader2,
  Search,
  X,
  ExternalLink,
  Eye,
  Filter,
  CheckCircle,
  AlertCircle,
  FileImage,
} from 'lucide-react';

export function MediaLibraryManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualName, setManualName] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const item = await uploadMediaFile(file);
      setMediaList([item, ...mediaList]);
      showToast('success', `✓ Successfully uploaded ${file.name}!`);
      router.refresh();
    } catch (err: any) {
      showToast('error', `Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    setUploading(true);
    try {
      const isVideo = /\.(mp4|webm|mov)$/i.test(manualUrl);
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualName.trim() || manualUrl.split('/').pop() || 'media_asset',
          url: manualUrl.trim(),
          type: isVideo ? 'video' : 'image',
          size: 'External CDN',
          dimensions: 'Responsive',
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setMediaList([item, ...mediaList]);
        setManualUrl('');
        setManualName('');
        setShowAddUrl(false);
        showToast('success', '✓ Registered external asset URL successfully!');
        router.refresh();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Failed to register asset');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Registration error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('success', '✓ Asset URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaList(mediaList.filter((m) => m.id !== id));
        showToast('success', `✓ Removed asset "${name}".`);
        setConfirmingDeleteId(null);
        router.refresh();
      } else {
        showToast('error', 'Failed to remove asset');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete error');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
      }
      return true;
    });
  }, [mediaList, search, typeFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Register External Image / Video URL (Cloudinary, Imgur, Unsplash, etc.)
            </h3>
            <button
              type="button"
              onClick={() => setShowAddUrl(false)}
              className="text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Filename / Title (Optional)"
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
              {uploading ? 'Registering...' : 'Register Asset'}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950"
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

        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTypeFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                typeFilter === filter
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filter === 'all' ? 'All Files' : filter === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
          <span className="text-xs text-neutral-400 font-medium pl-2">
            {filteredMedia.length} {filteredMedia.length === 1 ? 'asset' : 'assets'}
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <FileImage className="w-10 h-10 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-500">
            No media assets found matching the search criteria.
          </p>
          {(search || typeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
              }}
              className="px-4 py-2 text-xs font-bold uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all"
            >
              <div className="relative aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
                    <Video className="w-8 h-8 mb-1 text-neutral-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Video Asset</span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Overlay Action Buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 text-white shadow-xs transition-colors cursor-pointer"
                    title="Preview full size"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.url)}
                    className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 text-white shadow-xs transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
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
                  {confirmingDeleteId === item.id ? (
                    <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg p-0.5 animate-in fade-in duration-100 shadow-xs">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer disabled:opacity-50 transition-colors"
                        title="Confirm permanent deletion"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete?</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="p-0.5 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Size Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-950 truncate max-w-md">
                  {previewItem.name}
                </h3>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {previewItem.url}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-900 flex items-center justify-center min-h-[300px] max-h-[65vh] overflow-auto">
              {previewItem.type === 'video' ? (
                <video src={previewItem.url} controls className="max-h-[60vh] max-w-full rounded-lg" />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg"
                />
              )}
            </div>

            <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopy(previewItem.id, previewItem.url)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Asset URL</span>
              </button>

              <a
                href={previewItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950"
              >
                <span>Open Original in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
