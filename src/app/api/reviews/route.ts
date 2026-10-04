import { NextResponse } from 'next/server';
import { getReviews, saveReview } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const review = await saveReview(data);
    revalidatePath('/');
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
