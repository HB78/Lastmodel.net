'use client';

import { toggleLikeAction } from '@/actions/creation/toggleLike';
import { Heart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '../ui/button';

interface LikeButtonProps {
  profileId: string;
}

const LikeButton = ({ profileId }: LikeButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation du Link
    e.stopPropagation(); // Empêche la propagation de l'événement

    startTransition(async () => {
      const formData = new FormData();
      formData.append('profileId', profileId);
      await toggleLikeAction(formData);
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-4 right-4 border border-white/20 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white"
      onClick={handleLike}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
      {isPending && 'Chargement...'}
    </Button>
  );
};

export default LikeButton;
