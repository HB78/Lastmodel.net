import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - Lastmodel",
  description:
    "Conditions générales d'utilisation du site Lastmodel. Consultez les termes et conditions qui régissent l'utilisation de notre plateforme de rencontres.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConditionsUtilisationPage() {
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-purple max-w-none space-y-8 text-gray-700">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              1. Parties à cet accord et contrepartie
            </h2>
            <p className="mb-4">
              Les parties au présent Contrat (le « Contrat ») sont Vous
              (l'« Utilisateur ») et Lastmodel (la « Société »). Tels
              qu'utilisés dans le présent Contrat, les termes « nous » et
              « notre » sont utilisés de manière interchangeable pour désigner
              la Société et les sites Web ; les termes « Vous » et « Votre »
              sont utilisés pour désigner Vous, l'Utilisateur.
            </p>
            <p className="mb-4">
              <strong>1.1</strong> En accédant aux documents sur les sites Web
              et contre toute autre contrepartie valable et valable, dont vous
              et la Société reconnaissez le caractère suffisant, vous acceptez
              par la présente d'être lié par tous les termes et conditions
              énoncés dans le présent Accord.
            </p>
            <p className="mb-4">
              <strong>1.2</strong> Sous réserve de votre acceptation des termes
              et conditions énoncés dans le présent accord, la société accepte
              de vous accorder un droit personnel limité, non transférable,
              d'accéder au contenu de Lastmodel et des sites affiliés exploités
              par la société.
            </p>
            <p className="mb-4">
              <strong>1.3</strong> Le présent Accord est sujet à modification
              par la Société à tout moment et les modifications entreront en
              vigueur dès notification aux UTILISATEURS par publication sur ou
              via un hyperlien vers les sites Web.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              2. Vérification de l'utilisateur
            </h2>
            <p className="mb-4 font-semibold uppercase text-purple-700">
              Tous les matériaux contenus sur les sites web sont destinés à
              être distribués exclusivement à des adultes consentants. Aucune
              personne de moins de dix-huit (18) ans ne peut accéder ou
              posséder le contenu des sites web.
            </p>
            <p className="mb-4">
              <strong>2.1</strong> Vous reconnaissez et déclarez que vous avez
              plus de 18 ans et que vous comprenez que les matériaux présentés
              sur le site peuvent inclure des représentations explicites de
              nudité et d'activités sexuelles.
            </p>
            <p className="mb-4">
              <strong>2.2</strong> Vous déclarez et garantissez que vous avez
              actuellement plus de dix-huit ans et êtes capable de conclure
              légalement cet accord.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              3. Code de conduite de l'utilisateur
            </h2>
            <p className="mb-4">
              <strong>3.1</strong> Lastmodel a une politique de tolérance zéro
              à l'égard de la traite des êtres humains, de la prostitution et
              de tout autre comportement illégal. Nous coopérons avec les
              forces de l'ordre pour enquêter sur des activités criminelles.
            </p>
            <p className="mb-4">
              <strong>3.2</strong> Vous n'utiliserez pas les sites Web pour
              vous livrer à toute forme de conduite illégale, de harcèlement ou
              de comportement offensant.
            </p>
            <p className="mb-4">
              <strong>3.3</strong> Vous n'utiliserez pas les sites Web pour
              porter atteinte aux droits à la vie privée, aux droits de
              propriété ou à d'autres droits civils de toute personne.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              4. Octroi d'une licence limitée
            </h2>
            <p className="mb-4">
              Vous reconnaissez et acceptez que tous les éléments contenus sur
              les sites Web constituent de précieux droits d'auteur, marques de
              commerce et autres propriétés intellectuelles appartenant à la
              Société. Vous ne pouvez accéder, visualiser et utiliser le
              matériel disponible qu'avec l'autorisation de la Société.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              5. Droits de propriété
            </h2>
            <p className="mb-4">
              Tous les droits de propriété intellectuelle relatifs aux
              matériaux et autres éléments des sites Web resteront la propriété
              de Lastmodel. Tous les droits sont réservés.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              6. Limitations de responsabilité
            </h2>
            <p className="mb-4">
              <strong>6.1</strong> Lastmodel ne sera en aucun cas tenue
              responsable du résultat de tout contact ou réunion résultant
              d'utilisation du site.
            </p>
            <p className="mb-4">
              <strong>6.2</strong> Les services sont fournis « TELS QUELS »,
              sans garantie d'aucune sorte.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              7. Protection des données
            </h2>
            <p className="mb-4">
              Nous nous réservons le droit de vous envoyer des communications
              par email concernant nos services. Nous ne collectons, ne vendons
              ni ne divulguons vos informations personnelles.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              8. Remboursement et annulation
            </h2>
            <p className="mb-4">
              Le Client peut demander un remboursement complet dans les 48
              heures suivant l'achat. Passé ce délai, aucun remboursement ne
              sera effectué.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              9. Droit applicable
            </h2>
            <p className="mb-4">
              Le présent accord sera régi et interprété conformément aux lois
              françaises. En cas de différend, les parties se rencontreront et
              négocieront de bonne foi pour tenter de résoudre le différend.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              10. Contact
            </h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions d'utilisation,
              veuillez nous contacter à :{' '}
              <a
                href="mailto:support@lastmodel.com"
                className="text-purple-600 hover:text-purple-700"
              >
                support@lastmodel.com
              </a>
            </p>
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
                  href="/legal/politique-confidentialite"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Politique de confidentialité
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
