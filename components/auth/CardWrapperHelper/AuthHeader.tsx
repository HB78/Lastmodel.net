import Link from 'next/link';

const AuthHearder = ({ label }: { label: string }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      {/* Marque cliquable : seul moyen de revenir à l'accueil (pas de navbar ici) */}
      <Link
        href="/"
        className="rounded font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 transition-colors duration-200 hover:text-purple-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
      >
        Lastmodel
      </Link>
      <h1 className="text-sm font-semibold text-gray-900">{label}</h1>
    </div>
  );
};

export default AuthHearder;
