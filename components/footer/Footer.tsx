import {
  BookOpen,
  Heart,
  HelpCircle,
  Mail,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';

export function Footer() {
  return (
    <footer
      className="bg-nuit-profonde text-white/70"
      role="contentinfo"
      aria-label="Pied de page du site"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="Navigation du pied de page">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* À propos */}
            <section aria-labelledby="footer-about">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <Image
                  src="/logolast.png"
                  alt="Logo Lastmodel"
                  width={32}
                  height={32}
                  className="transition-transform duration-200 hover:scale-110"
                />
                <h3
                  id="footer-about"
                  className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white"
                >
                  Lastmodel
                </h3>
              </Link>
              <p className="mb-4 text-sm leading-relaxed text-white/70">
                Le site de rencontre moderne avec des profils vérifiés pour des
                rencontres authentiques.
              </p>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-white/80"
                role="note"
                aria-label="Avantage principal"
              >
                <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Rencontres authentiques</span>
              </div>
            </section>

            {/* Liens utiles */}
            <section aria-labelledby="footer-links">
              <h3
                id="footer-links"
                className="mb-4 text-sm font-semibold tracking-wider text-white uppercase"
              >
                Liens utiles
              </h3>
              <ul className="space-y-3 text-sm" role="list">
                <li>
                  <Link
                    href="/pricing"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Consulter les plans et tarifs"
                  >
                    <Sparkles
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Plans et tarifs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Nous contacter"
                  >
                    <Mail
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Contact</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/faq"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Consulter la foire aux questions"
                  >
                    <HelpCircle
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">FAQ</span>
                  </Link>
                </li>
              </ul>
            </section>

            {/* Guides et conseils */}
            <section aria-labelledby="footer-guides">
              <h3
                id="footer-guides"
                className="mb-4 text-sm font-semibold tracking-wider text-white uppercase"
              >
                Guides et conseils
              </h3>
              <ul className="space-y-3 text-sm" role="list">
                <li>
                  <Link
                    href="/chat/guide-profil"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Lire le guide du profil parfait"
                  >
                    <BookOpen
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Guide du profil parfait</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/conseils-rencontre"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Lire les conseils pour réussir vos rencontres"
                  >
                    <Heart
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">Conseils rencontre</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/securite"
                    className="group inline-flex items-center gap-2 rounded text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="En savoir plus sur la sécurité et la confidentialité"
                  >
                    <Shield
                      className="h-4 w-4 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="font-medium">
                      Sécurité et confidentialité
                    </span>
                  </Link>
                </li>
              </ul>
            </section>

            {/* Informations légales */}
            <section aria-labelledby="footer-legal">
              <h3
                id="footer-legal"
                className="mb-4 text-sm font-semibold tracking-wider text-white uppercase"
              >
                Informations légales
              </h3>
              <ul className="space-y-3 text-sm" role="list">
                <li>
                  <Link
                    href="/legal/mentions-legales"
                    className="inline-block rounded font-medium text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Consulter les mentions légales"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/politique-confidentialite"
                    className="inline-block rounded font-medium text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Consulter la politique de confidentialité"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/conditions-utilisation"
                    className="inline-block rounded font-medium text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                    aria-label="Consulter les conditions générales d'utilisation"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
              </ul>
            </section>
          </div>
          <p>
            Lastmodel.net est un site d'informations, de rencontre et de
            publicités. Nous sommes simplement et uniquement un site commercial,
            nous ne sommes pas une agence d'escortes ou offrant des services de
            prostitution.
          </p>
        </nav>

        {/* Séparateur */}
        <div
          className="my-10 border-t border-white/10"
          role="separator"
          aria-hidden="true"
        />

        {/* Copyright */}
        <div
          className="flex flex-col items-center justify-between gap-6 text-center text-sm sm:flex-row sm:text-left"
          role="contentinfo"
          aria-label="Informations de copyright et liens rapides"
        >
          <p className="text-white/70">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-white">Lastmodel</span>. Tous
            droits réservés.
          </p>
          <nav aria-label="Liens d'assistance rapide">
            <ul className="flex items-center gap-6" role="list">
              <li>
                <Link
                  href="/chat/faq"
                  className="rounded font-medium text-white/70 transition-colors duration-200 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                  aria-label="Obtenir de l'aide via la FAQ"
                >
                  Aide
                </Link>
              </li>
              <li className="text-white/40" aria-hidden="true">•</li>
              <li>
                <Link
                  href="/contact"
                  className="rounded font-medium text-white/70 transition-colors duration-200 hover:text-white focus:text-white focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-nuit-profonde focus:outline-none"
                  aria-label="Contacter le support technique"
                >
                  Support
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
