import LikeButton from '@/components/likes/LikeButton';
import { Navbar } from '@/components/navbar/navbar';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { Heart } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function FavoritesPage() {
  // 1. Récupérer la session de l'utilisateur connecté
  const session = await getSession();

  if (!session?.user.id) {
    redirect('/signin');
  }

  // 2. Requête optimisée : récupère tous les profils likés par l'utilisateur connecté
  const likedProfiles = await prisma.like.findMany({
    where: {
      userId: session.user.id, // Tous les likes de l'utilisateur connecté
    },
    include: {
      profile: {
        // Inclut le profil complet avec la photo principale
        include: {
          photos: {
            where: { isMain: true }, // Récupère seulement la photo principale
            take: 1, // Une seule photo
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Les plus récents en premier
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center space-x-3">
            <div className="relative" aria-hidden="true">
              <Heart className="h-10 w-10 animate-pulse fill-rose-500 text-rose-500" />
              <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-sm"></div>
            </div>
            <h1 className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
              Mes Favoris
            </h1>
          </div>
          <div
            className="inline-flex items-center rounded-full border border-white/20 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <p className="font-medium text-gray-700">
              {likedProfiles.length} profil{likedProfiles.length > 1 ? 's' : ''}{' '}
              liké{likedProfiles.length > 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {/* Grille des profils likés */}
        {likedProfiles.length === 0 ? (
          <section
            className="py-20 text-center"
            role="region"
            aria-labelledby="empty-state-title"
          >
            <div className="relative mb-8" aria-hidden="true">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-purple-100">
                <Heart className="h-16 w-16 text-rose-300" />
              </div>
              <div className="absolute inset-0 mx-auto h-32 w-32 animate-ping rounded-full bg-gradient-to-br from-rose-200/50 to-purple-200/50"></div>
            </div>
            <h2
              id="empty-state-title"
              className="mb-3 text-2xl font-bold text-gray-900"
            >
              Aucun favori pour le moment
            </h2>
            <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-600">
              Commencez à explorer et likez les profils qui vous intéressent
              pour les retrouver ici !
            </p>
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-rose-600 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <Link href="/" aria-label="Explorer tous les profils disponibles">
                <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                Explorer les profils
              </Link>
            </Button>
          </section>
        ) : (
          <section aria-labelledby="favorites-grid-title" role="region">
            <h2 id="favorites-grid-title" className="sr-only">
              Liste de vos {likedProfiles.length} profils favoris
            </h2>
            <div
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              role="list"
              aria-label={`${likedProfiles.length} profils favoris`}
            >
              {likedProfiles.map((like, index) => (
                <article
                  key={like.id}
                  className="group overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  role="listitem"
                  aria-posinset={index + 1}
                  aria-setsize={likedProfiles.length}
                >
                  <Link
                    href={`/produits/${like.profile.id}`}
                    className="block rounded-2xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                    aria-label={`Voir le profil de ${like.profile.name || 'Utilisateur'}, ajouté aux favoris le ${new Date(like.createdAt).toLocaleDateString('fr-FR')}`}
                  >
                    {/* Image de profil */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-rose-400 via-purple-500 to-indigo-600">
                      {like.profile.photos?.[0]?.url ? (
                        <Image
                          src={like.profile.photos[0].url || '/placeholder.svg'}
                          alt={`Photo de profil de ${like.profile.name || 'Utilisateur'}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          role="img"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center text-6xl font-bold text-white transition-transform duration-700 group-hover:scale-110"
                          role="img"
                          aria-label={`Avatar avec initiale ${like.profile.name?.[0]?.toUpperCase() || 'U'} pour ${like.profile.name || 'Utilisateur'}`}
                        >
                          {like.profile.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}

                      {/* Overlay gradient au hover */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      ></div>

                      {/* Badge favori */}
                      <div className="absolute top-4 right-4 transform transition-transform duration-300 group-hover:scale-110">
                        <LikeButton profileId={like.profile.id} />
                      </div>
                    </div>

                    {/* Informations du profil */}
                    <div className="p-6">
                      <h3 className="mb-2 truncate text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
                        {like.profile.name || 'Utilisateur'}
                      </h3>

                      <div className="flex items-center space-x-2">
                        <div
                          className="h-2 w-2 rounded-full bg-rose-400"
                          aria-hidden="true"
                        ></div>
                        <time
                          className="text-sm font-medium text-gray-500"
                          dateTime={new Date(like.createdAt).toISOString()}
                          title={`Ajouté aux favoris le ${new Date(
                            like.createdAt
                          ).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                        >
                          Liké le{' '}
                          {new Date(like.createdAt).toLocaleDateString(
                            'fr-FR',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
