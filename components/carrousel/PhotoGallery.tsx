'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Photo {
  url: string;
  isMain: boolean;
}

interface PhotoGalleryProps {
  photos: Photo[];
  productName: string;
  // Élément posé sur la grande photo (ex : le bouton ♥ de la page profil)
  mainPhotoOverlay?: React.ReactNode;
}

export default function PhotoGallery({
  photos,
  productName,
  mainPhotoOverlay,
}: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // La grande photo = la photo principale (ou la 1ʳᵉ s'il n'y en a pas)
  // Elle vit ici (et plus dans page.tsx) pour pouvoir ouvrir la même fenêtre
  // plein écran que les miniatures.
  const mainIndex = Math.max(
    photos.findIndex((photo) => photo.isMain),
    0
  );
  const mainUrl = photos[mainIndex]?.url || '/placeholder-avatar.jpg';

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Grande photo (même apparence qu'avant, déplacée depuis page.tsx)
          Le bouton et l'élément posé dessus (♥) sont VOISINS, pas imbriqués :
          un bouton ne peut pas contenir un autre bouton. */}
      <Card>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-lg">
            <button
              type="button"
              onClick={() => openModal(mainIndex)}
              aria-label={`Agrandir la photo principale de ${productName}`}
              className="block w-full focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
            >
              <Image
                src={mainUrl}
                alt={`Photo principale de ${productName}`}
                width={600}
                height={600}
                priority
                className="h-96 w-full cursor-pointer object-cover transition-opacity hover:opacity-95 lg:h-[500px] xl:h-full"
              />
            </button>
            {mainPhotoOverlay && (
              <div className="absolute top-4 right-4 z-10">
                {mainPhotoOverlay}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mini photos : seulement s'il y en a plusieurs (une seule miniature,
          identique à la grande photo, ne sert à rien) */}
      {photos.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg">
          {photos.map((photo, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openModal(index)}
              aria-label={`Voir la photo ${index + 1} sur ${photos.length} en plein écran`}
              // Bordure sur la photo affichée en grand (la photo principale)
              className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 transition-opacity hover:opacity-80 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none ${
                index === mainIndex ? 'border-purple-600' : 'border-transparent'
              }`}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                className="object-cover"
                quality={70}
                // 80px = taille réelle de la miniature : le navigateur
                // télécharge une petite image (avant : 100vw = image géante)
                // et plus de priority : elles se chargent normalement
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal avec carrousel */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* - sm:max-w-[…] : le Dialog de shadcn impose sm:max-w-lg (512px) dès
              640px de large, ce qui écrasait max-w-4xl → fenêtre minuscule
              sur ordinateur. On la laisse aller jusqu'à 1024px.
            - showCloseButton={false} : shadcn ajoute son propre ✕ ; avec le
              nôtre ci-dessous, il y en avait deux l'un sur l'autre.
            - fond Nuit Profonde (DESIGN.md) : les photos ressortent */}
        <DialogContent
          showCloseButton={false}
          className="max-h-[90svh] max-w-[min(64rem,calc(100%-2rem))] border-0 bg-nuit-profonde p-0 sm:max-w-[min(64rem,calc(100%-2rem))]"
        >
          <DialogTitle className="sr-only">Photos de {productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Galerie de photos de {productName} avec navigation par carrousel
          </DialogDescription>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 z-10 h-11 w-11 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white focus-visible:ring-white/60"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer la galerie"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* startIndex : le carrousel démarre sur la photo cliquée.
              Avant, selectedIndex était mémorisé mais jamais transmis :
              la fenêtre s'ouvrait toujours sur la 1ʳᵉ photo. */}
          <Carousel className="w-full" opts={{ startIndex: selectedIndex }}>
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={index}>
                  {/* svh = hauteur vraiment visible sur téléphone (sans la
                      barre d'adresse), plus grand qu'avant (70vh) */}
                  <div className="relative flex h-[80svh] w-full items-center justify-center">
                    <Image
                      src={photo.url}
                      alt={`Photo ${index + 1} de ${productName}`}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      priority={index === selectedIndex}
                    />
                    {photo.isMain && (
                      <div className="absolute top-4 left-4 rounded bg-blue-500 px-3 py-1 text-sm text-white">
                        Photo principale
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Flèches rondes de 44px (confortables au doigt), noir
                translucide pour rester visibles sur toutes les photos */}
            <CarouselPrevious className="left-3 h-11 w-11 border-white/30 bg-black/40 text-white hover:bg-black/60 hover:text-white" />
            <CarouselNext className="right-3 h-11 w-11 border-white/30 bg-black/40 text-white hover:bg-black/60 hover:text-white" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
