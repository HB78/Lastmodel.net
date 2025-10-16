import EditUserForm from '@/components/forms/EditUserForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma-setup/db';
import { getSessionWithProfileCheck } from '@/tools';
import { User } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (!isProfileComplete) redirect('/create');

  // Récupérer les origines depuis la DB
  const origins = await prisma.origin.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="mx-auto max-w-4xl text-black">
      {/* Header avec navigation */}
      <div className="mb-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Modifier mon profil
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Mettez à jour vos informations personnelles et votre description
          </p>
        </div>
      </div>

      {/* Formulaire d'édition du profil */}
      <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <User className="h-5 w-5 text-blue-600" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EditUserForm session={session} origins={origins} />
        </CardContent>
      </Card>
    </div>
  );
}
