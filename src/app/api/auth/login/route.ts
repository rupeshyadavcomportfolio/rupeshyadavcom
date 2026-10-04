import { NextResponse } from 'next/server';
import { setAdminSession, verifyCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
