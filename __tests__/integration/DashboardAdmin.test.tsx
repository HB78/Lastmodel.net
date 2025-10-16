import {
  deleteContactMessage,
  toggleMessageReadStatus,
} from '@/actions/admin/updateContactMessage';
import DashboardClient from '@/app/admin/dashboard/DashboardClient';
import { render, screen } from '@testing-library/react';

// Mock des server actions
vi.mock('@/actions/admin/updateContactMessage', () => ({
  deleteContactMessage: vi.fn(),
  toggleMessageReadStatus: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DashboardAdmin Integration', () => {
  const mockMessages = [
    {
      id: '1',
      name: 'Alice Dupont',
      email: 'alice@test.com',
      subject: 'Question importante',
      message: "Bonjour, j'ai une question...",
      isRead: false,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Bob Martin',
      email: 'bob@test.com',
      subject: 'Problème technique',
      message: 'Je rencontre un problème...',
      isRead: true,
      createdAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      name: 'Charlie Wilson',
      email: 'charlie@test.com',
      subject: 'Feedback',
      message: 'Excellente application !',
      isRead: false,
      createdAt: new Date('2024-01-16'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche correctement les statistiques', () => {
    render(<DashboardClient messages={mockMessages} />);

    // Vérifie le total des messages
    expect(screen.getByText('3')).toBeInTheDocument(); // Total

    // Vérifie les messages non lus (2 non lus sur 3)
    expect(screen.getAllByText('2')[0]).toBeInTheDocument(); // Non lus

    // Vérifie les statistiques d'aujourd'hui (0 car dates anciennes)
    expect(screen.getAllByText('0')[0]).toBeInTheDocument(); // Aujourd'hui
  });

  test('affiche la liste des messages avec les bonnes informations', () => {
    render(<DashboardClient messages={mockMessages} />);

    // Vérifie que tous les noms sont affichés
    expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
    expect(screen.getByText('Bob Martin')).toBeInTheDocument();
    expect(screen.getByText('Charlie Wilson')).toBeInTheDocument();

    // Vérifie les sujets
    expect(screen.getByText('Question importante')).toBeInTheDocument();
    expect(screen.getByText('Problème technique')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();

    // Vérifie les badges "Nouveau" pour les messages non lus
    const nouveauBadges = screen.getAllByText('Nouveau');
    expect(nouveauBadges).toHaveLength(2); // Alice et Charlie sont non lus
  });

  test('sélectionne un message et affiche ses détails', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<DashboardClient messages={mockMessages} />);

    // Clique sur le premier message (Alice)
    await user.click(screen.getByText('Alice Dupont'));

    // Vérifie que les détails apparaissent
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    expect(
      screen.getByText("Bonjour, j'ai une question...")
    ).toBeInTheDocument();

    // Vérifie que les boutons d'action sont présents
    expect(screen.getByText('Marquer lu')).toBeInTheDocument();
    expect(screen.getByText('Supprimer')).toBeInTheDocument();
  });

  test('marque un message comme lu', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    (toggleMessageReadStatus as any).mockResolvedValue({
      success: 'Message marqué comme lu',
    });

    render(<DashboardClient messages={mockMessages} />);

    // Sélectionne le premier message (non lu)
    await user.click(screen.getByText('Alice Dupont'));

    // Clique sur "Marquer lu"
    await user.click(screen.getByText('Marquer lu'));

    // Vérifie que la fonction a été appelée
    expect(toggleMessageReadStatus).toHaveBeenCalledWith('1');
  });

  test('supprime un message avec confirmation', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    (deleteContactMessage as any).mockResolvedValue({
      success: 'Message supprimé',
    });

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<DashboardClient messages={mockMessages} />);

    // Sélectionne un message
    await user.click(screen.getByText('Alice Dupont'));

    // Clique sur "Supprimer"
    await user.click(screen.getByText('Supprimer'));

    // Vérifie que la confirmation a été demandée
    expect(confirmSpy).toHaveBeenCalledWith(
      'Êtes-vous sûr de vouloir supprimer ce message ?'
    );

    // Vérifie que la fonction de suppression a été appelée
    expect(deleteContactMessage).toHaveBeenCalledWith('1');

    confirmSpy.mockRestore();
  });

  test('annule la suppression si non confirmée', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();

    // Mock window.confirm pour retourner false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<DashboardClient messages={mockMessages} />);

    // Sélectionne un message
    await user.click(screen.getByText('Alice Dupont'));

    // Clique sur "Supprimer"
    await user.click(screen.getByText('Supprimer'));

    // Vérifie que la suppression n'a pas été appelée
    expect(deleteContactMessage).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  test("gère le cas où aucun message n'est présent", () => {
    render(<DashboardClient messages={[]} />);

    // Vérifie les statistiques à zéro
    expect(screen.getAllByText('0')).toHaveLength(3); // Total, non lus, aujourd'hui

    // Vérifie le message d'absence
    expect(screen.getByText('Aucun message reçu')).toBeInTheDocument();
    expect(
      screen.getByText('Sélectionnez un message pour voir les détails')
    ).toBeInTheDocument();
  });

  test("change la couleur du bouton selon l'état lu/non lu", async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<DashboardClient messages={mockMessages} />);

    // Sélectionne un message non lu (Alice)
    await user.click(screen.getByText('Alice Dupont'));
    let button = screen.getByText('Marquer lu');
    expect(button).toHaveClass('bg-green-600'); // Success variant

    // Sélectionne un message déjà lu (Bob)
    await user.click(screen.getByText('Bob Martin'));
    button = screen.getByText('Marquer non lu');
    expect(button).toHaveClass('border'); // Outline variant
  });
});
