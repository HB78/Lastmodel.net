/**
 * DesktopNav - Navigation horizontale pour écrans desktop
 *
 * Fonctionnalités :
 * - S'affiche uniquement sur desktop (≥ 768px)
 * - Affiche les liens de navigation horizontaux : Accueil, Favoris, Pricing, Contact
 * - Visible uniquement si l'utilisateur est connecté
 * - Affiche le lien Pricing uniquement pour les utilisateurs FREE
 */

'use client';

import { HandCoins, Heart, Home, Mail } from 'lucide-react';
import { Link } from 'next-view-transitions';

interface DesktopNavProps {
  session: any;
}

export function DesktopNav({ session }: DesktopNavProps) {
  return (
    <div className="hidden md:block">
      <ul className="ml-10 flex items-center space-x-1" role="menubar">
        {session?.user?.id ? (
          <>
            <li role="none">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                role="menuitem"
                aria-label="Aller à l'accueil"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Accueil
              </Link>
            </li>
            <li role="none">
              <Link
                href="/favorites"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                role="menuitem"
                aria-label="Voir mes favoris"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                Favoris
              </Link>
            </li>
            {session?.user.subscriptionType === 'FREE' && (
              <li role="none">
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                  role="menuitem"
                  aria-label="À propos de Lastmodel"
                >
                  <HandCoins className="h-4 w-4" aria-hidden="true" />
                  Pricing
                </Link>
              </li>
            )}
            <li role="none">
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                role="menuitem"
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
