import { getSession } from '@/tools';
import { redirect } from 'next/navigation';

export default async function OriginsLayout({
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
