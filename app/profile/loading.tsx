import { ProfileSkeleton } from '@/components/skeleton';
import { User } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header avec navigation - Toujours visible */}
        <div className="mb-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Mon Profil
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Gérez vos informations personnelles, photos et paramètres de
              sécurité
            </p>
          </div>
        </div>

        {/* Skeleton du contenu */}
        <ProfileSkeleton />
      </div>
    </div>
  );
}
