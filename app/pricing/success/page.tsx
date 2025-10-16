import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPlanByName } from '@/lib/stripe-setup/plan';
import { CheckCircle, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Abonnement activé - Last',
  description: 'Votre abonnement a été activé avec succès',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const planName = params.plan as 'MONTHLY' | 'YEARLY' | undefined;

  // Si pas de plan, rediriger vers pricing
  if (!planName) {
    redirect('/pricing');
  }

  //on prend le plan en params et on renvoit le plan et son contenu provenant de AUTH_PLANS
  //si planName est null, on renvoit le premier plan de AUTH_PLANS
  //on peut donc utiliser plan.name, plan.description, plan.price, plan.currency, plan.features
  const plan = getPlanByName(planName);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 px-4 py-12">
      <Card className="w-full max-w-md border-2 border-green-200 py-6 shadow-xl">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900">
            Paiement réussi !
          </CardTitle>

          <CardDescription className="text-lg">
            Votre abonnement a été activé avec succès
          </CardDescription>

          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-base text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Plan {plan.name}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Afficher les détails du plan */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tarif</span>
              <span className="font-semibold text-gray-900">
                {plan.price}€ / {plan.name === 'YEARLY' ? 'an' : 'mois'}
              </span>
            </div>
            {plan.name === 'YEARLY' && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Économie</span>
                <span className="font-semibold text-green-600">
                  2 mois gratuits
                </span>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-center text-sm text-purple-900">
              🎉 Bienvenue ! Vous avez maintenant accès à toutes les
              fonctionnalités premium.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/profile">Voir mon profil</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
