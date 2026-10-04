import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/db';
import { ContactForm } from '@/components/home/ContactForm';
import { Phone, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Rupesh Yadav — Work Together',
  description: 'Reach out to Rupesh Yadav for graphic design, short-form video production, motion graphics, and web development projects.',
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Initiate Project
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            LET'S WORK TOGETHER
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl leading-relaxed">
            Have a project in mind or looking for a creative partner for design, video or web? Send a message below or connect directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct channels column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Direct Channels
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div>
                  <span className="text-xs text-neutral-500 block mb-1">Direct Phone</span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="inline-flex items-center gap-2 text-neutral-950 dark:text-white font-bold hover:underline"
                  >
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>+91 {settings.phone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 block mb-1">WhatsApp Chat</span>
                  <a
                    href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I'd%20like%20to%20discuss%20a%20project`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 block mb-1">Email</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="inline-flex items-center gap-2 text-neutral-950 dark:text-white font-bold hover:underline"
                  >
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>{settings.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Social Profiles
              </h3>
              <ul className="space-y-2 text-xs">
                {settings.social_links.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white group"
                    >
                      <span>{link.platform}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-neutral-50/50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold uppercase tracking-tight text-neutral-950 dark:text-white mb-6">
              Project Brief Form
            </h2>
            <ContactForm prefilledService={service} />
          </div>
        </div>
      </div>
    </div>
  );
}
