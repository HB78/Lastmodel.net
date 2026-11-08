'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/better-auth-setup/authClient';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const Social = () => {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleSignIn() {
    setIsPending(true);

    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });

    setIsPending(false);
  }

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <Button
        size="lg"
        variant="outline"
        className="h-11 w-full cursor-pointer rounded-full border-gray-300 font-semibold"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        <FcGoogle className="h-5 w-5" aria-hidden="true" />
        Continuer avec Google
      </Button>
    </div>
  );
};

export default Social;
