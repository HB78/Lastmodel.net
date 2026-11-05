import Link from 'next/link';
import { HeroVideo } from './HeroVideo';

export function HeroSection() {
  return (
    // 📱 HAUTEUR : min-h-svh plutôt que h-screen
    // - h-screen = 100vh : sur mobile, 100vh inclut la zone SOUS la barre
    //   d'adresse → le bas de la hero (bouton, bouton pause) était caché.
    //   svh = "small viewport height" = la hauteur vraiment visible.
    //   (supports-[…] : repli sur h-screen pour les vieux navigateurs)
    // - min-h (et pas h) : en paysage sur téléphone (~360px de haut), le titre
    //   + le texte + le bouton ne tiennent pas → la section s'agrandit au lieu
    //   de couper le contenu (overflow-hidden).
    <section
      className="relative flex min-h-screen w-full overflow-hidden supports-[height:100svh]:min-h-svh"
      aria-label="Présentation de Lastmodel"
    >
      {/* Image de secours : visible uniquement si l'utilisateur a activé
          "réduire les animations" (prefers-reduced-motion). Sinon masquée. */}
      <div
        className="absolute inset-0 hidden h-full w-full bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: "url('/image/lastmodel.jpg')" }}
        aria-hidden="true"
      />

      {/* Vidéo : jouée normalement, mais masquée si "réduire les animations"
          est activé (on affiche alors l'image figée ci-dessus à la place).
          Elle n'est téléchargée que si elle sera vraiment vue (voir HeroVideo). */}
      <HeroVideo
        src="/video/lastmodel-720.mp4"
        mobileSrc="/video/lastmodel-480.mp4"
        poster="/image/lastmodel.jpg"
      />

      {/* Overlay violet */}
      <div className="absolute inset-0 bg-purple-950/50" aria-hidden="true" />

      {/* Contenu centré */}
      {/* pt-24 : laisse la place à la navbar transparente (h-16) posée par-dessus
          pb-20 : laisse la place au bouton pause en bas à droite */}
      <div className="relative flex w-full flex-col items-center justify-center px-4 pt-24 pb-20 text-center text-white">
        {/* (sur-titre "LASTMODEL" retiré : le nom est déjà dans la navbar,
            et DESIGN.md interdit les sur-titres — le titre parle seul) */}
        <h1 className="mb-4 max-w-2xl text-balance font-[family-name:var(--font-playfair)] text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Le mystère commence ici
        </h1>

        <p className="mb-10 max-w-md font-[family-name:var(--font-dm-sans)] text-base font-light text-white/75 md:text-lg">
          Rencontres élégantes et authentiques, pour ceux qui osent.
        </p>

        <Link
          href="/signup"
          className="rounded-full bg-white px-10 py-4 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {/* Avant : "Rejoindre" (rejoindre quoi ?). Le lien mène à
              l'inscription → le bouton dit ce qui va se passer. */}
          Créer mon profil
        </Link>
      </div>
    </section>
  );
}
