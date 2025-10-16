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
        className="w-full cursor-pointer"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
