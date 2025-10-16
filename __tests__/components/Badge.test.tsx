import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
  test('affiche le texte passé en children', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('applique la variante default par défaut', () => {
    render(<Badge>Default badge</Badge>);

    const badge = screen.getByText('Default badge');
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  test('applique la variante secondary correctement', () => {
    render(<Badge variant="secondary">Secondary</Badge>);

    const badge = screen.getByText('Secondary');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  test('applique la variante destructive correctement', () => {
    render(<Badge variant="destructive">Error</Badge>);

    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-destructive', 'text-white');
  });

  test('applique la variante outline correctement', () => {
    render(<Badge variant="outline">Outline</Badge>);

    const badge = screen.getByText('Outline');
    expect(badge).toHaveClass('text-foreground');
  });

  test('accepte des classes personnalisées', () => {
    render(<Badge className="custom-badge">Custom</Badge>);

    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-badge');
  });

  test('peut être rendu comme un autre élément avec asChild', () => {
    render(
      <Badge asChild>
        <button>Button badge</button>
      </Badge>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    expect(button).toHaveTextContent('Button badge');
  });

  test('a les bonnes classes de base', () => {
    render(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium'
    );
  });
});