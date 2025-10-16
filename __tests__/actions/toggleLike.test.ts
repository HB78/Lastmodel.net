import { toggleLikeAction } from '@/actions/creation/toggleLike';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';

// Mock des dépendances
vi.mock('@/lib/prisma-setup/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    like: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/tools', () => ({
  getSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('toggleLikeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retourne une erreur si non authentifié', async () => {
    (getSession as any).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('profileId', 'profile123');

    const result = await toggleLikeAction(formData);

    expect(result).toEqual({
      error: 'Non authentifié',
      status: 401,
    });
  });

  test('retourne une erreur si le profil n\'existe pas', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('profileId', 'invalid-profile');

    const result = await toggleLikeAction(formData);

    expect(result).toEqual({
      error: 'Profil non trouvé',
      status: 404,
    });
  });

  test('empêche de liker son propre profil', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'user123' });

    const formData = new FormData();
    formData.append('profileId', 'user123');

    const result = await toggleLikeAction(formData);

    expect(result).toEqual({
      error: 'Vous ne pouvez pas liker votre propre profil',
      status: 400,
    });
  });

  test('ajoute un like quand il n\'existe pas', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'profile456' });
    (prisma.like.findUnique as any).mockResolvedValue(null);
    (prisma.like.create as any).mockResolvedValue({ id: 'like789' });

    const formData = new FormData();
    formData.append('profileId', 'profile456');

    const result = await toggleLikeAction(formData);

    expect(result).toEqual({
      message: 'Like ajouté avec succès',
      status: 200,
      isLiked: true,
    });

    expect(prisma.like.create).toHaveBeenCalledWith({
      data: {
        userId: 'user123',
        profileId: 'profile456',
      },
    });
  });

  test('supprime un like quand il existe déjà', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'profile456' });
    (prisma.like.findUnique as any).mockResolvedValue({ id: 'existing-like' });
    (prisma.like.delete as any).mockResolvedValue({ id: 'existing-like' });

    const formData = new FormData();
    formData.append('profileId', 'profile456');

    const result = await toggleLikeAction(formData);

    expect(result).toEqual({
      message: 'Like retiré avec succès',
      status: 200,
      isLiked: false,
    });

    expect(prisma.like.delete).toHaveBeenCalledWith({
      where: {
        id: 'existing-like',
      },
    });
  });

  test('gère les erreurs de validation Zod', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });

    const formData = new FormData();
    // ProfileId manquant ou invalide

    const result = await toggleLikeAction(formData);

    expect(result.error).toBe('Données invalides');
    expect(result.status).toBe(400);
  });
});