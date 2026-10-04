'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types/portfolio';
import { Plus, Trash2, Edit2, ExternalLink, Check, X, Building2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoMsg, setLogoMsg] = useState<string | null>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Logo upload from device gallery
  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setUploadingLogo(true);
    setLogoMsg(`Uploading ${file.name}...`);

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
      setEditingClient((prev) => ({
        ...prev,
        logo: item.url,
      }));
      setLogoMsg(`✓ Logo uploaded successfully!`);
    } catch (err: any) {
      setLogoMsg(`Upload error: ${err.message || 'Failed to upload'}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name) return;

    setSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient),
      });

      if (res.ok) {
        const saved = await res.json();
        setClients((prev) => {
          const idx = prev.findIndex((c) => c.id === saved.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [...prev, saved];
        });
        setEditingClient(null);
        setLogoMsg(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete client "${name}"?`)) return;

    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setClients(clients.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Client Directory
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            OUR CLIENTS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage real client projects and logos displayed on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLogoMsg(null);
            setEditingClient({
              name: '',
              company: '',
              industry: '',
              website_url: '',
              logo: '',
              description: '',
              enabled: true,
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingClient && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
              {editingClient.id ? 'Edit Client' : 'New Client'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingClient(null);
                setLogoMsg(null);
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Logo Upload Section */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-800 block">
                  Client Logo
                </label>
                <p className="text-[11px] text-neutral-500">
                  Logo image upload karein (PNG / SVG / JPG) ya direct link dalein.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={logoFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() => logoFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload Logo from Gallery</span>
                </button>
              </div>
            </div>

            {/* Logo URL Input & Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <input
                type="text"
                placeholder="Or paste Logo URL (https://... or /uploads/...)"
                value={editingClient.logo || ''}
                onChange={(e) => setEditingClient({ ...editingClient, logo: e.target.value })}
                className="flex-1 w-full px-3 py-2 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-lg focus:outline-none focus:border-neutral-950"
              />

              {editingClient.logo && (
                <div className="w-28 h-12 bg-white border border-neutral-200 rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={editingClient.logo}
                    alt="Logo Preview"
                    className="max-h-9 max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {logoMsg && (
              <span className="text-xs font-semibold text-emerald-700 block">
                {logoMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Client / Company Name *
              </label>
              <input
                type="text"
                required
                value={editingClient.company || editingClient.name || ''}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, name: e.target.value, company: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Industry
              </label>
              <input
                type="text"
                placeholder="e.g. Technology, Fashion, Creative Studio"
                value={editingClient.industry || ''}
                onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Website URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://client.com"
                value={editingClient.website_url || ''}
                onChange={(e) => setEditingClient({ ...editingClient, website_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 block mb-1">
                Collaboration Summary
              </label>
              <input
                type="text"
                placeholder="Brief summary of creative deliverables"
                value={editingClient.description || ''}
                onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:outline-none focus:border-neutral-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="client_active"
                checked={editingClient.enabled !== false}
                onChange={(e) => setEditingClient({ ...editingClient, enabled: e.target.checked })}
                className="w-4 h-4 rounded-md"
              />
              <label htmlFor="client_active" className="text-xs font-bold text-neutral-800 cursor-pointer">
                Display on Public Website
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingClient(null);
                  setLogoMsg(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold uppercase bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs transition-colors"
              >
                {saving ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Clients with Logo Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-neutral-300 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Client Logo Display Box */}
              <div className="w-full h-24 bg-neutral-50 border border-neutral-200/80 rounded-xl mb-3 flex items-center justify-center p-3 overflow-hidden shadow-2xs">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={`${client.company || client.name} Logo`}
                    className="max-h-16 max-w-[150px] w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase text-neutral-500">{client.company || client.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {client.industry || 'Client'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    client.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {client.enabled ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {client.company || client.name}
              </h3>
              {client.description && (
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                  {client.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-950 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLogoMsg(null);
                    setEditingClient(client);
                  }}
                  className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(client.id, client.company || client.name)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
