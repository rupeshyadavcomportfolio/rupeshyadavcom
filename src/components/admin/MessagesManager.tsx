'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactMessage } from '@/types/portfolio';
import { Mail, Phone, Building, Calendar, Trash2, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleUpdateStatus = async (id: string, newStatus: ContactMessage['status']) => {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages(messages.filter((m) => m.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Inbox
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            CLIENT INQUIRIES & MESSAGES
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review incoming project briefs, contact form submissions, and direct leads.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer ${
                filter === tab
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xs">
          <p className="text-sm text-neutral-500">No inquiries found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="p-6 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                    {msg.name}
                  </h3>
                  {msg.company && (
                    <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {msg.company}
                    </span>
                  )}
                  {msg.service && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xs">
                      {msg.service}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  <select
                    value={msg.status}
                    onChange={(e) => handleUpdateStatus(msg.id, e.target.value as any)}
                    className="ml-2 px-2 py-1 text-[11px] font-bold uppercase rounded-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Message Body */}
              <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line bg-neutral-50/50 dark:bg-[#181818] p-4 rounded-xs border border-neutral-100 dark:border-neutral-800">
                {msg.message}
              </p>

              {/* Contact info and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400 font-medium">
                  <a
                    href={`mailto:${msg.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-neutral-950 dark:hover:text-white"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{msg.email}</span>
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-neutral-950 dark:hover:text-white"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{msg.phone}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.service || 'Creative Project Inquiry'} - Rupesh Yadav`)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 font-bold uppercase tracking-wider text-xs bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
                  >
                    <span>Reply via Email</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-500/10 rounded-xs cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
