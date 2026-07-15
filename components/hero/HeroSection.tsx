import Link from 'next/link';

export function HeroSection() {
  return (
    <section
      className="relative h-screen w-full overflow-hidden"
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
          est activé (on affiche alors l'image figée ci-dessus à la place). */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src="/video/lastmodel.mp4"
        poster="/image/lastmodel.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Overlay violet */}
      <div className="absolute inset-0 bg-purple-950/50" aria-hidden="true" />

      {/* Contenu centré */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <p className="mb-4 font-[family-name:var(--font-playfair)] text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          Lastmodel
        </p>

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
          Rejoindre
        </Link>
      </div>
    </section>
  );
}
