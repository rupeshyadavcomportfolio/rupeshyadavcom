import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getMediaList } from '@/lib/db';
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';

export default async function AdminMediaPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const media = await getMediaList();
  return <MediaLibraryManager initialMedia={media} />;
}
