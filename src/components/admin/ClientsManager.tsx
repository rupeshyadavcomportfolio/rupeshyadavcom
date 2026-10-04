'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types/portfolio';
import { Plus, Trash2, Edit2, ExternalLink, Check, X, Building2, Loader2 } from 'lucide-react';

export function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [saving, setSaving] = useState(false);

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
      <div className="flex items-center justify-between bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Collaborations
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            CLIENTS & COLLABORATIONS
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage real client partnerships displayed on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingClient({
              name: '',
              company: '',
              industry: '',
              website_url: '',
              logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=80&q=80',
              description: '',
              enabled: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingClient && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
              {editingClient.id ? 'Edit Client' : 'New Client'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Client / Company Name *
              </label>
              <input
                type="text"
                required
                value={editingClient.company || editingClient.name || ''}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, name: e.target.value, company: e.target.value })
                }
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Industry
              </label>
              <input
                type="text"
                placeholder="e.g. Technology, Fashion, Creative Studio"
                value={editingClient.industry || ''}
                onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Website URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://client.com"
                value={editingClient.website_url || ''}
                onChange={(e) => setEditingClient({ ...editingClient, website_url: e.target.value })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Collaboration Summary
              </label>
              <input
                type="text"
                placeholder="Brief summary of creative deliverables"
                value={editingClient.description || ''}
                onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
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
                className="w-4 h-4 rounded-xs"
              />
              <label htmlFor="client_active" className="text-xs font-semibold cursor-pointer">
                Display on Public Website
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-3 py-1.5 text-xs font-semibold border rounded-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 text-xs font-bold uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
              >
                {saving ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {client.industry || 'Client'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                    client.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-500/10 text-neutral-400'
                  }`}
                >
                  {client.enabled ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {client.company || client.name}
              </h3>
              {client.description && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {client.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
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
                  onClick={() => setEditingClient(client)}
                  className="p-1 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(client.id, client.company || client.name)}
                  className="p-1 text-red-500 hover:text-red-700"
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
