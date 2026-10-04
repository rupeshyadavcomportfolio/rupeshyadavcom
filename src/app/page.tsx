import { getProjects, getClients, getSiteSettings } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { PinterestFeed } from '@/components/home/PinterestFeed';
import { ClientLogos } from '@/components/home/ClientLogos';
import { ContactCta } from '@/components/home/ContactCta';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, clients, settings] = await Promise.all([
    getProjects({ status: 'published' }),
    getClients(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Ultra-clean Minimal Header */}
      <Hero phone={settings.phone} />

      {/* 2. Pure Visual Pinterest-Style Masonry Wall with Category & Aspect-Ratio Chips */}
      <PinterestFeed projects={projects} ownerPhone={settings.phone} />

      {/* 3. Clients & Collaborations Ribbon */}
      <ClientLogos clients={clients} />

      {/* 4. Direct Quick Brief & Inquiry CTA */}
      <ContactCta />
    </div>
  );
}
