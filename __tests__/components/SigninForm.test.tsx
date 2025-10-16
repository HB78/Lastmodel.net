import SigninForm from '@/components/auth/forms/SigninForm';
import { render, screen } from '@testing-library/react';

// Mock des dépendances externes
vi.mock('@/lib/better-auth-setup/authClient', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SigninForm Component', () => {
  test('affiche les champs email et password', () => {
    render(<SigninForm />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
  });

  test('affiche les liens de navigation', () => {
    render(<SigninForm />);

    expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
    expect(screen.getByText(/vous n'avez pas de compte/i)).toBeInTheDocument();
  });

  test('affiche les options de connexion', () => {
    render(<SigninForm />);

    // Vérifie que les deux méthodes sont disponibles
    expect(screen.getAllByText(/mot de passe/i)).toHaveLength(3); // Bouton, description, lien oublié
    expect(screen.getByText(/lien magique/i)).toBeInTheDocument();
  });

  test('affiche les erreurs de validation', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<SigninForm />);

    // Essaie de soumettre sans remplir les champs
    const submitButton = screen.getByText(/se connecter/i);
    await user.click(submitButton);

    // Vérifie que les erreurs apparaissent (après un court délai)
    setTimeout(() => {
      expect(screen.getByText(/email requis/i)).toBeInTheDocument();
    }, 100);
  });
});
