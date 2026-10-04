import React from 'react';
import { Review } from '@/types/portfolio';
import { Star, Quote } from 'lucide-react';

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const publishedReviews = reviews.filter((r) => r.published);

  if (publishedReviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Endorsements
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              WHAT CLIENTS SAY
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-lg">
              Real feedback from clients and collaborators on delivered projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-neutral-50/60 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-4" />
                <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white">
                    {rev.client_name}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {rev.company}
                  </p>
                </div>

                {rev.rating && (
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
