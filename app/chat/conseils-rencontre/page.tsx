import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '10 conseils pour réussir vos rencontres en ligne - Lastmodel',
  description:
    'Découvrez 10 conseils d\'experts pour maximiser vos chances de rencontres authentiques sur Lastmodel. Stratégies, bonnes pratiques et erreurs à éviter.',
  keywords: [
    'conseils rencontre en ligne',
    'réussir site rencontre',
    'stratégie dating',
    'premier message rencontre',
    'premier rendez-vous',
  ],
};

const conseils = [
  {
    titre: 'Complétez votre profil à 100%',
    description:
      'Les profils complets reçoivent 5x plus de visites. Ajoutez au moins 3 photos de qualité, une bio détaillée et vos centres d\'intérêt.',
  },
  {
    titre: 'Envoyez des premiers messages personnalisés',
    description:
      'Évitez "Salut ça va ?". Faites référence à un élément du profil de la personne. Taux de réponse 3x supérieur.',
  },
  {
    titre: 'Soyez authentique, pas parfait',
    description:
      'Les personnes recherchent la sincérité, pas la perfection. Montrez qui vous êtes vraiment.',
  },
  {
    titre: 'Restez actif régulièrement',
    description:
      'Connectez-vous 2-3 fois par semaine minimum. L\'algorithme favorise les profils actifs.',
  },
  {
    titre: 'Proposez une rencontre rapidement',
    description:
      'Après 3-5 échanges de qualité, proposez un café ou une balade. Ne restez pas des semaines en messages.',
  },
  {
    titre: 'Choisissez un lieu public pour le 1er RDV',
    description:
      'Café, parc, musée. Évitez les lieux isolés ou votre domicile pour la sécurité.',
  },
  {
    titre: 'Soyez patient et persévérant',
    description:
      'En moyenne, il faut 2-4 mois d\'utilisation active pour trouver une relation sérieuse. Ne vous découragez pas.',
  },
  {
    titre: 'Filtrez selon vos vraies priorités',
    description:
      'Définissez vos critères essentiels (valeurs, projet de vie) vs préférences secondaires (taille, loisirs).',
  },
  {
    titre: 'Gérez vos attentes',
    description:
      'Tout le monde ne correspondra pas. C\'est normal. Concentrez-vous sur la qualité, pas la quantité.',
  },
  {
    titre: 'Faites confiance à votre instinct',
    description:
      'Si quelque chose vous semble bizarre, signalez ou bloquez. Votre sécurité avant tout.',
  },
];

export default function ConseilsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            10 conseils pour réussir vos rencontres en ligne
          </h1>
          <p className="text-lg text-gray-600">
            Stratégies éprouvées pour maximiser vos chances de rencontres authentiques sur Lastmodel
          </p>
        </header>

        <section
          className="mb-12 rounded-lg border-l-4 border-purple-600 bg-white p-6 shadow-md"
          aria-labelledby="tldr-heading"
        >
          <h2 id="tldr-heading" className="mb-3 text-xl font-semibold text-gray-900">
            En bref :
          </h2>
          <ul className="space-y-2 text-gray-700" role="list">
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span><strong>Profil complet</strong> = 5x plus de succès</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span><strong>Messages personnalisés</strong> = 3x plus de réponses</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span><strong>Proposez une rencontre</strong> après 3-5 échanges</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">✓</span>
              <span><strong>Patience</strong> : 2-4 mois en moyenne pour trouver</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="conseils-heading">
          <h2 id="conseils-heading" className="sr-only">
            Liste des 10 conseils
          </h2>
          <div className="space-y-6">
            {conseils.map((conseil, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="mb-3 flex items-start text-xl font-semibold text-gray-900">
                  <span
                    className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white"
                    aria-label={`Conseil ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                  {conseil.titre}
                </h3>
                <p className="ml-11 text-gray-700">{conseil.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white shadow-lg"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="mb-3 text-2xl font-bold">
            Prêt(e) à appliquer ces conseils ?
          </h2>
          <p className="mb-6 text-purple-100">
            Rejoignez Lastmodel et commencez votre recherche
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
          >
            Créer mon compte
          </Link>
        </section>
      </article>
    </div>
  );
}
