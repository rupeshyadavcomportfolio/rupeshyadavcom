'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Review } from '@/types/portfolio';
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  MessageSquareQuote,
} from 'lucide-react';

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'featured'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview?.client_name?.trim() || !editingReview?.review?.trim()) {
      showToast('error', 'Client name and review quote are required');
      return;
    }

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
        showToast('success', `✓ Review from "${saved.client_name}" saved successfully!`);
        router.refresh();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Failed to save review');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; name: string } | null>(null);

  const executeDeleteReview = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
        showToast('success', `✓ Deleted review from "${name}".`);
        setReviewToDelete(null);
        router.refresh();
      } else {
        showToast('error', 'Failed to delete review');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete error');
    }
  };

  // 1-Click Toggle Published
  const handleTogglePublished = async (review: Review) => {
    const newPublished = !review.published;
    setTogglingId(`pub-${review.id}`);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, published: newPublished }),
      });

      if (res.ok) {
        const saved = await res.json();
        setReviews(reviews.map((r) => (r.id === review.id ? saved : r)));
        showToast(
          'success',
          `✓ Review from "${review.client_name}" is now ${newPublished ? 'Published' : 'Hidden'}!`
        );
        router.refresh();
      }
    } catch (err: any) {
      showToast('error', 'Failed to update review status');
    } finally {
      setTogglingId(null);
    }
  };

  // 1-Click Toggle Featured
  const handleToggleFeatured = async (review: Review) => {
    const newFeatured = !review.featured;
    setTogglingId(`feat-${review.id}`);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, featured: newFeatured }),
      });

      if (res.ok) {
        const saved = await res.json();
        setReviews(reviews.map((r) => (r.id === review.id ? saved : r)));
        showToast(
          'success',
          `✓ Review from "${review.client_name}" ${newFeatured ? 'featured on homepage' : 'set to standard'}!`
        );
        router.refresh();
      }
    } catch (err: any) {
      showToast('error', 'Failed to update review spotlight');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (statusFilter === 'published' && !r.published) return false;
      if (statusFilter === 'featured' && !r.featured) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.client_name.toLowerCase().includes(q) ||
          r.company?.toLowerCase().includes(q) ||
          r.review.toLowerCase().includes(q) ||
          r.project_name?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reviews, search, statusFilter]);

  const inputClass =
    'w-full px-3.5 py-2.5 text-xs font-medium bg-neutral-50 hover:bg-neutral-50/80 focus:bg-white text-neutral-900 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors';
  const labelClass =
    'text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5';

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
            Endorsements
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            CLIENT REVIEWS & TESTIMONIALS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage genuine client reviews, star ratings, and homepage testimonials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingReview({
              client_name: '',
              company: '',
              review: '',
              rating: 5,
              project_name: '',
              featured: true,
              published: true,
            });
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingReview && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-2xl shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
              {editingReview.id ? `Edit Review: ${editingReview.client_name}` : 'Create New Review'}
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
                <option value={2}>2 Stars ★★</option>
                <option value={1}>1 Star ★</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Project Name / Context (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Aura Brand Campaign"
              value={editingReview.project_name || ''}
              onChange={(e) => setEditingReview({ ...editingReview, project_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Review Quote *</label>
            <textarea
              rows={4}
              required
              placeholder="Enter client testimonial text..."
              value={editingReview.review || ''}
              onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingReview.featured)}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="w-4 h-4 rounded-md"
                />
                <span className="text-xs font-bold text-neutral-800">Featured Testimonial</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingReview.published !== false}
                  onChange={(e) => setEditingReview({ ...editingReview, published: e.target.checked })}
                  className="w-4 h-4 rounded-md"
                />
                <span className="text-xs font-bold text-neutral-800">Published (Visible Publicly)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 text-xs font-bold uppercase border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold uppercase bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reviews by client, company, or text..."
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
          {(['all', 'published', 'featured'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                statusFilter === filter
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filter === 'all' ? 'All Reviews' : filter === 'published' ? 'Published' : '★ Featured'}
            </button>
          ))}
          <span className="text-xs text-neutral-400 font-medium pl-2">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <MessageSquareQuote className="w-10 h-10 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-500">
            No testimonials found matching the search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => {
            const isTogglingPub = togglingId === `pub-${rev.id}`;
            const isTogglingFeat = togglingId === `feat-${rev.id}`;

            return (
              <div
                key={rev.id}
                className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-neutral-300 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (rev.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quick 1-Click Action Badges */}
                    <div className="flex items-center gap-1.5">
                      {/* Featured Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(rev)}
                        disabled={isTogglingFeat}
                        title="Click to toggle Homepage Featured spotlight"
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          rev.featured
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-300 hover:bg-yellow-100'
                            : 'bg-neutral-100 text-neutral-400 hover:text-neutral-700'
                        }`}
                      >
                        {isTogglingFeat ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Star className={`w-3 h-3 ${rev.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        )}
                        <span>{rev.featured ? 'Featured' : 'Standard'}</span>
                      </button>

                      {/* Published Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(rev)}
                        disabled={isTogglingPub}
                        title="Click to toggle Public Visibility"
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          rev.published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200'
                        }`}
                      >
                        {isTogglingPub ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : rev.published ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <span>{rev.published ? 'Live' : 'Draft'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-800 italic leading-relaxed whitespace-pre-line bg-neutral-50/70 p-3.5 rounded-xl border border-neutral-100">
                    &ldquo;{rev.review}&rdquo;
                  </p>

                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">
                      {rev.client_name}
                    </h4>
                    {rev.company && (
                      <p className="text-[11px] text-neutral-500 font-medium">
                        {rev.company}
                      </p>
                    )}
                    {rev.project_name && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {rev.project_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReview(rev);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewToDelete({ id: rev.id, name: rev.client_name })}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern In-App Delete Confirmation Modal */}
      {reviewToDelete && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setReviewToDelete(null)}
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
                <h3 className="text-base font-bold text-neutral-950">Delete Review?</h3>
                <p className="text-xs text-neutral-500">Remove this testimonial from your portfolio.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-700 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 leading-relaxed">
              Are you sure you want to permanently delete the review from <strong>&ldquo;{reviewToDelete.name}&rdquo;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDeleteReview(reviewToDelete.id, reviewToDelete.name)}
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
