'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 🎬 VIDÉO DE LA HERO, CHARGÉE SEULEMENT QUAND ÇA VAUT LE COUP
//
// La vidéo pèse lourd : avant, elle était téléchargée par TOUT le monde,
// même par ceux qui ne la voient jamais (motion-reduce:hidden la masque
// en CSS, mais le navigateur la télécharge quand même).
//
// Maintenant le serveur envoie une <video> SANS src : seul le poster
// (l'image figée) s'affiche. Une fois la page chargée, on ajoute la src
// uniquement si :
//   - l'user n'a PAS activé "réduire les animations"
//     (sinon il voit l'image de secours de HeroSection, pas la vidéo)
//   - l'user n'est PAS en mode "économie de données" ni en 2G
//     (navigator.connection n'existe que sur Chrome/Edge/Android :
//     ailleurs on considère la connexion comme bonne)
//
// 📱 Deux versions de la vidéo (compressées avec ffmpeg, sans piste audio) :
//   - src       : 720p (~3,7 Mo) → tablettes et ordinateurs
//   - mobileSrc : 480p (~1,7 Mo) → téléphones (écran < 768px)
// (l'original non compressé faisait 22,5 Mo)
//
// ⏸️ BOUTON PAUSE (accessibilité, WCAG 2.2.2)
// Une vidéo qui tourne en boucle plus de 5 secondes doit pouvoir être
// arrêtée : elle gêne la lecture de certaines personnes (troubles de
// l'attention, sensibilité au mouvement). Le bouton n'apparaît que si la
// vidéo a vraiment été chargée (pas de bouton inutile sur l'image figée).
export function HeroVideo({
  src,
  mobileSrc,
  poster,
}: {
  src: string;
  mobileSrc: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const isSlowConnection =
      connection?.saveData === true ||
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g';

    if (prefersReducedMotion || isSlowConnection) return;

    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
    video.src = isSmallScreen ? mobileSrc : src;
    setIsLoaded(true);
    // play() peut être refusé par le navigateur (autoplay bloqué) :
    // dans ce cas le poster reste affiché et le bouton propose "Lire"
    video.play().catch(() => {});
  }, [src, mobileSrc]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        // L'état du bouton suit la VRAIE lecture (et pas un simple clic) :
        // si le navigateur bloque l'autoplay, le bouton affiche bien "Lire"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {isLoaded && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={
            isPlaying
              ? 'Mettre la vidéo de fond en pause'
              : 'Lire la vidéo de fond'
          }
          // z-10 : au-dessus du contenu centré de la hero, qui couvre
          // toute la surface. 44px = taille minimale confortable au doigt.
          className="absolute right-4 bottom-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:bottom-6"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
