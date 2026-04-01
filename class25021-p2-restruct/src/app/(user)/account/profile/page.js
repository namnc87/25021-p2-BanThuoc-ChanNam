// Profile Page - Server Component
import { checkAuth } from '@/actions/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account/profile');
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Thông tin cá nhân</h2>
      <ProfileForm user={user} />
    </div>
  );
}
