'use server';

import { sendContactEmail } from '@/lib/better-auth-setup/emailVerification';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { contactSchema } from '@/zodSchema/contactPage/contactSchema';

export async function sendMessageAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: 'Non authentifié', status: 401 };
  }

  const rawData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    subject: formData.get('subject')?.toString() || '',
    message: formData.get('message')?.toString() || '',
  };

  try {
    // Validation des données
    const validatedData = contactSchema.parse(rawData);

    // Vérification anti-spam : limiter les messages par utilisateur
    const recentMessages = await prisma.contactMessage.count({
      where: {
        email: validatedData.email,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
        },
      },
    });

    if (recentMessages >= 3) {
      return {
        error: 'Trop de messages envoyés récemment. Veuillez patienter.',
        status: 429,
      };
    }

    // Enregistrement en base de données
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    // Envoi de l'email
    await sendContactEmail(validatedData);

    return {
      success: 'Message envoyé avec succès',
      status: 200,
      messageId: savedMessage.id,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);

    return { error: "Erreur lors de l'envoi du message", status: 500 };
  }
}
