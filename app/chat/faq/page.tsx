import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Questions fréquentes sur Lastmodel',
  description:
    'Toutes vos questions sur Lastmodel : création de compte, tarifs, fonctionnalités, sécurité, résiliation, confidentialité. Réponses claires et détaillées pour vous aider.',
  keywords: [
    'FAQ Lastmodel',
    'questions site rencontre',
    'aide Lastmodel',
    'comment utiliser Lastmodel',
    'tarifs Lastmodel',
    'sécurité site rencontre',
  ],
  openGraph: {
    title: 'FAQ - Questions fréquentes sur Lastmodel',
    description:
      'Réponses à toutes vos questions sur Lastmodel, le site de rencontre sérieux avec profils vérifiés.',
  },
};

const faqs = [
  {
    question: 'Comment créer un compte sur Lastmodel ?',
    answer:
      "Créer un compte sur Lastmodel est simple et rapide. Cliquez sur 'Inscription' en haut à droite, renseignez votre email et créez un mot de passe sécurisé. Vous recevrez un email de vérification. Une fois vérifié, complétez votre profil avec vos photos (3 minimum recommandé) et vos informations personnelles (bio, centres d'intérêt, ce que vous recherchez). Le processus complet prend environ 5 minutes. Vous pouvez ensuite parcourir les profils immédiatement.",
  },
  {
    question: 'Lastmodel est-il gratuit ?',
    answer:
      "Oui, Lastmodel propose un plan gratuit qui permet de parcourir tous les profils, de liker sans limite et de découvrir l'interface. Cependant, pour être visible dans les recherches des autres membres et pour pouvoir les contacter directement, un abonnement payant est nécessaire. Le plan mensuel coûte 20€/mois et le plan annuel 180€/an (soit 15€/mois, avec 2 mois offerts). Le plan gratuit est idéal pour tester le site avant de s'engager.",
  },
  {
    question: 'Comment annuler mon abonnement Lastmodel ?',
    answer:
      "Vous pouvez annuler votre abonnement Lastmodel à tout moment depuis votre espace personnel. Connectez-vous, allez dans 'Mon Compte' puis 'Abonnement', et cliquez sur 'Annuler l'abonnement'. L'annulation prend effet immédiatement mais vous conservez tous les avantages jusqu'à la fin de votre période déjà payée. Aucun frais d'annulation n'est appliqué. Si vous rencontrez un problème, contactez notre support qui vous aidera sous 24h.",
  },
  {
    question: 'Les profils sur Lastmodel sont-ils vérifiés ?',
    answer:
      "Oui ! Tous les profils sur Lastmodel sont vérifiés manuellement par notre équipe de modération avant d'être publiés sur le site. Nous vérifions l'authenticité des photos (pas de photos de célébrités ou volées), la cohérence des informations fournies, et l'absence de contenu inapproprié. Les faux profils, bots et comptes suspects sont systématiquement supprimés. Cette vérification manuelle garantit la qualité et l'authenticité des rencontres sur Lastmodel, contrairement aux sites qui utilisent uniquement une vérification automatique.",
  },
  {
    question: 'Combien de membres actifs y a-t-il sur Lastmodel ?',
    answer:
      'Lastmodel compte actuellement plus de 1000 membres actifs en France, principalement concentrés dans les grandes villes comme Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes et Lille. Nous générons en moyenne 200 connexions authentiques par mois (personnes qui se likent mutuellement et entament une conversation). Notre communauté grandit de 15% chaque mois. Nous privilégions la qualité à la quantité : des profils vérifiés et des personnes réellement engagées dans leur recherche de relation sérieuse.',
  },
  {
    question: 'Quelle est la différence entre Lastmodel et Tinder ?',
    answer:
      "Lastmodel se concentre sur les rencontres sérieuses avec des profils vérifiés manuellement, tandis que Tinder privilégie le volume avec un système de swipe rapide. Lastmodel est idéal pour ceux qui cherchent une relation durable et authentique, Tinder convient mieux aux rencontres casual. En termes de prix, Lastmodel coûte 20€/mois contre environ 25€/mois pour Tinder Plus. Lastmodel affiche également plus d'informations sur les profils (bio détaillée, centres d'intérêt, intentions claires) alors que Tinder se base principalement sur les photos.",
  },
  {
    question: 'Mes données personnelles sont-elles sécurisées sur Lastmodel ?',
    answer:
      'Absolument. Lastmodel prend la sécurité de vos données très au sérieux. Nous utilisons le chiffrement SSL/TLS pour toutes les communications, hébergeons nos données en Europe dans des datacenters conformes RGPD, et ne partageons jamais vos données avec des tiers à des fins commerciales. Vos informations de paiement sont traitées par Stripe, un leader mondial de la sécurité des paiements. Vous pouvez consulter, modifier ou supprimer vos données à tout moment depuis votre compte. La suppression est définitive et complète.',
  },
  {
    question: 'Comment contacter le support Lastmodel ?',
    answer:
      "Vous pouvez contacter notre équipe support de plusieurs façons : via le formulaire de contact sur la page /contact, par email à support@lastmodel.fr, ou directement depuis votre espace membre (section 'Aide'). Nous répondons à tous les messages sous 24h maximum, souvent bien plus rapidement. Pour les questions urgentes (problème de sécurité, harcèlement), nous proposons une assistance prioritaire qui répond sous 2h.",
  },
  {
    question: 'Puis-je utiliser Lastmodel sur mobile ?',
    answer:
      "Oui, Lastmodel est entièrement responsive et optimisé pour tous les appareils mobiles (smartphones et tablettes). Vous pouvez l'utiliser sur n'importe quel navigateur mobile (Safari sur iOS, Chrome sur Android, etc.). L'expérience mobile est fluide et intuitive, avec toutes les fonctionnalités de la version desktop. Une application mobile native (iOS et Android) est prévue pour le deuxième trimestre 2025, avec des notifications push et une meilleure performance.",
  },
  {
    question: 'Quel plan Lastmodel dois-je choisir ?',
    answer:
      "Le choix dépend de votre niveau d'engagement. Le plan gratuit est parfait pour découvrir Lastmodel, parcourir les profils et voir si la communauté vous correspond. Si vous êtes sérieux dans votre recherche et voulez être visible et contacter d'autres membres, le plan mensuel à 20€/mois est recommandé. Pour le meilleur rapport qualité/prix, le plan annuel à 180€/an (15€/mois) offre 2 mois gratuits et un badge premium qui augmente votre visibilité de 40%. La plupart de nos membres qui trouvent une relation utilisent le plan annuel.",
  },
  {
    question: 'Comment fonctionne la de recommandation de Lastmodel ?',
    answer:
      "L'algorithme de Lastmodel analyse plusieurs critères pour vous recommander des profils compatibles : vos préférences déclarées (âge, localisation, centres d'intérêt), votre comportement sur le site (profils que vous likez, conversations que vous entamez), et la compatibilité basée sur les valeurs et objectifs communs. Contrairement aux algorithmes qui se basent uniquement sur l'apparence physique, Lastmodel privilégie la compatibilité à long terme. Plus vous utilisez le site et affinez vos préférences, plus les recommandations deviennent pertinentes.",
  },
  {
    question: 'Que faire si je rencontre un profil suspect ou inapproprié ?',
    answer:
      "Si vous rencontrez un profil suspect, des contenus inappropriés ou du harcèlement, signalez-le immédiatement en cliquant sur les trois points sur le profil puis 'Signaler'. Notre équipe examine tous les signalements sous 2h maximum. Vous pouvez également bloquer directement tout membre qui vous dérange, ce qui empêche toute interaction future. Lastmodel a une tolérance zéro pour les faux profils, le harcèlement et les comportements inappropriés. Les comptes problématiques sont bannis définitivement.",
  },
  {
    question: 'Comment améliorer la visibilité de mon profil ?',
    answer:
      'Pour maximiser votre visibilité sur Lastmodel : (1) Complétez votre profil à 100% avec au moins 3 photos de qualité et une bio détaillée ; (2) Soyez actif régulièrement (connectez-vous au moins 2-3 fois par semaine) ; (3) Likez et envoyez des messages personnalisés ; (4) Souscrivez à un plan payant qui augmente votre visibilité ; (5) Obtenez le badge premium (plan annuel) qui vous place en priorité dans les recommandations. Les profils complets et actifs reçoivent 5x plus de visites que les profils incomplets.',
  },
  {
    question: "Combien de temps faut-il pour trouver quelqu'un sur Lastmodel ?",
    answer:
      "La durée varie selon votre profil, vos critères et votre engagement. En moyenne, nos membres actifs (qui se connectent 3+ fois par semaine) obtiennent leur première conversation dans les 2 semaines. Pour une rencontre réelle, comptez généralement 1 à 3 mois. Les membres qui trouvent une relation sérieuse le font en moyenne après 2-4 mois d'utilisation active. L'important est d'être patient, authentique et proactif : plus vous envoyez de messages personnalisés de qualité, plus vos chances augmentent.",
  },
  {
    question: 'Lastmodel est-il adapté pour les plus de 40 ans ?',
    answer:
      "Absolument ! Lastmodel accueille les célibataires de tous âges (18 ans et plus). Notre communauté comprend une proportion importante de membres entre 35 et 55 ans qui cherchent des relations sérieuses. Vous pouvez filtrer vos recherches par tranche d'âge pour trouver des personnes dans votre groupe démographique. Contrairement aux applications axées sur les jeunes adultes, Lastmodel met l'accent sur la compatibilité et les valeurs, ce qui attire naturellement un public plus mature et engagé.",
  },
  {
    question: 'Puis-je chercher des profils dans une autre ville ?',
    answer:
      "Oui, Lastmodel vous permet de modifier votre localisation de recherche à tout moment. Par défaut, nous affichons les profils dans un rayon de 50 km autour de votre position, mais vous pouvez étendre ce rayon jusqu'à 200 km ou choisir une ville spécifique (pratique si vous prévoyez de déménager ou voyagez souvent). Cette fonctionnalité est disponible pour tous les membres, même avec le plan gratuit. Vous pouvez aussi sauvegarder plusieurs localisations favorites.",
  },
  {
    question: 'Comment Lastmodel protège-t-il contre les arnaques sentimentales ?',
    answer:
      "Lastmodel met en place plusieurs mesures anti-arnaque : (1) Vérification manuelle de tous les profils avant publication ; (2) Système de signalement facile et réactif ; (3) Détection automatique de comportements suspects (demandes d'argent, liens externes, etc.) ; (4) Conseils de sécurité affichés régulièrement ; (5) Interdiction de partager des coordonnées bancaires ou des informations financières. Nous vous recommandons : ne jamais envoyer d'argent à quelqu'un que vous n'avez pas rencontré, rester sur la messagerie Lastmodel au début, et signaler immédiatement toute demande suspecte.",
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Questions fréquentes sur Lastmodel
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez des réponses à toutes vos questions sur Lastmodel, le site de
            rencontre sérieux avec profils vérifiés. Création de compte, tarifs,
            sécurité, fonctionnalités.
          </p>
          <nav className="mt-6" aria-label="Navigation rapide">
            <h2 className="sr-only">Navigation rapide</h2>
            <ul className="flex flex-wrap justify-center gap-4 text-sm">
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
                  href="#faq-list"
                  className="rounded text-purple-600 underline hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                >
                  Questions détaillées
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="rounded text-purple-600 underline hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* TL;DR Section */}
        <section
          id="tldr"
          className="mb-12 rounded-lg border-l-4 border-purple-600 bg-white p-6 shadow-md"
          aria-labelledby="tldr-heading"
        >
          <h2
            id="tldr-heading"
            className="mb-3 text-xl font-semibold text-gray-900"
          >
            En bref :
          </h2>
          <ul className="space-y-2 text-gray-700" role="list">
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Gratuit pour découvrir</strong>, 20€/mois pour contacter
                (180€/an avec 2 mois offerts)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Profils vérifiés manuellement</strong> pour garantir
                l'authenticité
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Annulation à tout moment</strong>, remboursement sous 14
                jours
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Données sécurisées</strong> (RGPD, SSL, hébergement EU)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Support réactif</strong> : réponse sous 24h maximum
              </span>
            </li>
          </ul>
        </section>

        {/* FAQ List */}
        <section
          id="faq-list"
          className="space-y-4"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="sr-only">
            Questions fréquentes détaillées
          </h2>
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between rounded p-6 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none">
                <h3 className="flex-1 pr-4 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <svg
                  className="h-5 w-5 flex-shrink-0 text-purple-600 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-gray-100 px-6 pt-4 pb-6">
                <p className="leading-relaxed text-gray-700">{faq.answer}</p>
              </div>
            </details>
          ))}
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          className="mt-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white shadow-lg"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="mb-3 text-2xl font-bold">
            Une autre question ? Besoin d'aide ?
          </h2>
          <p className="mb-6 text-purple-100">
            Notre équipe est là pour vous aider et répond en moins de 24h
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
            >
              Nous contacter
            </Link>
            <Link
              href="/pricing"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-purple-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-none"
            >
              Voir les tarifs
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-labelledby="quick-links-heading"
        >
          <h2 id="quick-links-heading" className="sr-only">
            Liens utiles
          </h2>
          <Link
            href="/chat/guide-profil"
            className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              <span aria-hidden="true">📝</span> Guide du profil parfait
            </h3>
            <p className="text-sm text-gray-600">
              Conseils pour créer un profil attractif et authentique
            </p>
          </Link>
          <Link
            href="/chat/securite"
            className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              <span aria-hidden="true">🔒</span> Sécurité et confidentialité
            </h3>
            <p className="text-sm text-gray-600">
              Comment Lastmodel protège vos données et votre vie privée
            </p>
          </Link>
          <Link
            href="/chat/conseils-rencontre"
            className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              <span aria-hidden="true">💡</span> Conseils rencontre
            </h3>
            <p className="text-sm text-gray-600">
              10 conseils pour réussir vos rencontres en ligne
            </p>
          </Link>
        </section>
      </div>
    </div>
  );
}
