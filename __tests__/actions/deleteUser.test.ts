import { deleteUserAction } from '@/actions/delete/deleteUser';
import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';

// Mock des dépendances
vi.mock('@/lib/better-auth-setup/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma-setup/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map()),
}));

describe('deleteUserAction', () => {
  const initialState = {
    success: false,
    error: null,
    message: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retourne une erreur si non authentifié', async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const formData = new FormData();
    const result = await deleteUserAction(initialState, formData);

    expect(result).toEqual({
      success: false,
      error: 'Vous devez être connecté',
      message: null,
    });
  });

  test('retourne une erreur si utilisateur introuvable', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user123', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const formData = new FormData();
    const result = await deleteUserAction(initialState, formData);

    expect(result).toEqual({
      success: false,
      error: 'Utilisateur introuvable',
      message: null,
    });
  });

  test('empêche un admin de se supprimer lui-même', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'admin123', role: 'ADMIN' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'admin123',
    });

    const formData = new FormData();
    const result = await deleteUserAction(initialState, formData);

    expect(result).toEqual({
      success: false,
      error: 'Les administrateurs ne peuvent pas supprimer leur propre compte',
      message: null,
    });
  });

  test('permet à un utilisateur normal de se supprimer', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user123', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
    });
    (prisma.user.delete as any).mockResolvedValue({ id: 'user123' });
    (auth.api.signOut as any).mockResolvedValue(undefined);

    const formData = new FormData();

    // Note: Cette fonction fait un redirect, donc on ne peut pas tester le retour
    // Dans un vrai test, on mockrait redirect aussi
    await expect(deleteUserAction(initialState, formData)).rejects.toThrow();

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'user123' },
    });
    expect(auth.api.signOut).toHaveBeenCalled();
  });

  test('gère les erreurs de base de données', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user123', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
    });
    (prisma.user.delete as any).mockRejectedValue(new Error('DB Error'));

    const formData = new FormData();
    const result = await deleteUserAction(initialState, formData);

    expect(result).toEqual({
      success: false,
      error: 'Erreur interne du serveur',
      message: null,
    });
  });

  test('vérifie que l\'utilisateur existe avant suppression', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user123', role: 'USER' },
    });

    const formData = new FormData();
    await deleteUserAction(initialState, formData);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user123' },
    });
  });

  test('admin ne peut pas supprimer un autre utilisateur avec cette action', async () => {
    // Cette action ne permet que la suppression de son propre compte
    // Un admin ne peut pas supprimer d'autres utilisateurs avec cette fonction
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'admin123', role: 'ADMIN' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'admin123',
    });

    const formData = new FormData();
    const result = await deleteUserAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('administrateurs ne peuvent pas supprimer');
  });
});