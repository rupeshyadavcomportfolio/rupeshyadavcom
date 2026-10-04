import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigationBar } from '@/components/layout/MobileNavigationBar';
import { getSiteSettings } from '@/lib/db';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.default_seo_title,
      template: `%s | ${settings.name}`,
    },
    description: settings.default_seo_description,
    keywords: [
      'Graphic Designer',
      'Video Editor',
      'Web Designer',
      'Rupesh Yadav',
      '@rupeshyadavcom',
      'Motion Graphics',
      'Social Media Ads',
      'Next.js Web Design',
    ],
    authors: [{ name: settings.name, url: 'https://rupeshyadav.com' }],
    creator: settings.name,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rupeshyadav.com'),
    openGraph: {
      title: settings.default_seo_title,
      description: settings.default_seo_description,
      url: 'https://rupeshyadav.com',
      siteName: `${settings.name} Portfolio`,
      images: [
        {
          url: settings.default_og_image,
          width: 1200,
          height: 630,
          alt: settings.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.default_seo_title,
      description: settings.default_seo_description,
      creator: settings.social_handle,
      images: [settings.default_og_image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const personSchema = generatePersonSchema(settings);
  const websiteSchema = generateWebSiteSchema(settings);

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {settings.search_console_code && (
          <meta name="google-site-verification" content={settings.search_console_code} />
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-neutral-900 antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer settings={settings} />
          <MobileNavigationBar phone={settings.phone} />
        </ThemeProvider>
      </body>
    </html>
  );
}
