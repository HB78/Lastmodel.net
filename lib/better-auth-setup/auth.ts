import 'server-only';

import { stripe } from '@better-auth/stripe';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import {
  createAuthMiddleware,
  customSession,
  magicLink,
} from 'better-auth/plugins';
import Stripe from 'stripe';
import { prisma } from '../prisma-setup/db';
import {
  sendCancellationEmail,
  sendInvoiceEmail,
  sendPaymentFailedEmail,
  sendWelcomeEmail,
} from '../stripe-setup/mailToUser/stripeEmails';
import { AUTH_PLANS } from '../stripe-setup/plan';
import { stripeClient } from '../stripe-setup/stripe';
import {
  sendEmailVerification,
  sendMagicLinkAction,
  sendPasswordReset,
} from './emailVerification';
import { hashPassword, verifyPassword } from './securePasswordByArgon';
import { normalizeName } from './toolAuth';

const options = {
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'http://localhost:3000', // Dev local
    'https://lastmodel.net', // Production
    'https://www.lastmodel.net', // Production avec www
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordReset(user.email, url, user.name);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour

    sendVerificationEmail: async ({ user, url, token }) => {
      const link = new URL(url);
      link.searchParams.set('callbackURL', '/auth/verificationtoken');

      console.log('token:', token);
      console.log('user:', user);
      console.log('url:', String(link));
      // Send verification email to user
      await sendEmailVerification(user.email, token, user.name, String(link));
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const email = String(ctx.body.email);
        const domain = email.split('@')[1].toLowerCase();

        // if (!VALID_DOMAINS().includes(domain)) {
        //   throw new APIError("BAD_REQUEST", {
        //     message: "Invalid domain. Please use a valid email.",
        //   });
        // }

        const name = normalizeName(ctx.body.name);

        return {
          context: { ...ctx, body: { ...ctx.body, name } },
        };
      }

      if (ctx.path === '/sign-in/magic-link') {
        const name = normalizeName(ctx.body.name);

        return {
          context: { ...ctx, body: { ...ctx.body, name } },
        };
      }

      if (ctx.path === '/update-user') {
        const name = normalizeName(ctx.body.name);

        return {
          context: { ...ctx, body: { ...ctx.body, name } },
        };
      }

      // Protection contre le spam de renvoi d'email de vérification
      if (ctx.path === '/send-verification-email') {
        const email = String(ctx.body.email);

        // Vérifier que l'email existe dans la base de données
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, emailVerified: true },
        });

        if (!user) {
          throw new APIError('BAD_REQUEST', {
            message: "Email non trouvé. Veuillez vous inscrire d'abord.",
          });
        }

        if (user.emailVerified === true) {
          throw new APIError('BAD_REQUEST', {
            message: 'Cet email est déjà vérifié.',
          });
        }

        // Rate limiting : vérifier les tentatives récentes
        //comme la table verification n'a pas un @@unique identifier
        const TIME_WINDOW = 5 * 60 * 1000; // 5 minutes en millisecondes
        const MAX_ATTEMPTS = 3; // 3 tentatives maximum

        const recentAttempts = await prisma.verification.findMany({
          where: {
            identifier: email,
            createdAt: {
              gte: new Date(Date.now() - TIME_WINDOW),
            },
          },
        });

        if (recentAttempts.length >= MAX_ATTEMPTS) {
          throw new APIError('TOO_MANY_REQUESTS', {
            message: 'Trop de tentatives. Réessayez dans 5 minutes.',
          });
        }

        return { context: ctx };
      }
    }),
  },
  databaseHooks: {
    user: {
      // Table "user"
      create: {
        // Opération "create" (création)
        before: async (user) => {
          // AVANT la création en BDD
          console.log('Nouvel utilisateur va être créé:', user);

          const ADMIN_EMAILS = ['battosai78@gmail.com'];

          if (ADMIN_EMAILS.includes(user.email)) {
            // MODIFIER les données AVANT qu'elles soient sauvées
            return { data: { ...user, role: 'ADMIN' } };
          }

          // Sinon, laisser tel quel
          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      //juste pour eviter que le user ne modifie pas le role
      //quand on ajoute un champs dans la table user, on doit le proteger ici
      //le user ne doit pas pouvoir update certains champs
      //required pour savoir si le champs est obligatoire ou pas
      //input pour savoir si le champs peut etre modifier ou pas
      //combo require-input ici on peut modifier mais pas obligatoire
      role: {
        type: ['USER', 'ADMIN'],
        input: false,
      },
      subscriptionType: {
        type: ['FREE', 'MONTHLY', 'YEARLY'],
        input: false,
      },
      // Champs personnalisés autorisés pour la modification
      sex: {
        type: 'string',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      age: {
        type: 'number',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      description: {
        type: 'string',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      phone: {
        type: 'string',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      city: {
        type: 'string',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      originId: {
        type: 'string',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      poids: {
        type: 'number',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
      taille: {
        type: 'number',
        input: true, // Optionnel lors de l'inscription
        required: false,
      },
    },
  },
  session: {
    //on crée un cookie avec les infos de la session pour eviter les appels a la BDD
    expiresIn: 7 * 24 * 60 * 60, // Session réelle = 7 jours
    cookieCache: {
      // enabled: false,
      // maxAge: 0,
      enabled: true,
      maxAge: 1 * 60, // Cache cookie = 5 minutes court pour la sécurité
    },
  },
  advanced: {
    //je ne laisse pas la génération d'id par B-Auth car je prisma génère les id
    //les id sont générés par prisma et sont uniques
    //notamment pour les sessions et les users grace aux uuid
    database: {
      generateId: false,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    //pour éviter les bugs avec les servers actions
    nextCookies(),
    //En activant cela je debloque toutes les routes api admin de B-Auth
    // admin({
    //   defaultRole: "USER",
    //   adminRoles: ["ADMIN"],
    // }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkAction({
          email,
          url,
        });
      },
    }),

    //stripe setup
    stripe({
      stripeClient: stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onEvent: async (event) => {
        switch (event.type) {
          case 'invoice.paid':
            await sendInvoiceEmail(event?.data?.object as any);
            break;
          case 'payment_intent.payment_failed':
            await sendPaymentFailedEmail(event?.data?.object as any);
            break;
        }
      },
      subscription: {
        //Création du compte
        onSubscriptionUpdate: async ({ event, subscription }) => {
          const object = event.data.object as Stripe.Subscription;
          const priceId = object.items?.data?.[0]?.price?.id;
          if (!priceId) return;

          // vérification pour garder la BDD synchronisée avec Stripe
          const matchingPlan = AUTH_PLANS.find((p) => p.priceId === priceId);

          if (!matchingPlan) {
            console.error('No matching plan found', { event, subscription });
            return;
          }

          if (subscription.plan === matchingPlan.name) {
            return; // Déjà synchronisé
          }

          // Synchroniser le plan avec la BDD en parallèle (plus rapide)
          await Promise.all([
            prisma.subscription.update({
              where: { id: subscription.id },
              data: { plan: matchingPlan.name },
            }),
            prisma.user.update({
              where: { id: subscription.referenceId },
              data: {
                subscriptionType: matchingPlan.name as 'MONTHLY' | 'YEARLY',
              },
            }),
          ]);
        },
        onSubscriptionComplete: async ({ subscription, plan }) => {
          // Mettre à jour le subscriptionType de l'utilisateur
          await prisma.user.update({
            where: { id: subscription.referenceId },
            data: {
              subscriptionType: plan.name as 'MONTHLY' | 'YEARLY',
            },
          });

          await sendWelcomeEmail(subscription.referenceId, plan.name);
        },
        onSubscriptionCancel: async ({ subscription }) => {
          // Remettre le user en FREE quand il annule
          await prisma.user.update({
            where: { id: subscription.referenceId },
            data: {
              subscriptionType: 'FREE',
            },
          });

          await sendCancellationEmail(subscription.referenceId);
        },
        // C'est une fonction de sécurité qui contrôle qui peut faire quoi sur abonnement.
        authorizeReference: async ({ user, referenceId }) => {
          // 1. authorizeReference → Vérifie que l'utilisateur a le droit de faire l'action ✅
          // 2. Si autorisé → Better Auth crée une session Stripe Checkout
          // 3. L'utilisateur paie sur Stripe
          // 4. Stripe envoie un webhook → onSubscriptionUpdate synchronise la BDD

          //referenceId crée par better auth quand on implemente stripe
          //referenceid c'est pour dire à qui appartient l'abonnement
          //il est égale a user.id et on verifie si user.id = referenceId
          //en gros on regarde si l'abonnment appartient bien au user connecté
          return user.id === referenceId;
        },
        getCheckoutSessionParams: async ({ user, plan }) => {
          return {
            params: {
              //en europe c'est obligatoire
              billing_address_collection: 'required',
              allow_promotion_codes: true, // ✅ Bonus : codes promo
              // Moyens de paiement acceptés
              custom_text: {
                submit: {
                  message: 'Votre abonnement démarrera immédiatement',
                },
              },
              //des champs en plus qu'on rajoute ds la bdd stripe pour mieu le retrouver
              metadata: {
                userId: user.id,
                planName: plan.name,
                userName: user.name,
                userEmail: user.email,
              },
            },
          };
        },
        enabled: true,
        plans: AUTH_PLANS,
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          //comme je n'ai pas activé le role admin, je dois le ramener depuis prisma
          role: user.role, // 👈 Assertion rapide
          subscriptionType: user.subscriptionType,
          // Champs personnalisés de votre schéma Prisma
          sex: user.sex,
          age: user.age,
          description: user.description,
          phone: user.phone,
          city: user.city,
          originId: user.originId,
          poids: user.poids,
          taille: user.taille,
        },
      };
    }, options),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
export type Session = {
  session: {
    expiresAt: Date;
    token: string;
    userAgent: string | null | undefined;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    subscriptionType: 'FREE' | 'MONTHLY' | 'YEARLY';
    sex: string | null | undefined;
    age: number | null | undefined;
    description: string | null | undefined;
    phone: string | null | undefined;
    city: string | null | undefined;
    originId: string | null | undefined;
    poids: number | null | undefined;
    taille: number | null | undefined;
  };
};
