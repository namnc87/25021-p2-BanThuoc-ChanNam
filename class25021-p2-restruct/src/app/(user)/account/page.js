// Account Page - Server Component
import { redirect } from 'next/navigation';
import { checkAuth } from '@/actions/auth';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  redirect('/account/profile');
}
