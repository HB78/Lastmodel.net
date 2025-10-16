'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={show ? 'text' : 'password'}
        className={className}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 p-0 text-slate-600 hover:text-slate-800"
        aria-label={
          show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
        }
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
