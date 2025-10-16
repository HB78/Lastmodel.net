'use client';

import { Button } from '@/components/ui/button';
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
}

export default function PhotoGallery({
  photos,
  productName,
}: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {/* Mini photos */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-80"
            onClick={() => openModal(index)}
          >
            <Image
              src={photo.url}
              alt="photo simple"
              fill
              className="object-cover"
              quality={70}
              priority={true}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Modal avec carrousel */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl p-0">
          <DialogTitle className="sr-only">Photos de {productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Galerie de photos de {productName} avec navigation par carrousel
          </DialogDescription>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <Carousel className="w-full">
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={index}>
                  <div className="relative flex h-[70vh] w-full items-center justify-center">
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
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
