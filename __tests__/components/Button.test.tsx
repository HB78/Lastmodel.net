import { Button } from '@/components/ui/button';
import { render, screen } from '@testing-library/react';

describe('Button Component', () => {
  test('affiche le texte passé en children', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applique la variante success correctement', () => {
    render(<Button variant="success">Save</Button>);

    const button = screen.getByText('Save');
    expect(button).toHaveClass('bg-green-600');
  });

  test('applique la variante warning correctement', () => {
    render(<Button variant="warning">Warning</Button>);

    const button = screen.getByText('Warning');
    expect(button).toHaveClass('bg-orange-500');
  });

  test('est cliquable et déclenche onClick', async () => {
    const handleClick = vi.fn();
    const user = (await import('@testing-library/user-event')).default.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
