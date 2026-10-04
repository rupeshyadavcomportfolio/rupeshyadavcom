import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getReviews } from '@/lib/db';
import { ReviewsManager } from '@/components/admin/ReviewsManager';

export default async function AdminReviewsPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const reviews = await getReviews();
  return <ReviewsManager initialReviews={reviews} />;
}
