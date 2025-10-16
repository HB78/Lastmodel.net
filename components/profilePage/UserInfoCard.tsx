import { Button } from '@/components/ui/button';
import { Edit3, Mail, User } from 'lucide-react';
import Link from 'next/link';

interface userInfos {
  email: string;
  username: string;
}

export const UserInfoCard = ({ email, username }: userInfos) => {
  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Nom d'utilisateur
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {username}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
              <Mail className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Adresse email
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">{email}</span>
        </div>
      </div>

      {/* Statistiques rapides */}

      {/* Action de modification */}
      <Button
        asChild
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
      >
        <Link
          href="/profile/edit"
          className="flex items-center justify-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Modifier mes informations
        </Link>
      </Button>
    </div>
  );
};
