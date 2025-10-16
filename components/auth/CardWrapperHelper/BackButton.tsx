import { Button } from '@/components/ui/button';
import Link from 'next/link';

const BackButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <Button variant="link" className="w-full font-normal" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
