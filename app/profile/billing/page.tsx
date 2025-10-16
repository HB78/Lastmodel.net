import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSessionWithProfileCheck } from '@/tools';
import { getActiveSubscription } from '@/tools/getPlanFromStripe';
import { Receipt, Sparkles } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { redirect } from 'next/navigation';
import { BillingView } from '../../../components/openStripePortal/billing-view';

export default async function BillingPage() {
  //les users en FREE plan ne peuvent pas acceder à cette page
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (!isProfileComplete) redirect('/create');

  // Vérification spécifique pour la page billing
  const hasActiveSubscription = session?.user?.subscriptionType !== 'FREE';
  if (!hasActiveSubscription) redirect('/pricing'); // Redirige vers les prix

  const userSubscription = await getActiveSubscription();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion de l'abonnement
        </h1>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-red-700">
            <strong>ℹ️ Bon à savoir :</strong> ⚠️ Si vous supprimez votre
            compte, vous perdrez l'accès immédiatement, même si votre abonnement
            est actif. Nous vous recommandons d'annuler d'abord votre abonnement
            pour éviter toute perte financière.
          </p>
        </div>
      </div>

      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Abonnement actuel
              </CardTitle>
              <CardDescription>
                Détails de votre abonnement et statut
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {userSubscription ? (
            <BillingView subscription={userSubscription} />
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Aucun abonnement actif
              </h3>
              <p className="mb-6 text-gray-600">
                Vous utilisez actuellement le plan gratuit
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/pricing">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Découvrir les plans premium
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
