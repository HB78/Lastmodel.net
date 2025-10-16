/**
 * UserMenu - Dropdown menu de l'avatar utilisateur (desktop uniquement)
 *
 * Fonctionnalités :
 * - Affiche l'avatar utilisateur cliquable avec initiales
 * - Au clic, affiche un menu dropdown avec :
 *   - Infos utilisateur (avatar, nom, email)
 *   - Liens : Mon Profil, Mes Favoris, Pricing (si FREE)
 *   - Bouton de déconnexion
 * - Utilisé uniquement sur desktop, le mobile utilise le MobileDrawer
 */

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, LogOut, Settings, User } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Signout } from '../auth/signoutButton/Signout';

interface UserMenuProps {
  session: any;
  userInitials: string;
  setIsMenuOpen: (open: boolean) => void;
}

export function UserMenu({
  session,
  userInitials,
  setIsMenuOpen,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-purple-100 transition-all duration-200 hover:ring-purple-200"
          aria-label={`Menu utilisateur - ${session.user.name}`}
          aria-haspopup="menu"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage
              src=""
              alt={`Photo de profil de ${session.user.name}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-semibold text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 border-gray-200/50 bg-white/95 shadow-xl backdrop-blur-md"
        align="end"
        forceMount
        role="menu"
        aria-label="Menu utilisateur"
      >
        <DropdownMenuLabel className="p-4 font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src=""
                  alt={`Photo de profil de ${session.user.name}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 font-semibold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm leading-none font-semibold text-gray-900">
                  {session.user.name}
                </p>
                <p className="mt-1 text-xs leading-none text-gray-500">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200/50" />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center px-4 py-3 text-black transition-colors hover:bg-purple-50"
            role="menuitem"
          >
            <User
              className="mr-3 h-4 w-4 text-purple-600"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Mon Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/favorites"
            className="flex cursor-pointer items-center px-4 py-3 text-black transition-colors hover:bg-purple-50"
            role="menuitem"
          >
            <Heart
              className="mr-3 h-4 w-4 text-purple-600"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Mes Favoris</span>
          </Link>
        </DropdownMenuItem>

        {session?.user.subscriptionType === 'FREE' && (
          <DropdownMenuItem asChild>
            <Link
              href="/pricing"
              className="flex cursor-pointer items-center px-4 py-3 text-black transition-colors hover:bg-purple-50"
              role="menuitem"
            >
              <Settings
                className="mr-3 h-4 w-4 text-purple-600"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">Pricing</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-gray-200/50" />
        <DropdownMenuItem
          className="cursor-pointer px-4 py-3 text-red-600 transition-colors hover:bg-red-50 focus:text-red-600"
          role="menuitem"
        >
          <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
          <Signout setIsMenuOpen={setIsMenuOpen} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
