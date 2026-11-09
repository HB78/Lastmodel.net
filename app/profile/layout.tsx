import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar/navbar';
import { getSession } from '@/tools';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // On vérifie seulement que l'utilisateur est connecté.
  // Plus de redirection vers /create : un visiteur (qui like, commente,
  // met en favoris) doit pouvoir gérer son compte sans créer d'annonce.
  // Les pages propres à l'annonce (/profile/edit, /profile/photos)
  // gardent leur propre vérification.
  const session = await getSession();
  if (!session?.user?.id) redirect('/signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
