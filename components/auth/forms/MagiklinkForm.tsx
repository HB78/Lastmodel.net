'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/better-auth-setup/authClient';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MagiklinkFormProps {
  isPending: boolean;
}

const MagiklinkForm = ({ isPending }: MagiklinkFormProps) => {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    try {
      const { error } = await signIn.magicLink({
        email,
        name: email.split('@')[0],
        callbackURL: '/',
        fetchOptions: {
          onRequest: () => {},
          onResponse: () => {},
          onError: (ctx: any) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            setIsLinkSent(true);
            toast.success('Lien magique envoyé !');
          },
        },
      });

      if (error) {
        console.error("Erreur lors de l'envoi du lien magique:", error);
        toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du lien magique:", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  const handleReset = () => {
    setIsLinkSent(false);
    setEmail('');
  };

  if (isLinkSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            Email envoyé !
          </h3>

          <p className="mb-3 text-xs text-gray-600">
            Vérifiez votre boîte mail à{' '}
            <span className="font-medium text-green-700">{email}</span>
          </p>

          <div className="mb-4 rounded-lg bg-white/70 p-3">
            <p className="text-xs text-gray-500">
              Le lien expire dans{' '}
              <span className="font-medium">10 minutes</span>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Renvoyer à une autre adresse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="h-11 text-center"
        />
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Recevoir le lien magique
          </>
        )}
      </Button>

      <p className="px-4 text-center text-xs text-gray-500">
        Vous recevrez un email avec un lien de connexion sécurisé
      </p>
    </form>
  );
};

export default MagiklinkForm;
