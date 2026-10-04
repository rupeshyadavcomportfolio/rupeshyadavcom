import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import { MessageSquare, Phone, Check, Clock, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services for Local Businesses & Brands — Rupesh Yadav',
  description: 'Affordable graphic design, Instagram reels, video ads, logo, and website development services for local shops, clinics, brands, and businesses.',
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone || '8839775265';

  const localServices = [
    {
      id: 'social-media',
      title: 'Social Media & Festival Posts',
      badge: 'Popular for Shops & Brands',
      tagline: 'त्योहार, ऑफर्स और डेली सोशल मीडिया पोस्ट',
      description: 'Daily Instagram & Facebook posts for festivals (Diwali, Holi, Eid, New Year), special discounts, and product promotion.',
      deliverables: [
        'HD Ready-to-post graphics (1:1 Square & 4:5 Portrait)',
        'Your shop name, logo, phone number & address included',
        'Fast 24-hour delivery',
      ],
      whatsappMsg: 'Hi Rupesh, mujhe Festival & Social Media posts design karwane hain. Rate aur packages batayein.',
    },
    {
      id: 'reels-video',
      title: 'Instagram Reels & Shop Promo Videos',
      badge: 'High Engagement',
      tagline: 'दुकान, प्रोडक्ट्स और ऑफर्स की वायरल रील्स',
      description: 'Eye-catching short video edits (9:16 vertical) with trending music, bold text overlays, and sound effects for Instagram & WhatsApp Status.',
      deliverables: [
        'Shop walk-through & product showcase edits',
        'Offer & discount promo videos (15-30 seconds)',
        'Delivered in high quality 1080p for Reels & Status',
      ],
      whatsappMsg: 'Hi Rupesh, mujhe Instagram Reels & Video Ads banwani hain. Details batayein.',
    },
    {
      id: 'logo-branding',
      title: 'Logo & Business Identity',
      badge: 'One-Time Setup',
      tagline: 'दुकान/कंपनी का लोगो और विजिटिंग कार्ड',
      description: 'Professional logo design, visiting card, bill book, letterhead, and flex board designs to give your business an established look.',
      deliverables: [
        'Custom Logo (HD PNG, Vector & Source Files)',
        'Visiting card design ready for local printing',
        'Letterhead & bill book format',
      ],
      whatsappMsg: 'Hi Rupesh, mujhe Logo & Visiting card design karwana hai. Charges kya hain?',
    },
    {
      id: 'business-website',
      title: 'Business Website & Google Presence',
      badge: 'Google & Online Reach',
      tagline: 'बिजनेस वेबसाइट और डायरेक्ट व्हाट्सएप ऑर्डर',
      description: 'Fast-loading, mobile-friendly website so customers can find your business on Google, view your products/services, and contact you directly on WhatsApp.',
      deliverables: [
        'Mobile-friendly 1-page or multi-page website',
        'Direct WhatsApp chat & call buttons',
        'Google Search & Maps ready setup',
      ],
      whatsappMsg: 'Hi Rupesh, mujhe apne business ke liye simple website banwani hai. Details batayein.',
    },
    {
      id: 'print-marketing',
      title: 'Flex Banner, Pamphlets & Menu Cards',
      badge: 'Local Marketing',
      tagline: 'फ्लेक्स बोर्ड, पैम्फलेट और मेनू कार्ड डिजाइन',
      description: 'Print-ready marketing materials for local offline promotion: flex boards, flyers for newspaper insertion, standees, and restaurant menu cards.',
      deliverables: [
        'Print-ready high resolution files (CMYK)',
        'Custom dimensions as per your shop board/standee',
        'Hindi & English bilingual support',
      ],
      whatsappMsg: 'Hi Rupesh, mujhe Flex banner / Pamphlet design karwana hai. Details batayein.',
    },
  ];

  return (
    <div className="w-full py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Simple Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-neutral-500">
                LOCAL BUSINESS SERVICES
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              SERVICES & PRICING
            </h1>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              Clean design, video reels, and websites built for local shops, clinics, coaches, and businesses. Fast delivery and direct WhatsApp support.
            </p>
          </div>

          <a
            href={`https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20want%20to%20discuss%20services%20for%20my%20business.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold block text-neutral-950 dark:text-white">Fast 24-48h Delivery</span>
              <span className="text-[11px] text-neutral-500">Quick turnaround for local deadlines</span>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="text-xs font-bold block text-neutral-950 dark:text-white">Local Tier 2/3 Pricing</span>
              <span className="text-[11px] text-neutral-500">Pocket-friendly rates for small businesses</span>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <span className="text-xs font-bold block text-neutral-950 dark:text-white">Direct Phone & WhatsApp</span>
              <span className="text-[11px] text-neutral-500">+91 {phone}</span>
            </div>
          </div>
        </div>

        {/* Clean Service Cards (No Corporate Jargon) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {localServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all"
            >
              <div>
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full inline-block mb-3">
                  {service.badge}
                </span>

                <h3 className="text-lg font-bold text-neutral-950 dark:text-white leading-tight">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {service.tagline}
                </p>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables List */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    What You Get:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Button */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <a
                  href={`https://wa.me/91${phone}?text=${encodeURIComponent(service.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp par Rate Pucho</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Call Strip */}
        <div className="p-6 sm:p-8 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight">Need Something Urgent?</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5">
              Direct call or message Rupesh Yadav at +91 {phone}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-white/30 dark:border-black/30 rounded-full"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
            <a
              href={`https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20have%20an%20urgent%20design%20work.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white rounded-full shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
