'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types/portfolio';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  Building2,
  Upload,
  Loader2,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoMsg, setLogoMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'active' | 'hidden'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

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
    if (!editingClient?.name?.trim() && !editingClient?.company?.trim()) {
      showToast('error', 'Client or company name is required');
      return;
    }

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
        showToast('success', `✓ Client "${saved.company || saved.name}" saved successfully!`);
        router.refresh();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Failed to save client');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);

  const executeDeleteClient = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== id));
        showToast('success', `✓ Deleted client "${name}".`);
        setClientToDelete(null);
        router.refresh();
      } else {
        showToast('error', 'Failed to delete client');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete error');
    }
  };

  // 1-Click Toggle Active/Hidden on the card directly
  const handleToggleEnable = async (client: Client) => {
    const newEnabled = !client.enabled;
    setTogglingId(client.id);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, enabled: newEnabled }),
      });

      if (res.ok) {
        const saved = await res.json();
        setClients(clients.map((c) => (c.id === client.id ? saved : c)));
        showToast(
          'success',
          `✓ "${client.company || client.name}" is now ${newEnabled ? 'displayed publicly' : 'hidden from public view'}!`
        );
        router.refresh();
      } else {
        showToast('error', 'Failed to update client visibility');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Update error');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (filterEnabled === 'active' && !c.enabled) return false;
      if (filterEnabled === 'hidden' && c.enabled) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [clients, search, filterEnabled]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Client Directory
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            OUR CLIENTS & BRANDS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage real client collaborations, brand logos, and public homepage endorsements.
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
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
              {editingClient.id ? `Edit Client: ${editingClient.company || editingClient.name}` : 'Create New Client'}
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
                  <span>Upload Logo from Files</span>
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

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
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
                className="px-5 py-2 text-xs font-bold uppercase bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search clients by name, company, industry..."
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
          {(['all', 'active', 'hidden'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterEnabled(filter)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                filterEnabled === filter
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filter === 'all' ? 'All Clients' : filter === 'active' ? 'Active' : 'Hidden'}
            </button>
          ))}
          <span className="text-xs text-neutral-400 font-medium pl-2">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
          </span>
        </div>
      </div>

      {/* Grid of Clients with Logo Display */}
      {filteredClients.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <Building2 className="w-10 h-10 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-500">
            No clients found matching the search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const isToggling = togglingId === client.id;

            return (
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
                        <span className="text-xs font-bold uppercase text-neutral-500">
                          {client.company || client.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {client.industry || 'Client'}
                    </span>

                    {/* Interactive 1-Click Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(client)}
                      disabled={isToggling}
                      title="Click to toggle display on public website"
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        client.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-800'
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : client.enabled ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      <span>{client.enabled ? 'Active' : 'Hidden'}</span>
                    </button>
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
                      <span>Visit Site</span>
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
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Client"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientToDelete({ id: client.id, name: client.company || client.name })}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern In-App Delete Confirmation Modal */}
      {clientToDelete && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setClientToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-950">Delete Client?</h3>
                <p className="text-xs text-neutral-500">Remove this brand from your client directory.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-700 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 leading-relaxed">
              Are you sure you want to permanently delete <strong>&ldquo;{clientToDelete.name}&rdquo;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDeleteClient(clientToDelete.id, clientToDelete.name)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
