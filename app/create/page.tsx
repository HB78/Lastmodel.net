import CreateProductForm from '@/components/forms/CreateProductForm';
import { prisma } from '@/lib/prisma-setup/db';
import { getSessionWithProfileCheck } from '@/tools';
import { Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function CreateProductPage() {
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (isProfileComplete) redirect('/profile');

  // Récupérer les origines depuis la DB
  const origins = await prisma.origin.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header avec navigation */}
        <div className="mb-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Completer votre profil
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-red-600">
              Vous devez remplir tous les champs pour apparaitre en ligne.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Formulaire principal */}
          <div className="space-y-8 xl:col-span-3">
            <CreateProductForm origins={origins} />
          </div>
        </div>
      </div>
    </div>
  );
}
