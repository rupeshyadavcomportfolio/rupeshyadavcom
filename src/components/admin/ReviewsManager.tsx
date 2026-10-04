'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Review } from '@/types/portfolio';
import { Plus, Trash2, Edit2, Star, Check, X } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Endorsements
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            CLIENT REVIEWS & TESTIMONIALS
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
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
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingReview && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#121212] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
              {editingReview.id ? 'Edit Review' : 'New Review'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={editingReview.client_name || ''}
                onChange={(e) => setEditingReview({ ...editingReview, client_name: e.target.value })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={editingReview.company || ''}
                onChange={(e) => setEditingReview({ ...editingReview, company: e.target.value })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                Rating (1-5 Stars)
              </label>
              <select
                value={editingReview.rating || 5}
                onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
              Review Quote *
            </label>
            <textarea
              required
              rows={4}
              value={editingReview.review || ''}
              onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
              className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#181818] border rounded-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingReview.published !== false}
                  onChange={(e) => setEditingReview({ ...editingReview, published: e.target.checked })}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Published</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingReview.featured)}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-3 py-1.5 text-xs font-semibold border rounded-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 text-xs font-bold uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
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
            className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                    rev.published ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-500/10 text-neutral-400'
                  }`}
                >
                  {rev.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed italic line-clamp-4">
                "{rev.review}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-950 dark:text-white block">
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
                  className="p-1 text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(rev.id, rev.client_name)}
                  className="p-1 text-red-500 hover:text-red-700"
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
