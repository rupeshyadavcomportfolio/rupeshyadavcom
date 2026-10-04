import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getContactMessages } from '@/lib/db';
import { MessagesManager } from '@/components/admin/MessagesManager';

export default async function AdminMessagesPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const messages = await getContactMessages();
  return <MessagesManager initialMessages={messages} />;
}
