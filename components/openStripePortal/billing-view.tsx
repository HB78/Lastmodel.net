'use client';
//tout ce qui est visuel dans la card de la page billing
//les infos de la carte dans billing page sont affichés grace a ce component
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlanByName } from '@/lib/stripe-setup/plan';
import {
  CreditCard,
  FileText,
  Loader2,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { openBillingPortalAction } from '../../actions/stripe/openBillingPortal';

type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unpaid'
  | 'trialing'
  | 'incomplete_expired'
  | 'paused';

// Helper function pour déterminer le badge de statut
function getStatusBadge(status: SubscriptionStatus) {
  const statusConfig: Record<
    SubscriptionStatus,
    { label: string; className: string }
  > = {
    active: {
      label: 'Actif',
      className: 'border-green-200 bg-green-50 text-green-700',
    },
    trialing: {
      label: 'Actif',
      className: 'border-green-200 bg-green-50 text-green-700',
    },
    past_due: {
      label: 'Paiement en retard',
      className: 'border-orange-200 bg-orange-50 text-orange-700',
    },
    unpaid: {
      label: 'Impayé',
      className: 'border-red-200 bg-red-50 text-red-700',
    },
    canceled: {
      label: 'Annulé',
      className: 'border-red-200 bg-red-50 text-red-700',
    },
    incomplete: {
      label: 'Paiement incomplet',
      className: 'border-gray-200 bg-gray-50 text-gray-700',
    },
    incomplete_expired: {
      label: 'Expiré',
      className: 'border-gray-200 bg-gray-50 text-gray-700',
    },
    paused: {
      label: 'En pause',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
  };

  return statusConfig[status] || statusConfig.active;
}

export function BillingView({ subscription }: any) {
  const [isPending, startTransition] = useTransition();

  const handleManageSubscription = () => {
    startTransition(async () => {
      try {
        const { url } = await openBillingPortalAction();
        window.location.href = url;
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(
          error instanceof Error ? error.message : 'Une erreur est survenue'
        );
      }
    });
  };

  const plan = subscription
    ? getPlanByName(subscription.plan.toUpperCase())
    : null;

  if (!plan) {
    return null;
  }

  const statusBadge = getStatusBadge(subscription.status);

  return (
    <>
      {/* Badge de statut */}
      <div className="-mt-6 flex justify-end">
        <Badge
          variant="outline"
          className={`capitalize ${statusBadge.className}`}
          aria-label={`Statut de l'abonnement: ${statusBadge.label}`}
        >
          {statusBadge.label}
        </Badge>
      </div>

      {/* Détails du plan */}
      <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Plan {plan.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">{plan.price}€</p>
            <p className="text-sm text-gray-600">
              / {plan.name === 'YEARLY' ? 'an' : 'mois'}
            </p>
          </div>
        </div>

        {subscription.periodEnd && (
          <div className="border-t border-purple-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Prochaine facturation</span>
              <span className="font-semibold text-gray-900">
                {new Date(subscription.periodEnd).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid gap-3">
        <Button
          onClick={handleManageSubscription}
          disabled={isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          aria-label="Gérer mon abonnement"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Gérer mon abonnement
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleManageSubscription}
            variant="outline"
            disabled={isPending}
            aria-label="Voir mes factures"
          >
            <FileText className="mr-2 h-4 w-4" />
            Mes factures
          </Button>
          <Button
            onClick={handleManageSubscription}
            variant="outline"
            disabled={isPending}
            aria-label="Gérer mon moyen de paiement"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Moyen de paiement
          </Button>
        </div>
      </div>

      {/* Informations */}
    </>
  );
}
