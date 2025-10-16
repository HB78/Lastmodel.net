import CreateProductForm from '@/components/forms/CreateProductForm';
import { render, screen, waitFor } from '@testing-library/react';

// Mock des dépendances
vi.mock('@/lib/better-auth-setup/authClient', () => ({
  useSession: () => ({
    data: { user: { id: 'user123', name: 'Test User' } },
    isPending: false,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/actions/creation/createUserProfil', () => ({
  createUserProfilAction: vi.fn(),
}));

vi.mock('@/components/filterCards/CityInput', () => ({
  default: ({ value, onCitySelect, placeholder }: any) => (
    <input
      data-testid="city-input"
      value={value}
      onChange={(e) => onCitySelect(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock('@/components/dropzone/Dropzone', () => ({
  DropZone: ({ getInfo }: any) => (
    <div data-testid="dropzone">
      <button
        onClick={() => getInfo('test-image-url')}
      >
        Upload Image
      </button>
    </div>
  ),
}));

describe('ProductCreation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche le formulaire de création avec tous les champs', () => {
    render(<CreateProductForm origins={[]} />);

    // Vérifie la présence des champs principaux
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByTestId('city-input')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /mettre à jour le profil/i })
    ).toBeInTheDocument();
  });

  test('valide les champs requis avant soumission', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<CreateProductForm origins={[]} />);

    // Tape quelque chose de court dans le champ nom pour déclencher la validation
    const nameInput = screen.getByLabelText(/nom complet/i);
    await user.type(nameInput, 'A'); // Trop court
    await user.clear(nameInput); // Efface pour déclencher l'erreur

    // Vérifie que les erreurs de validation apparaissent
    await waitFor(() => {
      expect(screen.getByText(/Le nom doit contenir au moins 3 caractères/i)).toBeInTheDocument();
    });
  });

  test('permet de remplir et soumettre le formulaire', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const { createUserProfilAction } = await import(
      '@/actions/creation/createUserProfil'
    );
    (createUserProfilAction as any).mockResolvedValue({ error: null, status: 200 });

    render(<CreateProductForm origins={[]} />);

    // Remplit le formulaire
    await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont');
    await user.type(
      screen.getByLabelText(/description/i),
      'Description détaillée du profil'
    );
    await user.type(screen.getByTestId('city-input'), 'Paris');

    // Soumet le formulaire
    await user.click(screen.getByRole('button', { name: /mettre à jour le profil/i }));

    // Vérifie que l'action a été appelée
    await waitFor(() => {
      expect(createUserProfilAction).toHaveBeenCalled();
    });
  });

  test('gère les erreurs de création', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const { createUserProfilAction } = await import(
      '@/actions/creation/createUserProfil'
    );
    const { toast } = await import('sonner');

    (createUserProfilAction as any).mockResolvedValue({
      error: 'Erreur lors de la création',
    });

    render(<CreateProductForm origins={[]} />);

    // Remplit et soumet le formulaire
    await user.type(screen.getByLabelText(/nom complet/i), 'Test User');
    await user.click(screen.getByRole('button', { name: /mettre à jour le profil/i }));

    // Vérifie que l'erreur est affichée
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la création');
    });
  });

  test('désactive le bouton pendant la soumission', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const { createUserProfilAction } = await import(
      '@/actions/creation/createUserProfil'
    );

    // Mock une réponse lente
    (createUserProfilAction as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null, status: 200 }), 100)
        )
    );

    render(<CreateProductForm origins={[]} />);

    const submitButton = screen.getByRole('button', {
      name: /mettre à jour le profil/i,
    });

    // Soumet le formulaire
    await user.click(submitButton);

    // Vérifie que le bouton est désactivé pendant le traitement
    expect(submitButton).toBeDisabled();
  });

  test('réinitialise le formulaire après création réussie', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const { createUserProfilAction } = await import(
      '@/actions/creation/createUserProfil'
    );
    const { toast } = await import('sonner');

    (createUserProfilAction as any).mockResolvedValue({ error: null, status: 200 });

    render(<CreateProductForm origins={[]} />);

    const nameInput = screen.getByLabelText(/nom complet/i);

    // Remplit le formulaire
    await user.type(nameInput, 'Test User');
    await user.click(screen.getByRole('button', { name: /mettre à jour le profil/i }));

    // Vérifie que le succès est affiché
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    // Vérifie que le formulaire est réinitialisé (ce test peut échouer car le form ne se reset pas automatiquement)
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });
});
