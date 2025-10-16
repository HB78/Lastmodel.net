import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sécurité et confidentialité - Lastmodel',
  description:
    'Comment Lastmodel protège vos données personnelles ? RGPD, chiffrement SSL, hébergement Europe, modération. Guide complet de la sécurité sur Lastmodel.',
  keywords: [
    'sécurité site rencontre',
    'confidentialité Lastmodel',
    'RGPD rencontre',
    'protection données',
    'site rencontre sécurisé',
  ],
};

export default function SecuritePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Sécurité et confidentialité sur Lastmodel
          </h1>
          <p className="text-lg text-gray-600">
            Comment Lastmodel protège vos données personnelles et garantit votre sécurité en ligne
          </p>
        </header>

        <section
          id="tldr"
          className="mb-12 rounded-lg border-l-4 border-green-600 bg-white p-6 shadow-md"
          aria-labelledby="tldr-heading"
        >
          <h2 id="tldr-heading" className="mb-3 text-xl font-semibold text-gray-900">
            En bref :
          </h2>
          <ul className="space-y-2 text-gray-700" role="list">
            <li className="flex items-start">
              <span className="mr-2 text-green-600" aria-hidden="true">🔒</span>
              <span><strong>Chiffrement SSL/TLS</strong> pour toutes les communications</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-600" aria-hidden="true">🇪🇺</span>
              <span><strong>Hébergement en Europe</strong>, conforme RGPD</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-600" aria-hidden="true">✓</span>
              <span><strong>Profils vérifiés manuellement</strong> par notre équipe</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-600" aria-hidden="true">💳</span>
              <span><strong>Paiements sécurisés</strong> via Stripe</span>
            </li>
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="protection-heading">
          <h2 id="protection-heading" className="mb-6 text-2xl font-bold text-gray-900">
            Comment Lastmodel protège vos données ?
          </h2>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-900">
              <span className="mr-3 text-2xl" aria-hidden="true">🔐</span>
              Chiffrement de bout en bout
            </h3>
            <p className="text-gray-700">
              Toutes les données échangées entre votre navigateur et nos serveurs sont chiffrées avec SSL/TLS.
              Vos mots de passe sont hashés et jamais stockés en clair.
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-900">
              <span className="mr-3 text-2xl" aria-hidden="true">🇪🇺</span>
              Conformité RGPD
            </h3>
            <p className="mb-3 text-gray-700">
              Lastmodel est 100% conforme au RGPD :
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-700" role="list">
              <li>Données hébergées en Europe</li>
              <li>Accès à vos données à tout moment</li>
              <li>Suppression complète possible</li>
              <li>Zéro partage avec des tiers</li>
            </ul>
          </div>
        </section>

        <section
          className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white shadow-lg"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="mb-3 text-2xl font-bold">
            Une question sur la sécurité ?
          </h2>
          <p className="mb-6 text-purple-100">
            Notre équipe répond en moins de 24h
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
          >
            Contacter le support
          </Link>
        </section>
      </article>
    </div>
  );
}
