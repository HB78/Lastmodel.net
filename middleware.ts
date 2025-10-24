import {
  adminRoutes,
  allowedOrigins,
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  publicRoutes,
} from '@/lib/routes';
import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);
  const LOGGED_IN = !!sessionCookie;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith('/**')) {
      return nextUrl.pathname.startsWith(route.slice(0, -3));
    }
    return nextUrl.pathname === route;
  });
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Routes API d'auth - laisser passer
  if (isApiAuthRoute) {
    return;
  }

  // Routes d'authentification - rediriger si déjà connecté
  if (isAuthRoute) {
    if (LOGGED_IN) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Routes protégées - rediriger si pas connecté
  if (isProtectedRoute && !LOGGED_IN) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Routes admin - rediriger si pas connecté (pas de vérification du rôle avec getSessionCookie)
  if (isAdminRoute && !LOGGED_IN) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Routes publiques et gestion CORS
  if (!isPublicRoute && !LOGGED_IN) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const origin = req.headers.get('origin');

  if (origin && !allowedOrigins.includes(origin) && !isDevelopment) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const requestHeaders = new Headers(req.headers);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  appendCorsHeaders(res.headers, origin);
  appendCspHeaders(res.headers);

  return res;
}

function appendCorsHeaders(headers: Headers, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Content-Type, Content-Length, Accept, Accept-Version, Date, X-Api-Version'
    );
  }
}

function appendCspHeaders(headers: Headers) {
  const policy = isDevelopment
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' ws: wss: https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `
    : `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.posthog.com https://eu-assets.i.posthog.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https: https://*.stripe.com https://*.posthog.com;
      font-src 'self' data:;
      connect-src 'self' https://lastmodel.net https://www.lastmodel.net https://api.stripe.com https://*.posthog.com https://eu-assets.i.posthog.com https://geo.api.gouv.fr;
      frame-src https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `;

  headers.set('Content-Security-Policy', policy.replace(/\s{2,}/g, ' ').trim());
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (!isDevelopment) {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
