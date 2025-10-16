import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-8">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Accès non autorisé
          </h1>
          <p className="text-lg text-gray-600">
            Vous devez être connecté pour accéder à cette page de profil.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/signin"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Se connecter
          </Link>
          <br />
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-gray-200 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-300"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
