/**
 * DesktopNav - Navigation horizontale pour écrans desktop
 *
 * Fonctionnalités :
 * - S'affiche uniquement sur desktop (≥ 768px)
 * - Affiche les liens de navigation horizontaux : Accueil, Favoris, Tarifs, Contact
 * - Visible uniquement si l'utilisateur est connecté
 * - Affiche le lien Tarifs uniquement pour les utilisateurs FREE
 */

'use client';

import { HandCoins, Heart, Home, Mail } from 'lucide-react';
import { Link } from 'next-view-transitions';

interface DesktopNavProps {
  session: any;
  transparent?: boolean;
}

export function DesktopNav({ session, transparent }: DesktopNavProps) {
  // Sur la navbar transparente (accueil), les liens sont posés sur la vidéo
  // sombre : en gris ils étaient quasi illisibles → blanc à 80 %.
  const linkClass = transparent
    ? 'rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white'
    : 'rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600';

  return (
    <div className="hidden md:block">
      <ul className="ml-10 flex items-center space-x-1">
        {session?.user?.id ? (
          <>
            <li>
              <Link
                href="/"
                className={`flex items-center gap-2 ${linkClass}`}
                aria-label="Aller à l'accueil"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className={`flex items-center gap-2 ${linkClass}`}
                aria-label="Voir mes favoris"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                Favoris
              </Link>
            </li>
            {session?.user.subscriptionType === 'FREE' && (
              <li>
                <Link
                  href="/pricing"
                  className={`flex items-center gap-2 ${linkClass}`}
                  aria-label="Voir les tarifs"
                >
                  <HandCoins className="h-4 w-4" aria-hidden="true" />
                  Tarifs
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/contact"
                className={`flex items-center gap-2 ${linkClass}`}
                aria-label="Nous contacter"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact
              </Link>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
}
