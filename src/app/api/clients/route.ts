import { NextResponse } from 'next/server';
import { getClients, saveClient } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const client = await saveClient(data);
    revalidatePath('/');
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 });
  }
}
