// Composant carte produit amélioré
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Camera, MapPin } from 'lucide-react';
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
  isPriority = false,
}: ProductCardProps) {
  // Trouver l'image principale ou la première image
  const mainPhoto = photos.find((photo) => photo.isMain) || photos[0];
  const imageUrl = mainPhoto?.url || '/placeholder-avatar.jpg';

  // Formater l'âge
  const ageText = age ? `${age} ans` : 'Âge non renseigné';

  // Formater le sexe (sans emoji : DESIGN.md → icônes Lucide uniquement,
  // et "Homme"/"Femme" se lit très bien sans pictogramme)
  const sexText =
    sex === 'homme' ? 'Homme' : sex === 'femme' ? 'Femme' : 'Non renseigné';

  // Créer un résumé accessible
  const accessibleSummary = [
    name,
    ageText !== 'Âge non renseigné' ? ageText : null,
    sex ? (sex === 'homme' ? 'Homme' : sex === 'femme' ? 'Femme' : null) : null,
    city ? `à ${city}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  // ♿ ACCESSIBILITÉ : la carte entière est UN lien. Son aria-label
  // ("Voir le profil de Léa, 24 ans, Femme, à Lyon") est ce que lit le
  // lecteur d'écran : le contenu visuel à l'intérieur (badges, emojis)
  // n'est donc pas relu une 2ᵉ fois. Pas de role="..." en plus :
  // <li>, <a> et <img> ont déjà le bon rôle natif. Avant, chaque carte
  // déclarait des rôles invalides (listitem hors d'une liste) et un
  // role="status" qui créait une zone "annoncée" par carte.
  //
  // 🧱 DONNÉES EXTRÊMES : un nom ou une ville très long (ou un mot sans
  // espace, ex: un email collé en guise de nom) ne doit pas déborder :
  // - min-w-0 : autorise la carte à rétrécir dans la grille
  // - [overflow-wrap:anywhere] : coupe un mot trop long au lieu de déborder
  // - truncate sur la ville : une seule ligne, "…" si trop long
  return (
    <li className="group min-w-0">
      <Link
        href={`/produits/${id}`}
        className="block rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
        aria-label={`Voir le profil de ${accessibleSummary}`}
      >
        <Card className="h-full cursor-pointer gap-0 border-2 transition-shadow duration-300 group-focus-within:border-purple-300 group-hover:border-purple-200 group-hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              {/* priority = "charge cette image tout de suite". Avant, il était
                  sur TOUTES les cartes → toutes les photos préchargées d'un coup.
                  Sur l'accueil, les cartes sont sous la hero plein écran
                  (invisibles au chargement) → aucune n'en a besoin : elles se
                  chargent au défilement (lazy loading par défaut de next/image). */}
              <Image
                priority={isPriority}
                quality={75}
                src={imageUrl}
                alt={`Photo de profil de ${name}`}
                width={400}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photos.length > 1 && (
                <div
                  className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                  aria-hidden="true"
                >
                  {photos.length}
                  <Camera className="h-3 w-3" />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3
                className="line-clamp-2 text-lg font-semibold text-gray-900 [overflow-wrap:anywhere]"
                id={`product-title-${id}`}
              >
                {name}
              </h3>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  {ageText}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  {sexText}
                </span>
                {/* inline-flex + min-w-0 + truncate sur le texte seul :
                    une ville trop longue finit par "…" sans pousser l'icône */}
                <span className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {city || 'Ville non renseignée'}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
