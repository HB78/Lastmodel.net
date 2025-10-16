import { Crown, Heart, MessageCircle } from 'lucide-react';

export type AppAuthPlan = {
  name: 'FREE' | 'MONTHLY' | 'YEARLY';
  description: string;
  isPopular?: boolean;
  price: number;
  currency: string;
  priceId?: string;
  features: Array<{
    icon: any;
    label: string;
    description: string;
  }>;
};

export const AUTH_PLANS: AppAuthPlan[] = [
  {
    name: 'FREE',
    description: 'Accès de base réservé aux visiteurs',
    price: 0,
    currency: 'EUR',
    features: [
      {
        icon: Heart,
        label: 'Likes ilimités',
        description:
          'Visitez les profils qui vous intéressent le plus, une simple inscriptions suffit. Votre profil ne sera pas visible par les autres visiteurs',
      },
    ],
  },
  {
    name: 'MONTHLY',
    isPopular: true,
    description:
      'Accès complet réservé aux personnes souhaitant etre visible dans les recherches.',
    priceId: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
    price: 20,
    currency: 'EUR',
    features: [
      {
        icon: MessageCircle,
        label: 'Vous faites partie des profils recherchés et mis en avant',
        description:
          'Les visiteurs peuvent visiter et liker votre profil pour le mettre en favoris. Vous pouvez uploder 11 photos',
      },
    ],
  },
  {
    name: 'YEARLY',
    description: "Économisez avec l'abonnement annuel",
    priceId: process.env.STRIPE_PRO_YEARLY_PLAN_ID,
    price: 180,
    currency: 'EUR',
    features: [
      {
        icon: Crown,
        label: 'Profil premium',
        description:
          'Badge premium visible. Vous bénéficiez de toutes les fonctionnalité du plan MONTHLY et votre profil est mis en avant prioritairement dans les recherches. Vous bénéficiez également de deux mois gratuits.',
      },
    ],
  },
];

export const getPlanByName = (planName: string) => {
  return AUTH_PLANS.find((plan) => plan.name === planName) ?? AUTH_PLANS[0];
};
