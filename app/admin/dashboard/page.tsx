import { getSession } from '@/tools';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma-setup/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <DashboardClient messages={messages} />;
}
