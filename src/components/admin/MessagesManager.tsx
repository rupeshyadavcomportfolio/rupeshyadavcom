'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ContactMessage } from '@/types/portfolio';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Trash2,
  ArrowUpRight,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
  Send,
  MessageSquare,
  Check,
} from 'lucide-react';

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUpdateStatus = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
        showToast('success', `✓ Inquiry status marked as "${newStatus}".`);
        router.refresh();
      } else {
        showToast('error', 'Failed to update message status');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Update error');
    }
  };

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        showToast('success', `✓ Deleted inquiry from "${name}".`);
        setConfirmingDeleteId(null);
        router.refresh();
      } else {
        showToast('error', 'Failed to delete message');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete error');
    } finally {
      setDeletingId(null);
    }
  };

  const unreadCount = useMemo(() => {
    return messages.filter((m) => m.status === 'unread').length;
  }, [messages]);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          m.company?.toLowerCase().includes(q) ||
          m.service?.toLowerCase().includes(q) ||
          m.phone?.includes(q)
        );
      }
      return true;
    });
  }, [messages, filter, search]);

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
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
              Inbox
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            CLIENT INQUIRIES & MESSAGES
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
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
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {tab === 'all'
                ? 'All Messages'
                : tab === 'unread'
                ? `Unread (${unreadCount})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-2xl shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search inquiries by client, email, company, or message..."
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

        <span className="text-xs text-neutral-500 font-medium">
          Showing {filtered.length} of {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-500">
            No inquiries found matching this view.
          </p>
          {(search || filter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="px-4 py-2 text-xs font-bold uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => {
            const isUnread = msg.status === 'unread';

            return (
              <div
                key={msg.id}
                className={`p-6 bg-white border rounded-2xl shadow-xs space-y-4 transition-all ${
                  isUnread ? 'border-neutral-950 ring-1 ring-neutral-950/10' : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                      {isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      )}
                      <span>{msg.name}</span>
                    </h3>
                    {msg.company && (
                      <span className="text-xs text-neutral-600 font-medium flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {msg.company}
                      </span>
                    )}
                    {msg.service && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200">
                        {msg.service}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>

                    <select
                      value={msg.status}
                      onChange={(e) => handleUpdateStatus(msg.id, e.target.value as any)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg border cursor-pointer ${
                        msg.status === 'unread'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : msg.status === 'replied'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : msg.status === 'archived'
                          ? 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-sm text-neutral-900 leading-relaxed whitespace-pre-line bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  {msg.message}
                </p>

                {/* Contact info and Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-4 text-neutral-600 font-medium">
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-neutral-950 font-semibold text-neutral-800"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{msg.email}</span>
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-neutral-950 font-semibold text-neutral-800"
                      >
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{msg.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* 1-Click Interactive Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Mark Read/Unread Toggle */}
                    {isUnread ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, 'read')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark Read</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, 'unread')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl cursor-pointer transition-colors"
                      >
                        <span>Mark Unread</span>
                      </button>
                    )}

                    {/* Mark Replied */}
                    {msg.status !== 'replied' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, 'replied')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl cursor-pointer transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Replied</span>
                      </button>
                    )}

                    {/* Direct Email Compose */}
                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `Re: ${msg.service || 'Creative Project Inquiry'} — Rupesh Yadav`
                      )}&body=${encodeURIComponent(
                        `Hi ${msg.name},\n\nThank you for reaching out regarding your project inquiry.\n\nBest regards,\nRupesh Yadav\nrupeshyadav2610@gmail.com`
                      )}`}
                      onClick={() => {
                        if (msg.status === 'unread') {
                          handleUpdateStatus(msg.id, 'read');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Reply Email</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete Message */}
                    {confirmingDeleteId === msg.id ? (
                      <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl p-1 animate-in fade-in duration-100 shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleDelete(msg.id, msg.name)}
                          disabled={deletingId === msg.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                          title="Confirm permanent deletion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete?</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(null)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(msg.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
