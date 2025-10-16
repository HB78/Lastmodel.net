'use client';

import { signOut } from '@/lib/better-auth-setup/authClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SignoutProps {
  //au lieu de IsOpen on met en general value: boolean ou autre type de donnée
  //en fait le set de useState est une fonction
  //on met void car elle ne renvoit rien
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Signout = ({ setIsMenuOpen }: SignoutProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('Vous avez été déconnecté ! A bientot');
          router.push('/signin');
        },
      },
    });
  }
  return (
    <button
      onClick={() => {
        handleSignOut();
        setIsMenuOpen(false);
      }}
      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 transition-colors hover:text-red-700"
    >
      Se déconnecter
    </button>
  );
};
