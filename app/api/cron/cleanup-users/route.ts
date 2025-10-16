import { prisma } from '@/lib/prisma-setup/db';
import { NextResponse } from 'next/server';

/**
 * Cron Job : Nettoyage automatique des comptes zombies
 *
 * Supprime les utilisateurs qui :
 * - N'ont pas vérifié leur email (emailVerified = false)
 * - Ont créé leur compte il y a plus de 30 jours
 *
 * Fréquence : 2x par mois (configuré dans vercel.json)
 * Sécurité : Requiert le header Authorization avec CRON_SECRET
 */
export async function GET(request: Request) {
  try {
    // 🔐 Vérification du secret pour sécuriser l'endpoint
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.warn('⚠️ Tentative d\'accès non autorisée au Cron cleanup');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 🗓️ Calcul de la date limite (30 jours)
    const DAYS_BEFORE_DELETE = 30;
    const dateLimit = new Date(
      Date.now() - DAYS_BEFORE_DELETE * 24 * 60 * 60 * 1000
    );

    console.log(`🧹 Début du nettoyage des comptes zombies (créés avant le ${dateLimit.toLocaleDateString()})`);

    // 🗑️ Supprimer les utilisateurs non vérifiés créés il y a plus de 30 jours
    const result = await prisma.user.deleteMany({
      where: {
        emailVerified: false,
        createdAt: {
          lt: dateLimit,
        },
      },
    });

    const message = `${result.count} compte(s) zombie(s) supprimé(s)`;
    console.log(`✅ Cron cleanup terminé : ${message}`);

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erreur lors du Cron cleanup:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
