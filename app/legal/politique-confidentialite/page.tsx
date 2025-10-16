import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Lastmodel',
  description:
    'Découvrez comment Lastmodel protège vos données personnelles et respecte votre vie privée. Notre engagement pour la sécurité et la confidentialité de vos informations.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm text-purple-600 transition-colors hover:text-purple-700"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </header>

        {/* Introduction */}
        <section className="mb-8 rounded-lg border-l-4 border-purple-600 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 flex-shrink-0 text-purple-600" aria-hidden="true" />
            <div>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Notre engagement de confidentialité
              </h2>
              <p className="leading-relaxed text-gray-700">
                Votre vie privée est importante pour nous. Pour mieux protéger
                votre vie privée, nous fournissons cette notification expliquant
                nos pratiques d'information en ligne et les choix que vous pouvez
                faire sur la façon dont vos informations sont collectées et
                utilisées. Cette politique est disponible sur notre site et à
                chaque point où des informations personnellement identifiables
                peuvent être demandées.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="space-y-6">
          {/* Les informations que nous collectons */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Database className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Les informations que nous collectons
              </h2>
            </div>
            <p className="mb-4 text-gray-700">
              Le présent avis vise toutes les informations collectées ou soumises
              sur ce site. Sur certaines pages, vous pouvez créer un compte,
              gérer vos préférences et vous inscrire pour recevoir des
              notifications.
            </p>
            <div className="rounded-lg bg-purple-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Types de renseignements personnels collectés :
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Nom et prénom</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Nom d'utilisateur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Adresse e-mail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Date de naissance (pour vérification de l'âge)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Informations de profil (photos, bio, préférences)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Comment nous utilisons vos informations */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Comment nous utilisons vos informations
              </h2>
            </div>
            <p className="mb-4 text-gray-700">
              Nous utilisons les informations collectées dans les buts suivants :
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 flex-shrink-0 text-purple-600" aria-hidden="true" />
                <div>
                  <strong>Protection et accès au système :</strong> Nom
                  d'utilisateur et mot de passe pour sécuriser votre compte
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-purple-600" aria-hidden="true" />
                <div>
                  <strong>Vérification de l'utilisateur :</strong> Adresse e-mail
                  pour authentifier votre compte et vous envoyer des notifications
                  importantes
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 flex-shrink-0 text-purple-600" aria-hidden="true" />
                <div>
                  <strong>Amélioration du service :</strong> Analyse des
                  comportements d'utilisation pour améliorer votre expérience
                </div>
              </li>
            </ul>
          </section>

          {/* Sécurité des données */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Notre engagement pour la sécurité des données
              </h2>
            </div>
            <p className="mb-4 text-gray-700">
              Pour éviter tout accès non autorisé, maintenir l'exactitude des
              données et assurer l'utilisation correcte de l'information, nous
              avons mis en place des procédures physiques, électroniques et de
              gestion appropriées pour protéger et sécuriser les informations que
              nous recueillons en ligne.
            </p>
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Mesures de sécurité mises en place :
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Chiffrement SSL/TLS pour toutes les communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Stockage sécurisé en base de données SQL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Hashage des mots de passe (jamais stockés en clair)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Conformité RGPD (hébergement en Europe)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Accès restreint aux données personnelles</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Accès et correction de vos données */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Comment accéder ou corriger vos informations
            </h2>
            <p className="mb-4 text-gray-700">
              Vous pouvez accéder à toutes vos informations personnellement
              identifiables que nous recueillons et maintenons dans notre base de
              données. Nous utilisons cette procédure pour mieux protéger vos
              informations.
            </p>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Vos droits RGPD :
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">→</span>
                  <span>
                    <strong>Droit d'accès :</strong> Consulter vos données à tout
                    moment depuis votre compte
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">→</span>
                  <span>
                    <strong>Droit de rectification :</strong> Modifier vos
                    informations personnelles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">→</span>
                  <span>
                    <strong>Droit à l'effacement :</strong> Supprimer
                    définitivement votre compte et vos données
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">→</span>
                  <span>
                    <strong>Droit à la portabilité :</strong> Récupérer vos
                    données dans un format structuré
                  </span>
                </li>
              </ul>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Pour protéger votre vie privée et votre sécurité, nous prendrons
              également des mesures raisonnables pour vérifier votre identité
              avant d'accorder l'accès ou de faire des corrections.
            </p>
          </section>

          {/* Partage des données */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Partage de vos données
            </h2>
            <p className="mb-4 text-gray-700">
              <strong className="text-purple-700">
                Nous ne vendons, n'échangeons ni ne louons jamais vos informations
                personnelles à des tiers.
              </strong>
            </p>
            <p className="text-gray-700">
              Vos données peuvent être partagées uniquement dans les cas suivants
              :
            </p>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Avec votre consentement explicite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>
                  Pour se conformer à une obligation légale (assignation,
                  enquête judiciaire)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>
                  Avec nos prestataires de services (hébergement, paiement) sous
                  strict accord de confidentialité
                </span>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Cookies et technologies similaires
            </h2>
            <p className="mb-4 text-gray-700">
              Notre site utilise des cookies pour améliorer votre expérience de
              navigation. Ces cookies ne sont jamais utilisés à des fins
              publicitaires tierces.
            </p>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Types de cookies utilisés :
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>
                    <strong>Cookies essentiels :</strong> Nécessaires au
                    fonctionnement du site (connexion, sécurité)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>
                    <strong>Cookies de préférences :</strong> Mémorisent vos choix
                    (langue, paramètres)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>
                    <strong>Cookies analytiques :</strong> Nous aident à
                    comprendre comment vous utilisez le site
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-lg">
            <h2 className="mb-3 text-2xl font-semibold">
              Questions sur la confidentialité ?
            </h2>
            <p className="mb-4 text-purple-100">
              Si vous avez des questions concernant cette politique de
              confidentialité ou le traitement de vos données personnelles,
              n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="mailto:privacy@lastmodel.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-semibold text-purple-600 transition-all hover:bg-purple-50"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                privacy@lastmodel.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-2 font-semibold text-white transition-all hover:bg-white hover:text-purple-600"
              >
                Formulaire de contact
              </Link>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <nav aria-label="Documents légaux associés">
            <ul className="flex flex-wrap gap-4 text-sm">
              <li>
                <Link
                  href="/legal/mentions-legales"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Mentions légales
                </Link>
              </li>
              <li className="text-gray-300">•</li>
              <li>
                <Link
                  href="/legal/conditions-utilisation"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li className="text-gray-300">•</li>
              <li>
                <Link
                  href="/chat/securite"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Guide de sécurité
                </Link>
              </li>
              <li className="text-gray-300">•</li>
              <li>
                <Link
                  href="/contact"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </footer>
      </article>
    </div>
  );
}
