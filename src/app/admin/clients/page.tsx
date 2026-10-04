import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getClients } from '@/lib/db';
import { ClientsManager } from '@/components/admin/ClientsManager';

export default async function AdminClientsPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect('/admin/login');
  }

  const clients = await getClients();
  return <ClientsManager initialClients={clients} />;
}
