import { NextResponse } from 'next/server';
import { getContactMessages, createContactMessage } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getContactMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Input validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email and message are required fields.' },
        { status: 400 }
      );
    }

    // Simple spam protection
    if (data.website_hp_check) {
      // Honeypot field was filled by a bot
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    const newMsg = await createContactMessage({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      company: data.company?.trim() || '',
      service: data.service?.trim() || 'General Inquiry',
      message: data.message.trim(),
    });

    return NextResponse.json({ success: true, data: newMsg }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
