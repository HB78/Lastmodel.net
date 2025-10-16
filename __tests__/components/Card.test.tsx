import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { render, screen } from '@testing-library/react';

describe('Card Components', () => {
  test("Card basique s'affiche correctement", () => {
    render(
      <Card data-testid="card">
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('Card complète avec tous les composants', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Main content</p>
        </CardContent>
        <CardFooter>
          <button>Footer button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description text')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Footer button')).toBeInTheDocument();
  });

  test('CardTitle applique les bonnes classes', () => {
    render(<CardTitle className="custom-title">Test Title</CardTitle>);

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('leading-none', 'font-semibold', 'custom-title');
  });

  test('CardDescription applique les bonnes classes', () => {
    render(<CardDescription>Test description</CardDescription>);

    const description = screen.getByText('Test description');
    expect(description).toHaveClass('text-muted-foreground', 'text-sm');
  });

  test('Card accepte des classes personnalisées', () => {
    render(
      <Card className="custom-card" data-testid="custom-card">
        Content
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-card');
  });

  test('CardContent et CardFooter ont le bon padding', () => {
    render(
      <div>
        <CardContent data-testid="content">Content</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </div>
    );

    expect(screen.getByTestId('content')).toHaveClass('px-6');
    expect(screen.getByTestId('footer')).toHaveClass('px-6');
  });
});
