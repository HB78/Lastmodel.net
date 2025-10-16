import { Input } from '@/components/ui/input';
import { render, screen } from '@testing-library/react';

describe('Input Component', () => {
  test('affiche un input avec le placeholder', () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('accepte une valeur par défaut', () => {
    render(<Input defaultValue="test value" />);

    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  test('peut être désactivé', () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  test('accepte différents types', () => {
    render(<Input type="email" placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('applique les classes personnalisées', () => {
    render(<Input className="custom-class" placeholder="Custom" />);

    const input = screen.getByPlaceholderText('Custom');
    expect(input).toHaveClass('custom-class');
  });

  test('gère les événements onChange', async () => {
    const handleChange = vi.fn();
    const user = (await import('@testing-library/user-event')).default.setup();

    render(<Input onChange={handleChange} placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });
});
