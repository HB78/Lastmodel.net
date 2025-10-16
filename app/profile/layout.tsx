import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar/navbar';
import { getSessionWithProfileCheck } from '@/tools';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Une seule fonction qui fait tout : session + vérification profil
  const { session, isProfileComplete } = await getSessionWithProfileCheck();
  if (!session?.user?.id) redirect('/signin');
  if (!isProfileComplete) redirect('/create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
