'use server';

import { getSession } from '@/tools';
import { prisma } from '@/lib/prisma-setup/db';
import { revalidatePath } from 'next/cache';

export async function toggleMessageReadStatus(messageId: string) {
  const session = await getSession();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Non autorisé', status: 403 };
  }

  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return { error: 'Message non trouvé', status: 404 };
    }

    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: !message.isRead },
    });

    revalidatePath('/admin/dashboard');
    return { success: 'Statut mis à jour', status: 200 };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    return { error: 'Erreur lors de la mise à jour', status: 500 };
  }
}

export async function deleteContactMessage(messageId: string) {
  const session = await getSession();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { error: 'Non autorisé', status: 403 };
  }

  try {
    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    revalidatePath('/admin/dashboard');
    return { success: 'Message supprimé', status: 200 };
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    return { error: 'Erreur lors de la suppression', status: 500 };
  }
}
