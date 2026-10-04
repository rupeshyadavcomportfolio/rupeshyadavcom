'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactForm({ prefilledService }: { prefilledService?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: prefilledService || 'Graphic Design',
    message: '',
    website_hp_check: '', // honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit message.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Graphic Design',
        message: '',
        website_hp_check: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
            Message Received
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Thanks! Your message has been received. Rupesh Yadav will review your requirements and respond shortly.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field (hidden from human users) */}
          <input
            type="text"
            name="website_hp_check"
            value={formData.website_hp_check}
            onChange={(e) => setFormData({ ...formData, website_hp_check: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Company
              </label>
              <input
                type="text"
                placeholder="Company / Brand"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Service
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
              >
                <option value="Graphic Design">Graphic Design</option>
                <option value="Video">Video</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell me about your project, goals, timeline, and deliverables..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                <span>SEND MESSAGE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
