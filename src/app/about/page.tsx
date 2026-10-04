import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import {
  ArrowUpRight,
  Phone,
  Mail,
  AtSign,
  Share2,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Rupesh Yadav — Graphic Designer, Video Editor & Web Designer',
  description:
    'Learn about Rupesh Yadav (@rupeshyadavcom) — verified Facebook, LinkedIn, Instagram, YouTube, Behance profiles, creative background, and verified contact details.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Creative Professional
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            RUPESH YADAV
          </h1>
          <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-neutral-600 mt-2">
            Graphic Designer • Video Editor • Web Designer
          </p>
        </div>

        {/* Hero Profile Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Authentic Profile Photo */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200 shadow-lg group">
              <img
                src={settings.profile_photo || '/rupesh-yadav.png'}
                alt="Rupesh Yadav - Graphic Designer, Video Editor & Web Designer"
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs font-bold shadow-md">
                <span className="flex items-center gap-2 text-neutral-900 font-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Rupesh Yadav
                </span>
                <span className="text-neutral-500 uppercase tracking-wider font-semibold">@rupeshyadavcom</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Details + Social Profiles + Direct Contact */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bio Details */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                Hi, I'm Rupesh Yadav.
              </h2>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                I am a dedicated <strong>Graphic Designer, Video Editor, and Web Designer</strong> based in India. I work directly with business owners, brands, creators, and agencies to deliver crisp, high-impact visuals that turn casual viewers into paying clients.
              </p>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                Whether you need scroll-stopping social media creatives, high-retention video reels that keep audiences hooked, or a modern, fast website for your business — I handle everything with <strong>speed, precision, and direct communication</strong>.
              </p>
            </div>

            {/* Social Profiles & Direct Contact Grid (Right under details as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* SOCIAL PROFILES Card (Matching Screenshot 2) */}
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Social Profiles
                </h3>
                <div className="space-y-3 text-xs font-semibold">
                  <a
                    href="https://www.facebook.com/rupeshyadavcom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-neutral-900 hover:text-blue-600 transition-colors py-0.5"
                  >
                    <span>Facebook</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/rupeshyadavcom/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-neutral-900 hover:text-[#0A66C2] transition-colors py-0.5"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </a>
                  <a
                    href="https://instagram.com/rupeshyadavcom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-neutral-900 hover:text-pink-600 transition-colors py-0.5"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </a>
                  <a
                    href="https://youtube.com/@rupeshyadavcom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-neutral-900 hover:text-red-600 transition-colors py-0.5"
                  >
                    <span>YouTube</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </a>
                  <a
                    href="https://behance.net/rupeshyadavcom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-neutral-900 hover:text-blue-700 transition-colors py-0.5"
                  >
                    <span>Behance</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* DIRECT CONTACT Card (Matching Screenshot 5) */}
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
                    Direct Contact
                  </h3>
                  <div className="space-y-3.5 text-xs font-bold">
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-center gap-2.5 text-neutral-900 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>+91 {settings.phone}</span>
                    </a>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2.5 text-neutral-900 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{settings.email}</span>
                    </a>
                    <div className="flex items-center gap-2.5 text-neutral-900">
                      <AtSign className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>{settings.social_handle}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20am%20interested%20in%20working%20with%20you!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                DIRECT WHATSAPP CHAT
              </a>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                VIEW MY WORK
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
