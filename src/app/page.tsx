import { getProjects, getClients, getSiteSettings } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { GraphicPinterestWall } from '@/components/home/GraphicPinterestWall';
import { VideoPinterestWall } from '@/components/home/VideoPinterestWall';
import { WebsitePinterestWall } from '@/components/home/WebsitePinterestWall';
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
      {/* Top Minimal Hero with Quick Jump Anchors */}
      <Hero phone={settings.phone} photo={settings.profile_photo || '/rupesh-yadav.png'} />

      {/* CATEGORY 01: GRAPHIC DESIGN (Pinterest Masonry Wall with Front Size Filters) */}
      <GraphicPinterestWall projects={projects} ownerPhone={settings.phone} />

      {/* CATEGORY 02: VIDEO & REELS (Pinterest Video Wall with Instant Playback) */}
      <VideoPinterestWall projects={projects} ownerPhone={settings.phone} />

      {/* CATEGORY 03: WEBSITES & WEB APPS (Clean Browser Visual Mockups & Live Links) */}
      <WebsitePinterestWall projects={projects} ownerPhone={settings.phone} />

      {/* Clients & Collaborations */}
      <ClientLogos clients={clients} />

      {/* Direct Contact & Brief Form */}
      <ContactCta />
    </div>
  );
}
