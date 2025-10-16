// Composant carte produit amélioré
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  sex: string | null;
  age: number | null;
  city: string | null;
  photos: Array<{
    url: string;
    isMain: boolean;
  }>;
  isPriority?: boolean;
}

export function ProductCard({
  id,
  name,
  sex,
  age,
  city,
  photos,
}: ProductCardProps) {
  // Trouver l'image principale ou la première image
  const mainPhoto = photos.find((photo) => photo.isMain) || photos[0];
  const imageUrl = mainPhoto?.url || '/placeholder-avatar.jpg';

  // Formater l'âge
  const ageText = age ? `${age} ans` : 'Âge non renseigné';

  // Formater le sexe
  const sexText =
    sex === 'homme'
      ? '👨 Homme'
      : sex === 'femme'
        ? '👩 Femme'
        : 'Non renseigné';

  // Créer un résumé accessible
  const accessibleSummary = [
    name,
    ageText !== 'Âge non renseigné' ? ageText : null,
    sex ? (sex === 'homme' ? 'Homme' : sex === 'femme' ? 'Femme' : null) : null,
    city ? `à ${city}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <article className="group" role="listitem">
      <Link
        href={`/produits/${id}`}
        className="block rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
        aria-label={`Voir le profil de ${accessibleSummary}`}
        role="link"
      >
        <Card className="h-full cursor-pointer gap-0 border-2 transition-shadow duration-300 group-focus-within:border-purple-300 group-hover:border-purple-200 group-hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                priority
                quality={75}
                src={imageUrl}
                alt={`Photo de profil de ${name}`}
                width={400}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                role="img"
              />
              {photos.length > 1 && (
                <div
                  className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                  aria-label={`${photos.length} photos disponibles`}
                  role="status"
                >
                  {photos.length} 📷
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3
                className="line-clamp-2 text-lg font-semibold text-gray-900"
                id={`product-title-${id}`}
              >
                {name}
              </h3>

              <div
                className="flex flex-wrap gap-2 text-xs"
                role="list"
                aria-label="Informations du profil"
              >
                <span
                  className="rounded-full bg-blue-100 px-2 py-1 text-blue-800"
                  role="listitem"
                  aria-label={`Âge: ${ageText}`}
                >
                  {ageText}
                </span>
                <span
                  className="rounded-full bg-green-100 px-2 py-1 text-green-800"
                  role="listitem"
                  aria-label={`Sexe: ${
                    sex === 'homme'
                      ? 'Homme'
                      : sex === 'femme'
                        ? 'Femme'
                        : 'Non renseigné'
                  }`}
                >
                  {sexText}
                </span>
                <span
                  className="rounded-full bg-purple-100 px-2 py-1 text-purple-800"
                  role="listitem"
                  aria-label={`Ville: ${city || 'Ville non renseignée'}`}
                >
                  📍 {city || 'Ville non renseignée'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}
