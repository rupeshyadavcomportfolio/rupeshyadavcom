import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { ContactForm } from './ContactForm';

export function ContactCta() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 border-t border-neutral-200 bg-neutral-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: CTA Pitch */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-500">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950">
              HAVE A PROJECT IN MIND?
            </h2>
            <p className="text-base text-neutral-600 pt-1 leading-relaxed">
              Let's talk about what you want to create. Whether you need high-impact graphic design, dynamic video motion, or a modern high-performance website.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-900 rounded-sm hover:bg-neutral-100 transition-colors"
              >
                <span>VIEW MY WORK</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 rounded-xl shadow-xs">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
