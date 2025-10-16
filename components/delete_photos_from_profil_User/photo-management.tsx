'use client';

import { createContext, useContext, useOptimistic } from 'react';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

interface PhotoManagementContextType {
  optimisticPhotos: Photo[];
  deletePhoto: (photoId: string) => void;
}

const PhotoManagementContext = createContext<PhotoManagementContextType | null>(
  null
);

interface PhotoManagementProps {
  children: React.ReactNode;
  initialPhotos: Photo[];
}

export function PhotoManagement({
  children,
  initialPhotos,
}: PhotoManagementProps) {
  // useOptimistic pour la suppression optimiste
  const [optimisticPhotos, addOptimisticPhoto] = useOptimistic(
    initialPhotos,
    (state, photoIdToDelete: string) =>
      state.filter((photo) => photo.id !== photoIdToDelete)
  );

  const deletePhoto = (photoId: string) => {
    addOptimisticPhoto(photoId);
  };

  return (
    <PhotoManagementContext.Provider value={{ optimisticPhotos, deletePhoto }}>
      {children}
    </PhotoManagementContext.Provider>
  );
}

export function usePhotoManagement() {
  const context = useContext(PhotoManagementContext);
  if (!context) {
    throw new Error('usePhotoManagement must be used within PhotoManagement');
  }
  return context;
}
