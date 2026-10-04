import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/db';
import { BASE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedProjects = await getProjects({ status: 'published' });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/work/graphic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work/video`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work/web`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = publishedProjects
    .filter((p) => !p.seo?.no_index)
    .map((p) => {
      const url =
        p.type === 'case_study'
          ? `${BASE_URL}/case-study/${p.slug}`
          : `${BASE_URL}/work/${p.type}/${p.slug}`;

      return {
        url,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: 'monthly',
        priority: p.featured ? 0.9 : 0.7,
      };
    });

  return [...staticRoutes, ...projectRoutes];
}
