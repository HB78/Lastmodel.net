import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AppAuthPlan } from '@/lib/stripe-setup/plan';
import { Check, Zap } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { SubscribeButton } from './subscribeButton';

interface PricingCardProps {
  plan: AppAuthPlan;
  isLoggedIn: boolean;
}

export function PricingCard({ plan }: PricingCardProps) {
  const planId = `plan-${plan.name}`;
  const featuresId = `features-${plan.name}`;
  const priceId = `price-${plan.name}`;

  const isVIP = plan.name === 'YEARLY';
  const isFree = plan.name === 'FREE';

  return (
    <Card
      className={`group relative flex h-full flex-col overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        plan.isPopular
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
          : isVIP
            ? 'border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-xl'
            : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
      role="article"
      aria-labelledby={planId}
      aria-describedby={`${priceId} ${featuresId}`}
    >
      {/* Badge populaire */}
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <Badge
            className="flex items-center gap-1.5 rounded-tr-lg rounded-bl-lg border-0 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
            role="status"
            aria-label="Plan le plus populaire"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            Populaire
          </Badge>
        </div>
      )}

      {/* Badge VIP */}
      {isVIP && (
        <div className="absolute top-0 right-0">
          <Badge
            className="flex items-center gap-1.5 rounded-tr-lg rounded-bl-lg border-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
            role="status"
            aria-label="Plan VIP exclusif"
          >
            <span className="text-sm">👑</span>
            VIP
          </Badge>
        </div>
      )}

      {/* Header avec prix */}
      <CardHeader className="space-y-3 px-5 pt-6 pb-4 text-center">
        <div>
          <CardTitle
            id={planId}
            className="text-xl font-bold tracking-tight text-gray-900 capitalize"
          >
            {plan.name === 'FREE'
              ? 'Gratuit'
              : plan.name === 'MONTHLY'
                ? 'Premium'
                : 'VIP'}
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm text-gray-600">
            {plan.description}
          </CardDescription>
        </div>

        <div id={priceId} className="pt-2">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-4xl font-extrabold ${
                isVIP
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}
            >
              {plan.price}€
            </span>
            {plan.name !== 'FREE' && (
              <span className="text-sm text-gray-500">
                /{plan.name === 'YEARLY' ? 'an' : 'mois'}
              </span>
            )}
          </div>
          {plan.name === 'YEARLY' && (
            <p className="mt-1 text-xs font-bold text-amber-600">
              ✨ Économisez 20% sur l'année
            </p>
          )}
        </div>
      </CardHeader>

      {/* Features compactes */}
      <CardContent className="flex-1 px-5 py-4">
        <div id={featuresId}>
          <h3 className="sr-only">
            Fonctionnalités incluses dans le plan {plan.name}
          </h3>
          <ul
            className="space-y-2.5"
            role="list"
            aria-label={`Fonctionnalités du plan ${plan.name}`}
          >
            {plan.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5"
                role="listitem"
              >
                <div className="mt-0.5 flex-shrink-0" aria-hidden="true">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : isVIP
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3] text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight font-semibold text-gray-900">
                    {feature.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      {/* Footer avec bouton */}
      <CardFooter className="px-5 pt-3 pb-5">
        {plan.name === 'FREE' ? (
          <div className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-2.5 text-center text-sm font-medium text-gray-600">
            <Link href={'/signup'}>Plan actif après simple inscription</Link>
          </div>
        ) : (
          <SubscribeButton
            buttonText={
              plan.name === 'MONTHLY' ? 'Choisir Premium' : 'Choisir VIP'
            }
            planName={plan.name}
            isPopular={plan.isPopular}
          />
        )}
      </CardFooter>
    </Card>
  );
}
