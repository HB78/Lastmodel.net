import DeleteUser from '@/components/auth/deleteUser/DeleteUser';
import { getSessionWithProfileCheck } from '@/tools';
import { Camera, CreditCard, Edit3, Settings, Shield, Trash2 } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { redirect } from 'next/navigation';
import ImageGallerie from '../../components/profilePage/ImageGallerie';
import PasswordCard from '../../components/profilePage/PasswordCard';
import { UserInfoCard } from '../../components/profilePage/UserInfoCard';

export default async function ProfilePage() {
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (!isProfileComplete) redirect('/create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header moderne */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3">
            <Settings className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">
              Paramètres du compte
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Mon
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}
              Profil
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Personnalisez votre profil, gérez vos photos et paramètres de
            sécurité pour une expérience optimale
          </p>
        </div>

        {/* Navigation par onglets visuels */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="group w-full cursor-pointer rounded-2xl border border-white/50 bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <Link href={'/profile/edit'}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 transition-transform group-hover:scale-110">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Informations
              </h3>
              <p className="mt-1 text-xs text-gray-500">Nom, email</p>
            </Link>
          </div>

          <div className="group w-full cursor-pointer rounded-2xl border border-white/50 bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <Link href={'/profile/photos'}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 transition-transform group-hover:scale-110">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Photos</h3>
              <p className="mt-1 text-xs text-gray-500">Galerie</p>
            </Link>
          </div>

          <div className="group w-full cursor-pointer rounded-2xl border border-white/50 bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <Link href={'/profile/password'}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 transition-transform group-hover:scale-110">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Sécurité</h3>
              <p className="mt-1 text-xs text-gray-500">Mot de passe</p>
            </Link>
          </div>

          <div className="group w-full cursor-pointer rounded-2xl border border-white/50 bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <Link href={'/profile/billing'}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 transition-transform group-hover:scale-110">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Abonnement</h3>
              <p className="mt-1 text-xs text-gray-500">Facturation</p>
            </Link>
          </div>
        </div>

        {/* Grille des cards principales */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 1: Informations du profil */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="border-b border-gray-100/50 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                    <Edit3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Informations personnelles
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  Gérez votre nom et adresse email
                </p>
              </div>
              <div className="p-6">
                <UserInfoCard
                  email={session?.user.email}
                  username={session?.user.name}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Gestion des photos */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="border-b border-gray-100/50 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                    <Camera className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Galerie photos
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  Ajoutez et organisez vos photos de profil
                </p>
              </div>
              <div className="p-6">
                <ImageGallerie />
              </div>
            </div>
          </div>

          {/* Card 3: Mot de passe */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="border-b border-gray-100/50 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Modifiez votre mot de passe pour sécuriser votre compte
                </p>
              </div>
              <div className="p-6">
                <PasswordCard />
              </div>
            </div>
          </div>

          {/* Card 4: Suppression de compte */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-red-100/50 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="border-b border-red-100/50 bg-red-50/50 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Zone dangereuse
                  </h2>
                </div>
                <p className="text-sm text-red-600">
                  Action irréversible - Supprimez définitivement votre compte
                </p>
              </div>
              <div className="bg-red-50/30 p-6">
                <DeleteUser />
              </div>
            </div>
          </div>
        </div>

        {/* Footer informatif */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/50 bg-white/60 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Besoin d'aide ?
            </h3>
            <p className="mb-4 text-gray-600">
              Notre équipe support est là pour vous accompagner dans la gestion
              de votre profil
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={'/contact'}
                className="rounded-xl bg-purple-100 px-6 py-2 font-medium text-purple-700 transition-colors hover:bg-purple-200"
              >
                Centre d'aide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
