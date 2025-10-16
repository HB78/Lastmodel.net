import { updateUserProfileAction } from '@/actions/update/updateUserProfile';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';

// Mock des dépendances
vi.mock('@/lib/prisma-setup/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    origin: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/tools', () => ({
  getSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('updateUserProfileAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retourne une erreur si non authentifié', async () => {
    (getSession as any).mockResolvedValue(null);

    const formData = new FormData();
    const result = await updateUserProfileAction(formData);

    expect(result).toEqual({
      error: 'Non authentifié',
      status: 401,
    });
  });

  test('retourne une erreur si utilisateur non trouvé', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const formData = new FormData();
    const result = await updateUserProfileAction(formData);

    expect(result).toEqual({
      error: 'Utilisateur non trouvé ou vous ne pouvez pas modifier ce profil',
      status: 404,
    });
  });

  test('retourne une erreur si email non vérifié', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
      emailVerified: false,
    });

    const formData = new FormData();
    const result = await updateUserProfileAction(formData);

    expect(result).toEqual({
      error: 'Veuillez vérifier votre email',
      status: 401,
    });
  });

  test('met à jour le profil avec des données valides', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
      emailVerified: true,
      name: 'Old Name',
      sex: 'homme',
      age: 25,
      phone: '123456789',
      city: 'Paris',
      description: 'Old description',
      originId: 'origin1',
    });
    (prisma.origin.findUnique as any).mockResolvedValue({ id: 'origin2' });
    (prisma.user.update as any).mockResolvedValue({ id: 'user123' });

    const formData = new FormData();
    formData.append('name', 'New Name');
    formData.append('sex', 'femme');
    formData.append('age', '30');
    formData.append('phone', '987654321');
    formData.append('city', 'Lyon');
    formData.append('origin', 'France');
    formData.append('description', 'New description');

    const result = await updateUserProfileAction(formData);

    expect(result).toEqual({
      error: null,
      status: 200,
      message: 'Profil mis à jour avec succès !',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user123' },
      data: expect.objectContaining({
        name: 'New Name',
        sex: 'femme',
        age: 30,
        phone: '987654321',
        city: 'Lyon',
        originId: 'origin2',
        description: 'New description',
      }),
    });
  });

  test('retourne une erreur si origine inexistante', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
      emailVerified: true,
    });
    (prisma.origin.findUnique as any).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('origin', 'Pays Inexistant');

    const result = await updateUserProfileAction(formData);

    expect(result).toEqual({
      error: 'L\'origine "Pays Inexistant" n\'existe pas',
      status: 400,
    });
  });

  test('gère les erreurs de validation', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
      emailVerified: true,
    });

    const formData = new FormData();
    formData.append('age', 'invalid-age'); // Age invalide

    const result = await updateUserProfileAction(formData);

    expect(result.error).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.field).toBeDefined();
  });

  test('conserve les valeurs existantes si nouvelles valeurs vides', async () => {
    (getSession as any).mockResolvedValue({ user: { id: 'user123' } });
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user123',
      emailVerified: true,
      name: 'Existing Name',
      sex: 'homme',
      age: 25,
      phone: '123456789',
      city: 'Paris',
      description: 'Existing description',
      originId: 'origin1',
    });
    (prisma.user.update as any).mockResolvedValue({ id: 'user123' });

    const formData = new FormData();
    formData.append('name', ''); // Nom vide
    formData.append('sex', 'femme');

    const result = await updateUserProfileAction(formData);

    expect(result.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user123' },
      data: expect.objectContaining({
        name: 'Existing Name', // Garde la valeur existante
        sex: 'femme', // Met à jour avec nouvelle valeur
      }),
    });
  });
});