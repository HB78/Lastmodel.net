import { auth } from '@/lib/better-auth-setup/auth';
import { findIp } from '@arcjet/ip';
import arcjet, {
  BotOptions,
  detectBot,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from '@arcjet/next';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * CONFIGURATION ARCJET (PLAN GRATUIT)
 *
 * Instance Arcjet globale qui protège toutes les routes d'authentification
 * contre les attaques web courantes (OWASP Top 10)
 */
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Clé API depuis .env.local
  characteristics: ['userIdOrIp'], // Rate limit par userId (si connecté) ou IP (si anonyme)
  rules: [
    // Shield = Protection WAF (Web Application Firewall) gratuite et illimitée
    // Bloque : SQL injection, XSS, path traversal, etc.
    shield({ mode: 'LIVE' }),
  ],
});

/**
 * PARAMÈTRES DE DÉTECTION DE BOTS (GRATUIT)
 *
 * Détecte les bots automatiques (scripts, headless browsers)
 * - allow: [] = bloque TOUS les bots (même Googlebot, Stripe webhook, etc.)
 * - Pour autoriser certains bots : allow: ['GOOGLEBOT', 'STRIPE_WEBHOOK']
 */
const botSettings = {
  mode: 'LIVE', // LIVE = bloque vraiment | DRY_RUN = log seulement
  allow: [], // Liste vide = aucun bot autorisé
} satisfies BotOptions;

/**
 * RATE LIMITING STRICT (GRATUIT)
 *
 * Pour les routes sensibles (signup, renvoi email)
 * - max: 10 requêtes maximum
 * - interval: '10m' = dans une fenêtre de 10 minutes
 * - Exemple : si quelqu'un fait 11 requêtes en 10 min → 11ème bloquée
 */
const restrictiveRateLimitSettings = {
  mode: 'LIVE',
  max: 10,
  interval: '10m',
} satisfies SlidingWindowRateLimitOptions<[]>;

/**
 * RATE LIMITING SOUPLE (GRATUIT)
 *
 * Pour les autres routes (signin, reset password)
 * - max: 60 requêtes maximum
 * - interval: '1m' = dans une fenêtre de 1 minute
 * - Plus permissif pour éviter de bloquer les utilisateurs normaux
 */
const laxRateLimitSettings = {
  mode: 'LIVE',
  max: 60,
  interval: '1m',
} satisfies SlidingWindowRateLimitOptions<[]>;

// Convertir Better Auth en handlers Next.js (GET/POST)
const authHandlers = toNextJsHandler(auth.handler);

// Export du handler GET (utilisé pour les redirections OAuth, callbacks)
export const { GET } = authHandlers;

/**
 * HANDLER POST - Point d'entrée de toutes les requêtes POST vers /api/auth/*
 *
 * Flow :
 * 1. Clone la requête (pour pouvoir lire le body plusieurs fois)
 * 2. Vérifie avec Arcjet si la requête est autorisée
 * 3. Si bloquée → renvoie une erreur
 * 4. Si OK → passe à Better Auth pour traiter la requête
 */
export async function POST(request: Request) {
  // Clone la requête car le body ne peut être lu qu'une seule fois
  // checkArcjet() lira le body de l'original, Better Auth utilisera le clone
  const clonedRequest = request.clone();

  // Vérifie la requête avec Arcjet (bot detection, rate limiting, etc.)
  // On passe l'original (pas le clone) car checkArcjet() va lire le body
  const decision = await checkArcjet(request);

  // Si Arcjet bloque la requête
  if (decision.isDenied()) {
    // Cas 1 : Rate limiting dépassé (trop de requêtes)
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { message: 'Trop de tentatives. Réessayez plus tard.' },
        { status: 429 } // 429 = Too Many Requests
      );
    }
    // Cas 2 : Autre raison (bot détecté, shield bloqué, etc.)
    else {
      return Response.json(
        { message: 'Accès refusé.' },
        { status: 403 } // 403 = Forbidden
      );
    }
  }

  // Si Arcjet autorise → passer le CLONE à Better Auth (body intact)
  return authHandlers.POST(clonedRequest);
}

/**
 * FONCTION DE VÉRIFICATION ARCJET
 *
 * Analyse chaque requête et applique les règles de protection
 * selon la route demandée (signup, renvoi email, signin, etc.)
 *
 * @param request - La requête HTTP à analyser
 * @returns Decision Arcjet (allowed ou denied)
 */
async function checkArcjet(request: Request) {
  // Lire le body de la requête (email, password, etc.)
  // Note: C'est OK de lire le body ici car on passe le CLONE à Better Auth
  const body = (await request.json()) as unknown;

  // Récupérer la session utilisateur (si connecté)
  const session = await auth.api.getSession({ headers: request.headers });

  // Identifier l'utilisateur pour le rate limiting :
  // - Si connecté → utilise son userId (plus précis)
  // - Si anonyme → utilise son IP
  // - Fallback → 127.0.0.1 (localhost en développement)
  const userIdOrIp = (session?.user?.id ?? findIp(request)) || '127.0.0.1';

  // ============================================
  // ROUTE 1 : SIGNUP (/sign-up/email)
  // Protection STRICTE (10 req/10min)
  // ============================================
  if (request.url.includes('/sign-up/email')) {
    return (
      aj
        // Règle 1 : Détecter les bots (scripts automatiques)
        .withRule(detectBot(botSettings))
        // Règle 2 : Rate limiting strict (max 10 signups en 10 min)
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        // Analyser la requête avec ces règles
        .protect(request, { userIdOrIp })
    );
  }

  // ============================================
  // ROUTE 2 : RENVOI EMAIL (/send-verification-email)
  // Protection STRICTE (10 req/10min)
  // ============================================
  if (request.url.includes('/send-verification-email')) {
    return (
      aj
        // Règle 1 : Détecter les bots
        .withRule(detectBot(botSettings))
        // Règle 2 : Rate limiting strict (évite spam d'emails)
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        // Analyser la requête
        .protect(request, { userIdOrIp })
    );
  }

  // ============================================
  // ROUTE 3 : AUTRES ROUTES (signin, reset-password, etc.)
  // Protection SOUPLE (60 req/1min)
  // ============================================
  return (
    aj
      // Règle 1 : Détecter les bots
      .withRule(detectBot(botSettings))
      // Règle 2 : Rate limiting souple (plus permissif)
      .withRule(slidingWindow(laxRateLimitSettings))
      // Analyser la requête
      .protect(request, { userIdOrIp })
  );
}
