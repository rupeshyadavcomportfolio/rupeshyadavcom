import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/work',
          '/work/graphic',
          '/work/video',
          '/work/web',
          '/case-study',
          '/about',
          '/services',
          '/contact',
          '/search',
        ],
        disallow: ['/admin', '/admin/*', '/api/auth/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
