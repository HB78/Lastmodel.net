/**
 * MobileDrawer - Menu mobile coulissant (drawer) pour la navigation responsive
 *
 * Fonctionnalités :
 * - S'affiche uniquement sur mobile (< 768px) avec un bouton hamburger
 * - Slide-in depuis la gauche avec animation
 * - Affiche les infos utilisateur (avatar, nom, email) si connecté
 * - Liste tous les liens de navigation (Accueil, Favoris, Profil, Pricing, Contact)
 * - Bouton de déconnexion en bas pour les utilisateurs connectés
 * - Se ferme automatiquement lors du clic sur un lien
 */

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  HandCoins,
  Heart,
  Home,
  LogOut,
  Mail,
  User,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { Signout } from '../auth/signoutButton/Signout';

interface MobileDrawerProps {
  session: any;
  userInitials: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function MobileDrawer({
  session,
  userInitials,
  isOpen,
  setIsOpen,
}: MobileDrawerProps) {
  return (
    <div className="md:hidden">
      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 transition-colors hover:bg-purple-50"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <div className="flex h-5 w-5 flex-col items-center justify-center gap-1">
              {/* Ligne du haut */}
              <span
                className={`h-0.5 w-5 bg-gray-700 transition-all duration-300 ease-in-out ${
                  isOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              {/* Ligne du milieu */}
              <span
                className={`h-0.5 w-5 bg-gray-700 transition-all duration-300 ease-in-out ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {/* Ligne du bas */}
              <span
                className={`h-0.5 w-5 bg-gray-700 transition-all duration-300 ease-in-out ${
                  isOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-[85%] max-w-[350px]">
          <DrawerHeader className="border-b border-gray-200/50 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
            <DrawerTitle>
              <div className="flex items-center gap-2">
                <Image
                  src="/logolast.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  priority
                />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                  Lastmodel
                </span>
              </div>
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Menu de navigation
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-indigo-50/50">
            {/* User Info Section */}
            {session?.user && (
              <div className="mx-4 mt-4 mb-4 rounded-lg bg-white/70 p-4 backdrop-blur-sm shadow-sm">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-purple-200">
                    <AvatarImage
                      src=""
                      alt={`Photo de profil de ${session.user.name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 font-semibold text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1" aria-label="Menu de navigation mobile">
              {session?.user ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Aller à l'accueil"
                  >
                    <Home
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Accueil
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Voir mes favoris"
                  >
                    <Heart
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Favoris
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Voir mon profil"
                  >
                    <User
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Mon Profil
                  </Link>
                  {session.user.subscriptionType === 'FREE' && (
                    <Link
                      href="/pricing"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                      role="menuitem"
                      aria-label="Voir les tarifs"
                    >
                      <HandCoins
                        className="h-5 w-5 text-purple-600"
                        aria-hidden="true"
                      />
                      Pricing
                    </Link>
                  )}
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Nous contacter"
                  >
                    <Mail
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Se connecter"
                  >
                    <User
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Connexion
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-base font-medium text-white shadow-md transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
                    role="menuitem"
                    aria-label="Créer un compte"
                  >
                    Inscription
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Voir les tarifs"
                  >
                    <HandCoins
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Pricing
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-white/70 px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    role="menuitem"
                    aria-label="Nous contacter"
                  >
                    <Mail
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Contact
                  </Link>
                </>
              )}
            </nav>

            {/* Footer Section */}
            {session?.user && (
              <DrawerFooter className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 rounded-lg bg-red-50/70 px-4 py-3 text-red-600 transition-colors hover:bg-red-100">
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  <Signout setIsMenuOpen={setIsOpen} />
                </div>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full">
                    Fermer
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
