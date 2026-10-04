'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Review } from '@/types/portfolio';
import { Plus, Trash2, Edit2, Star, X } from 'lucide-react';

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview?.client_name || !editingReview?.review) return;

    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReview),
      });

      if (res.ok) {
        const saved = await res.json();
        setReviews((prev) => {
          const idx = prev.findIndex((r) => r.id === saved.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [...prev, saved];
        });
        setEditingReview(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"?`)) return;

    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
      router.refresh();
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-50/80 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors';
  const labelClass =
    'text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Endorsements
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            CLIENT REVIEWS & TESTIMONIALS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage genuine client reviews and endorsements.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingReview({
              client_name: '',
              company: '',
              review: '',
              rating: 5,
              project_name: '',
              featured: true,
              published: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingReview && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
              {editingReview.id ? 'Edit Review' : 'New Review'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="p-1 text-neutral-400 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Client Name *</label>
              <input
                type="text"
                required
                value={editingReview.client_name || ''}
                onChange={(e) => setEditingReview({ ...editingReview, client_name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Company / Organization</label>
              <input
                type="text"
                value={editingReview.company || ''}
                onChange={(e) => setEditingReview({ ...editingReview, company: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Rating (1-5 Stars)</label>
              <select
                value={editingReview.rating || 5}
                onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                className={inputClass}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Review Quote *</label>
            <textarea
              required
              rows={4}
              value={editingReview.review || ''}
              onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100">
            <div className="flex items-center space-x-5">
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingReview.published !== false}
                  onChange={(e) => setEditingReview({ ...editingReview, published: e.target.checked })}
                  className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
                />
                <span>Published</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingReview.featured)}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    rev.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {rev.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed italic line-clamp-4">
                &ldquo;{rev.review}&rdquo;
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-950 block">
                  {rev.client_name}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {rev.company}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingReview(rev)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(rev.id, rev.client_name)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
