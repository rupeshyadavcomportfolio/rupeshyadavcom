import { getProjects, getClients, getReviews, getSiteSettings } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { SelectedWork } from '@/components/home/SelectedWork';
import { GraphicSection } from '@/components/home/GraphicSection';
import { VideoSection } from '@/components/home/VideoSection';
import { WebsiteSection } from '@/components/home/WebsiteSection';
import { ClientLogos } from '@/components/home/ClientLogos';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { ContactCta } from '@/components/home/ContactCta';

export const revalidate = 60; // Next.js ISR revalidation

export default async function HomePage() {
  const [projects, clients, reviews, settings] = await Promise.all([
    getProjects({ status: 'published' }),
    getClients(),
    getReviews(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Selected Work (Featured across types with instant filter switch) */}
      <SelectedWork projects={projects} />

      {/* 3. Graphic Work */}
      <GraphicSection
        projects={projects}
        limit={settings.homepage_limits?.graphic || 6}
      />

      {/* 4. Video Work */}
      <VideoSection
        projects={projects}
        limit={settings.homepage_limits?.video || 4}
      />

      {/* 5. Website Work */}
      <WebsiteSection
        projects={projects}
        limit={settings.homepage_limits?.website || 4}
      />

      {/* 6. Clients & Collaborations */}
      <ClientLogos clients={clients} />

      {/* 7. Reviews & Endorsements */}
      <ReviewsSection reviews={reviews} />

      {/* 8. About Rupesh */}
      <AboutSection settings={settings} />

      {/* 9. Services */}
      <ServicesSection settings={settings} />

      {/* 10. Contact CTA & Interactive Form */}
      <ContactCta />
    </div>
  );
}
