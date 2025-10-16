import { Building2, Mail, Server, User } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales - Lastmodel',
  description:
    "Mentions légales du site Lastmodel. Informations sur l'éditeur, l'hébergeur et les responsabilités légales.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MentionsLegalesPage() {
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
            Mentions Légales
          </h1>
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
            pour la confiance dans l'économie numérique, il est porté à la
            connaissance des utilisateurs du site Lastmodel les présentes
            mentions légales.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-6">
          {/* Éditeur du site */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Building2
                className="h-6 w-6 text-purple-600"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Éditeur du site
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <User
                  className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Identité</p>
                  <p>Kenshin Himura</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2
                  className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p>
                    Calle de Alcalá, 123
                    <br />
                    28009 Madrid
                    <br />
                    Espagne
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href="mailto:seijurohiko@outlook.fr"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    seijurohiko@outlook.fr
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">
                2. Directeur de publication
              </h2>
            </div>
            <p className="text-gray-700">
              <strong>Kenshin Himura</strong>
              <br />
              Email :{' '}
              <a
                href="mailto:seijurohiko@outlook.fr"
                className="text-purple-600 hover:text-purple-700"
              >
                seijurohiko@outlook.fr
              </a>
            </p>
          </section>

          {/* Hébergeur */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Server className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">
                3. Hébergement
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Le site est hébergé par :</p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-semibold">Vercel Inc.</p>
                <p className="mt-2">
                  Siège social :
                  <br />
                  340 S Lemon Ave #4133
                  <br />
                  Walnut, CA 91789
                  <br />
                  États-Unis
                </p>
                <p className="mt-2">
                  <strong>Région d'hébergement :</strong> Europe (Frankfurt, Allemagne)
                </p>
                <p className="mt-2">
                  Site web :{' '}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    vercel.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              4. Propriété intellectuelle
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                L'ensemble de ce site relève de la législation française et
                internationale sur le droit d'auteur et la propriété
                intellectuelle. Tous les droits de reproduction sont réservés, y
                compris pour les documents téléchargeables et les
                représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support
                électronique ou autre quel qu'il soit est formellement interdite
                sauf autorisation expresse du directeur de publication.
              </p>
              <p>
                Les marques et logos figurant sur le site sont des marques
                déposées. Toute reproduction totale ou partielle de ces marques
                ou logos sans autorisation préalable et écrite de Lastmodel est
                donc prohibée.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              5. Responsabilité
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les informations contenues sur ce site sont aussi précises que
                possible et le site est périodiquement remis à jour, mais peut
                toutefois contenir des inexactitudes, des omissions ou des
                lacunes.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui paraît être un
                dysfonctionnement, merci de bien vouloir le signaler par email à{' '}
                <a
                  href="mailto:seijurohiko@outlook.fr"
                  className="text-purple-600 hover:text-purple-700"
                >
                  seijurohiko@outlook.fr
                </a>
                , en décrivant le problème de la manière la plus précise
                possible.
              </p>
              <p>
                Lastmodel ne pourra être tenu responsable des dommages directs
                et indirects causés au matériel de l'utilisateur, lors de
                l'accès au site, et résultant soit de l'utilisation d'un
                matériel ne répondant pas aux spécifications techniques
                requises, soit de l'apparition d'un bug ou d'une
                incompatibilité.
              </p>
              <p>
                Lastmodel ne pourra également être tenu responsable des dommages
                indirects consécutifs à l'utilisation du site.
              </p>
            </div>
          </section>

          {/* Liens hypertextes */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              6. Liens hypertextes
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Le site peut contenir des liens hypertextes vers d'autres sites
                présents sur le réseau Internet. Les liens vers ces autres
                ressources vous font quitter le site Lastmodel.
              </p>
              <p>
                Il est possible de créer un lien vers la page de présentation de
                ce site sans autorisation expresse de l'éditeur. Aucune
                autorisation ou demande d'information préalable ne peut être
                exigée par l'éditeur à l'égard d'un site qui souhaite établir un
                lien vers le site de l'éditeur.
              </p>
              <p>
                Il convient toutefois d'afficher ce site dans une nouvelle
                fenêtre du navigateur. Cependant, l'éditeur se réserve le droit
                de demander la suppression d'un lien qu'il estime non conforme à
                l'objet du site.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              7. Protection des données personnelles
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Conformément au Règlement Général sur la Protection des Données
                (RGPD) et à la loi Informatique et Libertés, vous disposez d'un
                droit d'accès, de rectification, de suppression et d'opposition
                aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits ou pour toute question sur le traitement
                de vos données, vous pouvez nous contacter à l'adresse suivante
                :{' '}
                <a
                  href="mailto:seijurohiko@outlook.fr"
                  className="text-purple-600 hover:text-purple-700"
                >
                  seijurohiko@outlook.fr
                </a>
              </p>
              <p>
                Pour plus d'informations sur la manière dont nous traitons vos
                données personnelles, veuillez consulter notre{' '}
                <Link
                  href="/legal/politique-confidentialite"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              8. Cookies
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Le site Lastmodel peut être amené à vous demander l'acceptation
                des cookies pour des besoins de statistiques et d'affichage. Un
                cookie est une information déposée sur votre disque dur par le
                serveur du site que vous visitez.
              </p>
              <p>
                Il contient plusieurs données qui sont stockées sur votre
                ordinateur dans un simple fichier texte auquel un serveur accède
                pour lire et enregistrer des informations. Certaines parties de
                ce site ne peuvent être fonctionnelles sans l'acceptation de
                cookies.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              9. Droit applicable et juridiction compétente
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Tout litige en relation avec l'utilisation du site Lastmodel est
                soumis au droit français. Il est fait attribution exclusive de
                juridiction aux tribunaux compétents de Paris.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-lg">
            <h2 className="mb-3 text-2xl font-semibold">
              Questions ou réclamations ?
            </h2>
            <p className="mb-4 text-purple-100">
              Pour toute question relative aux mentions légales ou pour toute
              réclamation, vous pouvez nous contacter :
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="mailto:seijurohiko@outlook.fr"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-semibold text-purple-600 transition-all hover:bg-purple-50"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                seijurohiko@outlook.fr
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
                  href="/legal/politique-confidentialite"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Politique de confidentialité
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
