import { stripeClient } from '@better-auth/stripe/client';
import {
  customSessionClient,
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  //c'est ici que l'on active les plugins coté client
  //dans auth on setup coté server ici on setup coté client dans le form client component
  plugins: [
    //si on ne met pas inferAdditionalFields, on ne peut pas accéder aux champs supplémentaires
    //je veux dire on ne le vois pas coté client
    inferAdditionalFields<typeof auth>(),
    // adminClient({ ac, roles }),
    //sert a synchroniser le session client avec le session server
    //qd on modifie une session coté server, elle est modifiée coté client
    customSessionClient<typeof auth>(),
    // Le plugin magicLinkClient() ajoute automatiquement la méthode magicLink à l'objet signIn.
    magicLinkClient(),
    stripeClient({ subscription: true }),
  ],
});
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  updateUser,
  subscription,
} = authClient;
