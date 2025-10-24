import { PhotoList } from '@/components/delete_photos_from_profil_User/photo-list';
import { PhotoManagement } from '@/components/delete_photos_from_profil_User/photo-management';
import { PhotoUploadZone } from '@/components/delete_photos_from_profil_User/photo-upload-zone';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma-setup/db';
import { getSessionWithProfileCheck } from '@/tools';
import { Camera } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { redirect } from 'next/navigation';

export default async function PhotosPage() {
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (!isProfileComplete) redirect('/create');

  const fetchPhotos = async () => {
    const photos = await prisma.photo.findMany({
      where: { userId: session?.user.id },
      orderBy: [{ isMain: 'desc' }, { order: 'asc' }],
    });
    return photos;
  };
  const photos = await fetchPhotos();

  return (
    <PhotoManagement initialPhotos={photos}>
      <div className="mx-auto max-w-7xl">
        {/* Header avec navigation */}
        <div className="mb-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
              Gérer mes photos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Ajoutez, organisez et gérez vos photos de profil (maximum 11
              photos)
            </p>
          </div>
        </div>

        {/* Zone d'upload */}
        <PhotoUploadZone />

        {/* Grille des photos existantes */}
        <PhotoList />

        {/* Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Link href="/profile">Retour au profil</Link>
            </Button>
          </div>
        </div>
      </div>
    </PhotoManagement>
  );
}
