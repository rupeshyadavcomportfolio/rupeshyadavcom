import { Project, SiteSettings } from '@/types/portfolio';

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rupeshyadav.com';

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

export function generatePersonSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.name,
    jobTitle: settings.roles.join(', '),
    url: BASE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: settings.profile_photo,
    sameAs: settings.social_links.map((s) => s.url),
    description: settings.bio,
  };
}

export function generateWebSiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${settings.name} Portfolio`,
    url: BASE_URL,
    description: settings.default_seo_description,
    author: {
      '@type': 'Person',
      name: settings.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateCreativeWorkSchema(project: Project, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': project.type === 'video' ? 'VideoObject' : 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.seo?.seo_description || project.short_description,
    image: project.featured_image,
    url: `${BASE_URL}/work/${project.type}/${project.slug}`,
    datePublished: project.published_at || project.created_at,
    dateModified: project.updated_at,
    author: {
      '@type': 'Person',
      name: settings.name,
      url: BASE_URL,
    },
    genre: project.category,
    keywords: project.tags?.join(', '),
    ...(project.type === 'video' && project.video_url
      ? {
          contentUrl: project.video_url,
          thumbnailUrl: [project.featured_image],
          uploadDate: project.published_at || project.created_at,
          duration: project.duration ? `PT${project.duration.replace(':', 'M')}S` : undefined,
        }
      : {}),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}
