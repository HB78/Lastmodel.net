import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import DeleteCommentaire from './DeleteCommentaire';

interface ShowCommentaireProps {
  profileId: string;
}

const ShowCommentaire = async ({ profileId }: ShowCommentaireProps) => {
  // Récupérer la session utilisateur pour les permissions
  const session = await getSession();

  // Récupérer les commentaires du profil
  const commentaires = await prisma.commentaire.findMany({
    where: {
      profileId: profileId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          photos: {
            where: { isMain: true },
            select: { url: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Couleurs pour les avatars (8 couleurs différentes)
  const avatarColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];

  // Fonction pour générer une couleur unique basée sur l'ID utilisateur
  const getColorFromUserId = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const charCode = userId.charCodeAt(i);
      hash = charCode + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % avatarColors.length;
    return avatarColors[colorIndex];
  };

  return (
    <section className="space-y-4" aria-labelledby="user-comments-title">
      <div className="border-t pt-4">
        <h4 id="user-comments-title" className="mb-4 font-medium text-gray-900">
          Commentaires des utilisateurs ({commentaires.length})
        </h4>

        {commentaires.length > 0 ? (
          <div
            className="space-y-4"
            role="list"
            aria-label={`${commentaires.length} commentaire${commentaires.length > 1 ? 's' : ''}`}
          >
            {commentaires.map((commentaire) => {
              // Récupérer la photo principale de l'auteur (s'il en a une)
              const mainPhoto = commentaire.author.photos?.[0]?.url;
              const authorName =
                commentaire.author.name || 'Utilisateur anonyme';

              return (
                <article
                  key={commentaire.id}
                  className="rounded-lg bg-gray-50 p-4"
                  role="listitem"
                  aria-labelledby={`comment-author-${commentaire.id}`}
                  aria-describedby={`comment-content-${commentaire.id} comment-date-${commentaire.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={mainPhoto}
                          alt={`Photo de profil de ${authorName}`}
                        />
                        <AvatarFallback
                          className={`${getColorFromUserId(
                            commentaire.author.id
                          )} text-sm font-medium text-white`}
                          aria-label={`Initiales de ${authorName}: ${getInitials(authorName)}`}
                        >
                          {getInitials(authorName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <header className="mb-1 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p
                            id={`comment-author-${commentaire.id}`}
                            className="text-sm font-medium text-gray-900"
                          >
                            {authorName}
                          </p>
                          <time
                            id={`comment-date-${commentaire.id}`}
                            className="text-xs text-gray-500"
                            dateTime={commentaire.createdAt.toISOString()}
                            title={commentaire.createdAt.toLocaleString(
                              'fr-FR'
                            )}
                          >
                            {formatDistanceToNow(commentaire.createdAt, {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </time>
                        </div>
                        {/* Bouton de suppression */}
                        <div
                          role="group"
                          aria-label="Actions sur le commentaire"
                        >
                          <DeleteCommentaire
                            commentaireId={commentaire.id}
                            authorId={commentaire.author.id}
                            currentUserId={session?.user?.id}
                          />
                        </div>
                      </header>
                      <p
                        id={`comment-content-${commentaire.id}`}
                        className="text-sm text-gray-700"
                      >
                        {commentaire.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className="py-8 text-center"
            role="status"
            aria-label="Aucun commentaire disponible"
          >
            <p className="text-gray-500">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowCommentaire;
