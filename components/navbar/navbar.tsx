'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/better-auth-setup/authClient';
import { HandCoins, User } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { DesktopNav } from './desktop-nav';
import { MobileDrawer } from './mobile-drawer';
import { UserMenu } from './user-menu';

// Composant interne pour éviter les problèmes d'hydratation
function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const userInitials = useMemo(() => {
    if (!session?.user?.name) return 'U';
    return getInitials(session.user.name);
  }, [session?.user?.name, getInitials]);

  return (
    //en fait si il y a une session on retourne l'avatar sinon le menu de navigation
    //les composant nav en desktop et en responsive n'affichent pas de menu alternatif si !session
    <header role="banner">
      <nav
        className="sticky top-0 z-50 border-b border-gray-200/50 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-sm backdrop-blur-md"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo et Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  aria-label="Accueil - Lastmodel"
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/logolast.png"
                    alt="Logo Lastmodel"
                    width={40}
                    height={40}
                    className="transition-transform duration-200 hover:scale-110"
                    priority
                  />
                  <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent transition-all duration-200 hover:from-purple-700 hover:to-pink-700">
                    Lastmodel
                  </h1>
                </Link>
              </div>
              {/* Navigation Desktop */}
              <DesktopNav session={session} />
            </div>

            {/* Actions utilisateur */}
            <section
              className="flex items-center space-x-3"
              aria-label="Actions utilisateur"
            >
              {/* Menu utilisateur Desktop ou boutons connexion */}
              <div className="hidden items-center space-x-3 md:flex">
                {isPending ? (
                  <div
                    className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-pink-200"
                    role="status"
                    aria-label="Chargement du profil utilisateur"
                  />
                ) : session?.user ? (
                  <UserMenu
                    session={session}
                    userInitials={userInitials}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-purple-200 bg-purple-50 text-purple-700 transition-all duration-200 hover:border-purple-600"
                    >
                      <Link href="/signin" aria-label="Se connecter">
                        <User className="mr-2 h-4 w-4" aria-hidden="true" />
                        Connexion
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
                    >
                      <Link href="/signup" aria-label="Créer un compte">
                        Inscription
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="group relative border-2 border-purple-600 bg-white text-purple-600 shadow-sm transition-all duration-200 hover:bg-purple-600 hover:text-white hover:shadow-md"
                    >
                      <Link
                        href="/pricing"
                        aria-label="Voir les tarifs"
                        className="flex items-center gap-2"
                      >
                        <HandCoins
                          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                          aria-hidden="true"
                        />
                        Pricing
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Menu mobile - Drawer */}
              <MobileDrawer
                session={session}
                userInitials={userInitials}
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
              />
            </section>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Composant principal avec Suspense
export function Navbar() {
  return (
    <Suspense
      fallback={
        <header role="banner">
          <nav
            className="sticky top-0 z-50 border-b border-gray-200/50 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-sm backdrop-blur-md"
            role="navigation"
            aria-label="Navigation principale"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Image
                      src="/logolast.png"
                      alt="Logo Lastmodel"
                      width={40}
                      height={40}
                      priority
                    />
                    <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                      Lastmodel
                    </h1>
                  </div>
                </div>
                <div
                  className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-pink-200"
                  role="status"
                  aria-label="Chargement..."
                />
              </div>
            </div>
          </nav>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
