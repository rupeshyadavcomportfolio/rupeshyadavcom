import { getProjects, getClients, getSiteSettings } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { GraphicSection } from '@/components/home/GraphicSection';
import { VideoSection } from '@/components/home/VideoSection';
import { WebsiteSection } from '@/components/home/WebsiteSection';
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
    <div className="flex flex-col w-full">
      {/* 1. Ultra-clean Hero Header */}
      <Hero phone={settings.phone} />

      {/* 2. Graphic Work with Size-Wise Aspect Ratio Filter (1:1, 4:5, 9:16, 16:9, 3:4) */}
      <GraphicSection projects={projects} />

      {/* 3. Video Work (Reels, Motion, Ads with instant modal video playback) */}
      <VideoSection projects={projects} />

      {/* 4. Website Work (Clean browser mockups & live links) */}
      <WebsiteSection projects={projects} />

      {/* 5. Clients & Collaborations */}
      <ClientLogos clients={clients} />

      {/* 6. Direct Contact CTA & Brief Form */}
      <ContactCta />
    </div>
  );
}
