import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide du profil parfait - Lastmodel',
  description:
    'Comment créer un profil de rencontre attractif et authentique sur Lastmodel ? Guide complet : choix des photos, rédaction de bio, centres d\'intérêt. Conseils d\'experts 2025.',
  keywords: [
    'profil rencontre',
    'créer profil attractif',
    'photos profil site rencontre',
    'bio profil rencontre',
    'optimiser profil Lastmodel',
  ],
  openGraph: {
    title: 'Guide : Comment créer un profil de rencontre attractif',
    description:
      'Conseils pratiques pour créer un profil Lastmodel qui attire l\'attention : photos, bio, centres d\'intérêt.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment créer un profil de rencontre attractif sur Lastmodel',
  description:
    'Guide étape par étape pour créer un profil authentique et attractif sur Lastmodel',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choisir ses photos de profil',
      text: 'Sélectionnez 3 à 5 photos récentes (moins de 6 mois), naturelles, de bonne qualité, qui vous montrent dans différents contextes.',
    },
    {
      '@type': 'HowToStep',
      name: 'Rédiger sa bio',
      text: 'Écrivez une bio de 100 à 200 mots qui présente qui vous êtes, vos passions et ce que vous recherchez, de manière authentique.',
    },
    {
      '@type': 'HowToStep',
      name: 'Compléter ses centres d\'intérêt',
      text: 'Sélectionnez au moins 5 centres d\'intérêt qui reflètent vraiment votre personnalité et vos activités.',
    },
    {
      '@type': 'HowToStep',
      name: 'Indiquer ses intentions',
      text: 'Soyez transparent sur ce que vous cherchez : relation sérieuse, amitié, ou les deux.',
    },
  ],
};

export default function GuideProfilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Comment créer un profil de rencontre attractif ?
          </h1>
          <p className="text-lg text-gray-600">
            Guide complet pour optimiser votre profil Lastmodel et maximiser vos
            chances de rencontres authentiques
          </p>
          <nav className="mt-6" aria-label="Navigation rapide">
            <h2 className="sr-only">Sections du guide</h2>
            <ul className="flex flex-wrap justify-center gap-4 text-sm" role="list">
              <li>
                <a
                  href="#tldr"
                  className="rounded text-purple-600 underline hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                >
                  En bref
                </a>
              </li>
              <li>
                <a
                  href="#photos"
                  className="rounded text-purple-600 underline hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                >
                  Photos
                </a>
              </li>
              <li>
                <a
                  href="#bio"
                  className="rounded text-purple-600 underline hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                >
                  Rédiger sa bio
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* TL;DR */}
        <section
          id="tldr"
          className="mb-12 rounded-lg border-l-4 border-purple-600 bg-white p-6 shadow-md"
          aria-labelledby="tldr-heading"
        >
          <h2 id="tldr-heading" className="mb-3 text-xl font-semibold text-gray-900">
            En bref :
          </h2>
          <ul className="space-y-2 text-gray-700" role="list">
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span>
                <strong>3-5 photos récentes</strong> et naturelles (éviter selfies et filtres)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span>
                <strong>Bio de 100-200 mots</strong> authentique et positive
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span>
                <strong>Au moins 5 centres d'intérêt</strong> précis et variés
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span>
                Profil complet = <strong>5x plus de visites</strong>
              </span>
            </li>
          </ul>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Pourquoi votre profil est crucial ?
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Votre profil est votre première impression sur Lastmodel. Les statistiques montrent que les profils complets
            reçoivent 5 fois plus de visites et 3 fois plus de messages que les profils incomplets.
          </p>
        </section>

        {/* Section Photos */}
        <section id="photos" className="mb-12" aria-labelledby="photos-heading">
          <h2 id="photos-heading" className="mb-6 text-2xl font-bold text-gray-900">
            1. Choisir ses photos de profil
          </h2>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Photo principale
            </h3>
            <p className="mb-4 text-gray-700">
              Votre photo principale est LA plus importante. Elle doit :
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-700" role="list">
              <li>Être récente (moins de 6 mois) et vous ressembler réellement</li>
              <li>Montrer clairement votre visage</li>
              <li>Être de bonne qualité (éviter les photos floues)</li>
              <li>Vous montrer seul(e)</li>
              <li>Avoir un sourire naturel</li>
            </ul>
          </div>

          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4" role="note" aria-label="À éviter">
            <h4 className="mb-2 font-semibold text-red-900">À éviter :</h4>
            <ul className="ml-6 list-disc space-y-1 text-red-800" role="list">
              <li>Photos de votre ex</li>
              <li>Selfies dans la salle de bain</li>
              <li>Photos de groupe où on ne sait pas qui vous êtes</li>
            </ul>
          </div>
        </section>

        {/* Section Bio */}
        <section id="bio" className="mb-12" aria-labelledby="bio-heading">
          <h2 id="bio-heading" className="mb-6 text-2xl font-bold text-gray-900">
            2. Rédiger sa bio
          </h2>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Structure d'une bonne bio
            </h3>
            <p className="mb-4 text-gray-700">
              Une bio efficace fait entre 100 et 200 mots et répond à ces 4 questions :
            </p>
            <ol className="ml-6 list-decimal space-y-3 text-gray-700" role="list">
              <li><strong>Qui êtes-vous ?</strong> Votre métier/occupation en une phrase</li>
              <li><strong>Quelles sont vos passions ?</strong> 2-3 centres d'intérêt authentiques</li>
              <li><strong>Qu'est-ce qui vous rend unique ?</strong> Un trait de caractère</li>
              <li><strong>Que recherchez-vous ?</strong> Type de relation souhaité</li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white shadow-lg"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="mb-3 text-2xl font-bold">
            Prêt(e) à créer votre profil parfait ?
          </h2>
          <p className="mb-6 text-purple-100">
            Rejoignez Lastmodel et commencez à rencontrer des personnes qui vous correspondent
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
            >
              Créer mon compte
            </Link>
            <Link
              href="/chat/faq"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-purple-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
            >
              Voir la FAQ
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
