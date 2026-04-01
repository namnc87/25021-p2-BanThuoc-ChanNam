// Addresses Page - Server Component
import { checkAuth } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { getUserAddresses } from '@/actions/user';
import AddressesList from './AddressesList';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account/addresses');
  }

  const addresses = await getUserAddresses();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Địa chỉ giao hàng</h2>
      <AddressesList addresses={addresses} />
    </div>
  );
}
