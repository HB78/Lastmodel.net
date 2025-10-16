import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ReturnButtonProps {
  href: string;
  label: string;
  variant?: 'default' | 'ghost' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ReturnButton = ({
  href,
  label,
  variant = 'ghost',
  size = 'default',
  className,
}: ReturnButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-200 hover:gap-3',
        className
      )}
    >
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
};

export default ReturnButton;
