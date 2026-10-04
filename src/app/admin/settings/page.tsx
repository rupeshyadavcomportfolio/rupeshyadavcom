import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getSiteSettings } from '@/lib/db';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';

export default async function AdminSettingsPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const settings = await getSiteSettings();
  return <SiteSettingsManager initialSettings={settings} />;
}
