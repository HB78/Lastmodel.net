'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { PhotoDeleteButton } from './photo-delete-button';
import { usePhotoManagement } from './photo-management';

export function PhotoList() {
  const { optimisticPhotos } = usePhotoManagement();

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="grid"
      aria-label="Galerie de photos de profil"
    >
      {/* Photos existantes */}
      {optimisticPhotos.map((photo, index) => (
        <Card
          key={photo.id}
          role="gridcell"
          aria-labelledby={`photo-${photo.id}-label`}
          className={`${
            photo.isMain
              ? 'border-2 border-green-500 shadow-lg'
              : 'border-0 shadow-lg'
          } bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
        >
          <CardHeader
            className={`${
              photo.isMain
                ? 'border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50'
                : 'border-b border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50'
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {photo.isMain && (
                  <Star
                    className="h-4 w-4 fill-current text-green-600"
                    aria-hidden="true"
                  />
                )}
                <span
                  id={`photo-${photo.id}-label`}
                  className={`text-sm font-medium ${
                    photo.isMain ? 'text-green-700' : 'text-slate-600'
                  }`}
                >
                  {photo.isMain ? 'Photo principale' : `Photo ${index + 1}`}
                </span>
              </div>
              <PhotoDeleteButton photoId={photo.id} isMain={photo.isMain} />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={photo.url}
                alt={
                  photo.isMain
                    ? 'Photo de profil principale'
                    : `Photo de profil ${index + 1}`
                }
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
                priority={photo.isMain}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
