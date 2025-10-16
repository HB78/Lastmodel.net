'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sendVerificationEmail } from '@/lib/better-auth-setup/authClient';
import { Mail, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UnverifiedEmailDialogProps {
  email: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UnverifiedEmailDialog({
  email,
  isOpen,
  onClose,
}: UnverifiedEmailDialogProps) {
  const [isResending, setIsResending] = useState(false);

  // Fonction pour renvoyer l'email de vérification
  const handleResendVerification = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      const { error } = await sendVerificationEmail({
        email,
        callbackURL: '/signin',
      });

      if (error) {
        // Gestion des erreurs backend
        if (error.message?.includes('Trop de tentatives')) {
          toast.error('Trop de tentatives. Réessayez dans 5 minutes.');
        } else if (error.message?.includes('déjà vérifié')) {
          toast.info('Cet email est déjà vérifié. Essayez de vous connecter.');
          onClose();
        } else {
          toast.error(error.message || "Erreur lors de l'envoi.");
        }
        return;
      }

      // Succès
      toast.success(
        'Email de vérification envoyé ! Vérifiez votre boîte mail.'
      );
      onClose();
    } catch (err) {
      console.error('Erreur sendVerificationEmail:', err);
      toast.error('Erreur inattendue. Réessayez.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Email non vérifié
          </DialogTitle>
          <DialogDescription className="pt-2">
            Votre email <strong className="text-foreground">{email}</strong> n'a
            pas encore été vérifié. Vous devez vérifier votre email pour vous
            connecter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Bouton : Renvoyer email de vérification */}
          <Button
            onClick={handleResendVerification}
            disabled={isResending}
            className="h-11 w-full"
          >
            {isResending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Renvoyer l'email de vérification
              </span>
            )}
          </Button>

          {/* Suggestion Magic Link */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Astuce :</strong> Vous pouvez aussi utiliser le{' '}
                  <strong>"Lien magique"</strong> dans le formulaire de
                  connexion pour vous connecter sans mot de passe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
