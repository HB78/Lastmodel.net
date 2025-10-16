import { Button } from '@/components/ui/button';
import { Lock, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

const PasswordCard = () => {
  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Statut mot de passe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Sécurisé</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Force du mot de passe
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600">Fort</span>
        </div>
      </div>

      <Button
        asChild
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
      >
        <Link
          href="/profile/password"
          className="flex items-center justify-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Modifier mon mot de passe
        </Link>
      </Button>
    </div>
  );
};

export default PasswordCard;
