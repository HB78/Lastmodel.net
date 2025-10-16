import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';

const ImageGallerie = () => {
  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
              <Camera className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Photos ajoutées
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">5/11</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Photo principale
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Définie</span>
          </div>
        </div>
      </div>

      {/* Aperçu visuel */}

      {/* Action de gestion */}
      <Button
        asChild
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
      >
        <Link
          href="/profile/photos"
          className="flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Gérer mes photos
        </Link>
      </Button>
    </div>
  );
};

export default ImageGallerie;
