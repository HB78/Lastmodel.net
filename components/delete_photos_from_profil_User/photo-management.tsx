'use client';

import { createContext, useContext, useOptimistic } from 'react';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

type PhotoAction =
  | { type: 'delete'; photoId: string }
  | { type: 'add'; photo: Photo };

interface PhotoManagementContextType {
  optimisticPhotos: Photo[];
  deletePhoto: (photoId: string) => void;
  addPhoto: (photo: Photo) => void;
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
  // useOptimistic pour la suppression et l'ajout optimiste
  const [optimisticPhotos, updateOptimisticPhotos] = useOptimistic(
    initialPhotos,
    (state, action: PhotoAction) => {
      if (action.type === 'delete') {
        return state.filter((photo) => photo.id !== action.photoId);
      } else if (action.type === 'add') {
        return [...state, action.photo];
      }
      return state;
    }
  );

  const deletePhoto = (photoId: string) => {
    updateOptimisticPhotos({ type: 'delete', photoId });
  };

  const addPhoto = (photo: Photo) => {
    updateOptimisticPhotos({ type: 'add', photo });
  };

  return (
    <PhotoManagementContext.Provider
      value={{ optimisticPhotos, deletePhoto, addPhoto }}
    >
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
