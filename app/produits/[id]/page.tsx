import PhotoGallery from '@/components/carrousel/PhotoGallery';
import AddCommentaire from '@/components/commentaires/AddCommentaire';
import ShowCommentaire from '@/components/commentaires/ShowCommentaire';
import LikeButton from '@/components/likes/LikeButton';
import { Navbar } from '@/components/navbar/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCachedProfile } from '@/lib/cache';
import {
  createErrorMetadata,
  createNotFoundMetadata,
  createProfileMetadata,
} from '@/lib/metadata/profileMetadata';
import { getSession } from '@/tools';
import { ArrowLeft, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// 🚀 DOUBLE CACHE :
// 1. cache() de React : évite les appels dupliqués dans le même rendu (generateMetadata + composant)
// 2. getCachedProfile() : unstable_cache Next.js qui persiste 10min entre les requêtes
const fetchProduct = cache(async (id: string) => {
  try {
    const product = await getCachedProfile(id);
    if (!product) {
      notFound();
    }
    return product;
  } catch (error) {
    console.error(error);
    notFound();
  }
});

// 🚀 METADATA DYNAMIQUES AVEC FACTORY CENTRALISÉE
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
      return createNotFoundMetadata();
    }

    return createProfileMetadata(product);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return createErrorMetadata();
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const session = await getSession();

  if (!product || !id) {
    notFound();
  }

  // Trouver l'image principale ou la première image
  const mainPhoto =
    product.photos.find((photo) => photo.isMain) || product.photos[0];
  const imageUrl = mainPhoto?.url || '/placeholder-avatar.jpg';

  // Formater l'âge
  const ageText = product.age ? `${product.age} ans` : 'Âge non renseigné';

  // Formater le sexe
  const sexText =
    product.sex === 'homme'
      ? '👨 Homme'
      : product.sex === 'femme'
        ? '👩 Femme'
        : 'Non renseigné';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb/Navigation */}
        <nav aria-label="Fil d'Ariane">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Retourner à la liste des produits"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retour aux produits
            </Button>
          </Link>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Section Images */}
          <section aria-labelledby="images-title">
            <h2 id="images-title" className="sr-only">
              Photos de {product.name}
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={imageUrl}
                      alt={`Photo principale de ${product.name}`}
                      width={600}
                      height={600}
                      priority
                      className="h-96 w-full cursor-pointer object-cover transition-opacity hover:opacity-95 lg:h-[500px] xl:h-full"
                      role="img"
                    />
                    {session?.user.id ? (
                      <div className="absolute top-4 right-4">
                        <LikeButton profileId={id} />
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
              <PhotoGallery
                photos={product.photos}
                productName={product.name}
              />
            </div>
          </section>

          {/* Section Informations */}
          <section aria-labelledby="product-info-title">
            <div className="space-y-6">
              {/* En-tête du profil */}
              <header>
                <h1
                  id="product-info-title"
                  className="mb-4 text-3xl font-bold text-gray-900"
                >
                  {product.name}
                </h1>

                {/* Tags d'informations */}
                <div
                  className="mb-4 flex flex-wrap gap-3"
                  role="list"
                  aria-label="Informations principales"
                >
                  <span
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    role="listitem"
                    aria-label={`Âge: ${ageText}`}
                  >
                    {ageText}
                  </span>
                  <span
                    className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                    role="listitem"
                    aria-label={`Genre: ${sexText.replace(/👨|👩/g, '').trim()}`}
                  >
                    {sexText}
                  </span>
                  <span
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
                    role="listitem"
                    aria-label={`Ville: ${product.city || 'Ville non renseignée'}`}
                  >
                    📍 {product.city || 'Ville non renseignée'}
                  </span>
                  <span
                    className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                    role="listitem"
                    aria-label={`Origine: ${product?.origin?.name || 'Origine non renseignée'}`}
                  >
                    🌍 {product.origin?.name || 'Origine non renseignée'}
                  </span>
                </div>

                {/* Contact */}
                <div className="mb-4">
                  <span
                    className="text-md inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-800"
                    role="text"
                    aria-label={`Téléphone: ${product.phone || 'Non renseigné'}`}
                  >
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    {product.phone || 'Non renseigné'}
                  </span>
                </div>
              </header>

              {/* Description */}
              <section aria-labelledby="description-title">
                <h2
                  id="description-title"
                  className="mb-3 text-xl font-semibold text-gray-900"
                >
                  Description
                </h2>
                <p className="description leading-relaxed text-gray-600">
                  {product.description || 'Aucune description disponible'}
                </p>
              </section>

              {/* Informations détaillées */}
              <section aria-labelledby="details-title">
                <Card>
                  <CardContent className="p-4">
                    <h3
                      id="details-title"
                      className="mb-2 font-semibold text-gray-900"
                    >
                      Informations du profil
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Origine:</dt>
                        <dd className="font-medium">
                          {product.origin?.name || 'Non renseignée'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Ville:</dt>
                        <dd className="font-medium">
                          {product.city || 'Non renseignée'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Âge:</dt>
                        <dd className="font-medium">{ageText}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Genre:</dt>
                        <dd className="font-medium">
                          {sexText.replace(/👨|👩/g, '').trim()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Téléphone:</dt>
                        <dd className="font-medium">
                          {product.phone || 'Non renseigné'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Poids:</dt>
                        <dd className="font-medium">
                          {product.poids
                            ? `${product.poids} kg`
                            : 'Non renseigné'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Taille:</dt>
                        <dd className="font-medium">
                          {product.taille
                            ? `${product.taille} cm`
                            : 'Non renseignée'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </section>
            </div>
          </section>
        </div>

        {/* Section Commentaires */}
        <section aria-labelledby="comments-title" className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h2
                id="comments-title"
                className="mb-6 text-xl font-semibold text-gray-900"
              >
                Commentaires
              </h2>

              {/* Formulaire d'ajout de commentaire */}
              {session?.user?.id ? (
                <div className="mb-6">
                  <AddCommentaire id={id} />
                </div>
              ) : (
                <p className="mb-6 text-sm text-gray-500">
                  <Link
                    href="/signin"
                    className="rounded text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
                    aria-label="Se connecter pour pouvoir laisser un commentaire"
                  >
                    Connectez-vous
                  </Link>{' '}
                  pour laisser un commentaire
                </p>
              )}

              {/* Liste des commentaires */}
              <div role="region" aria-label="Liste des commentaires">
                <ShowCommentaire profileId={id} />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
