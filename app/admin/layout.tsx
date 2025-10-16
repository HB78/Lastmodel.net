import { getSession } from '@/tools';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }
  return <>{children}</>;
}
