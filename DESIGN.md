---
name: Lastmodel
description: Le mystère commence ici — un bal masqué, la nuit, où l'on dévoile sans tout montrer.
colors:
  masque-de-nuit: "oklch(29.1% 0.149 302.717)"
  nuit-profonde: "oklch(18% 0.075 302.7)"
  voile-ivoire: "oklch(98.2% 0.004 302)"
  violet-bal: "oklch(55.8% 0.288 302.321)"
  violet-bal-profond: "oklch(49.6% 0.265 301.924)"
  blanc-ivoire: "oklch(1 0 0)"
  encre: "oklch(0 0 0)"
  encre-grise: "oklch(21% 0.034 264.665)"
  trait-gris: "oklch(92.8% 0.006 264.531)"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  brand:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
  lead:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 300
    lineHeight: 1.55
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
rounded:
  lg: "10px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.blanc-ivoire}"
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "16px 40px"
  button-night:
    backgroundColor: "{colors.masque-de-nuit}"
    textColor: "{colors.blanc-ivoire}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-night-hover:
    backgroundColor: "{colors.nuit-profonde}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.blanc-ivoire}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  video-control:
    backgroundColor: "oklch(0 0 0 / 0.3)"
    textColor: "{colors.blanc-ivoire}"
    rounded: "{rounded.full}"
    size: "44px"
  profile-card:
    backgroundColor: "{colors.blanc-ivoire}"
    textColor: "{colors.encre-grise}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: Lastmodel

<!-- La référence est l'univers de la HERO (components/hero/). Le reste du site
     (fonds pastel, dégradés violet→rose) est un héritage en cours de migration :
     il est décrit en fin de "Do's and Don'ts", il ne fait PAS règle. -->

## Overview

**Creative North Star: "Le Bal Masqué"**

Lastmodel se vit comme une soirée masquée : la lumière est basse, les visages se devinent, et chaque élément de l'interface se tient en retrait pour laisser les personnes et les images occuper la scène. L'élégance vient de la retenue (peu de couleurs, peu d'effets, beaucoup d'espace) et d'un seul geste typographique fort : la serif Playfair Display, en grand et en blanc, sur un voile violet profond.

L'interface est un écrin, pas un décor. Les photos et la vidéo portent l'émotion ; les boutons, cartes et champs sont raffinés et retenus (contours fins, ombres rares, accent violet utilisé avec parcimonie). Le mystère se construit par ce qui est montré à moitié : voiles, superpositions, contrastes doux, jamais par des effets tape-à-l'œil.

Rejet confirmé : l'univers pastel « romantique » (fonds dégradés violet/rose/indigo, texte et boutons en dégradé violet→rose) qui couvre encore une partie du site. Il est remplacé progressivement par cet univers.

**Key Characteristics:**
- Nuit et voile : violet très profond posé sur l'image, texte blanc par-dessus.
- Une serif de caractère (Playfair Display) pour les titres et la marque, une sans-serif neutre (Geist) pour tout le reste.
- Accent violet rare, jamais en dégradé.
- Boutons en pilule : blanc plein pour l'action principale, contour fin pour la secondaire.
- Plat par défaut : la profondeur vient des superpositions, pas des ombres.

## Colors

Une palette de nuit : un violet presque noir comme fond d'ambiance, du blanc pour la parole, et un violet lumineux réservé aux rares moments qui comptent.

### Primary
- **Violet de Bal** (violet-bal) : l'accent. Liens actifs, état de focus, un détail par écran au plus. Sur fond clair uniquement (sur le voile de nuit, son contraste est insuffisant : utiliser le blanc).
- **Violet de Bal Profond** (violet-bal-profond) : survol et état pressé de l'accent.

### Neutral
- **Masque de Nuit** (masque-de-nuit) : le voile posé sur la vidéo et les images de la hero, à 50 % d'opacité, et le fond plein du bandeau d'appel à l'action en bas de page. Classe Tailwind : `bg-nuit`.
- **Nuit Profonde** (nuit-profonde) : le fond du footer, la nuit qui ferme la page. Classe : `bg-nuit-profonde`.
- **Voile d'Ivoire** (voile-ivoire) : le fond clair de la page entre la hero et le bandeau, à peine teinté de violet pour que les cartes blanches s'en détachent. Classe : `bg-ivoire`.
- **Blanc Ivoire** (blanc-ivoire) : tout le texte sur fond de nuit, le fond du bouton principal, la surface des cartes. Les textes secondaires sur la nuit utilisent ce blanc à 75–80 % d'opacité, jamais un gris.
- **Encre** (encre) : texte du bouton principal blanc.
- **Encre Grise** (encre-grise) : texte courant et titres sur les surfaces claires (cartes, formulaires).
- **Trait Gris** (trait-gris) : bordures fines et séparateurs sur surfaces claires.

### Named Rules
**La Règle de la Nuit Encadrée.** Une page publique s'ouvre et se ferme sur la nuit (hero en haut ; bandeau d'action et footer en bas). Entre les deux, le contenu repose sur le Voile d'Ivoire. Jamais de nuit au milieu du contenu : elle encadre, elle ne coupe pas.

**La Règle du Violet Rare.** L'accent violet couvre moins de 10 % d'un écran et ne sert qu'aux **états** : focus, filtre actif, survol d'une carte. Jamais pour décorer (icônes, badges, fonds de survol de liste : ils restent en gris). Sa rareté fait son élégance ; s'il apparaît partout, il ne signale plus rien.

**La Règle Sans Dégradé.** Aucun dégradé de couleur sur le texte, les boutons ou les fonds. La seule superposition autorisée est le voile uni Masque de Nuit sur une image.

## Typography

**Display Font:** Playfair Display (avec Georgia, serif)
**Body Font:** Geist (avec system-ui, sans-serif)
**Lead Font:** DM Sans Light (avec system-ui), pour la phrase d'accroche sous un titre display

**Character:** Une serif à fort contraste, théâtrale et nocturne, répond à une sans-serif sobre qui ne cherche jamais à briller. Le contraste entre les deux est le seul geste typographique du système.

### Hierarchy
- **Display** (Playfair 700, 3rem → 4.5rem selon l'écran, interligne 1.25, approche -0.025em) : le titre de la hero, un seul par page, en blanc, `text-balance`.
- **Brand** (Playfair 700, 1.5rem) : le mot-symbole « Lastmodel » dans la navbar.
- **Lead** (DM Sans 300, 1rem → 1.125rem) : une phrase sous le titre display, en blanc à 75 %, largeur max ~28rem.
- **Body** (Geist 400, 1rem, interligne 1.5) : tout le texte courant.
- **Label** (Geist 600, 0.875rem) : boutons, badges, libellés de champs.

### Named Rules
**La Règle d'une Seule Voix.** Playfair est réservée au titre display et à la marque. Les titres de section, cartes et formulaires restent en Geist : si la serif est partout, le bal n'a plus de lustre.

## Layout

Contenu centré dans un conteneur de 80rem max (`max-w-7xl`) avec des marges latérales de 16 → 32px selon l'écran. La hero occupe au moins toute la hauteur visible (`min-h-svh`, pas `100vh`), contenu centré, avec de l'espace réservé en haut pour la navbar superposée (96px) et en bas pour le contrôle vidéo (80px).

La grille de profils passe de 1 colonne (téléphone, choix voulu : chaque photo en grand) à 2 colonnes dès 640px puis 3 dès 1024px, avec 24px d'écart. Les filtres suivent 1 → 2 → 4 colonnes. Points de rupture : 640px, 768px, 1024px.

Sur écran tactile, toute cible interactive fait au moins 44px de haut.

## Elevation & Depth

Plat par défaut. La profondeur vient des superpositions : un voile Masque de Nuit sur une image, un verre très léger (blanc à 5 % + flou de 4px) sous la navbar transparente. Les surfaces claires (cartes) reposent sur une bordure fine plutôt qu'une ombre ; une ombre douce n'apparaît qu'en réponse au survol.

### Shadow Vocabulary
- **Survol de carte** (`box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)`) : uniquement au survol d'une carte de profil, jamais au repos.

### Named Rules
**La Règle du Voile.** Pour séparer un plan d'un autre, superposer (voile, verre) plutôt qu'ombrer. Une ombre est une réponse à un geste, pas un état permanent.

## Shapes

Deux formes seulement : des coins doucement arrondis (10px) pour tout ce qui contient (cartes, champs, panneaux), et la pilule complète pour tout ce qui agit (boutons d'action, contrôle vidéo, badges). Bordures de 1px ; 2px uniquement pour la carte de profil, qui doit se détacher des photos voisines.

## Components

### Buttons
Raffinés et retenus : une pilule, un mot d'action, aucun effet superflu.
- **Shape:** pilule complète (9999px).
- **Primary:** fond Blanc Ivoire, texte Encre, Label 600, 16px × 40px (hero) ou 12px × 32px (bandeaux). Sur fond de nuit uniquement.
- **Hover / Focus:** l'opacité descend à 80–90 % en 200ms ; focus = contour blanc 2px décalé de 4px (`focus-visible` seulement).
- **Ghost:** fond transparent, contour blanc à 60 %, texte blanc ; survol = fond blanc à 10 %. Pour l'action secondaire à côté d'un bouton principal.
- **Pilule de Nuit (sur fond clair) :** fond Masque de Nuit, texte blanc, 12px × 24px ; survol = Nuit Profonde. C'est l'action principale sur le Voile d'Ivoire (état vide de la grille, messages d'erreur) : la pilule blanche ne se voit pas sur fond clair.

### Chips (badges de la carte de profil)
- **Style:** pilule, fond gris très clair, texte gris foncé (rapport 9,4:1), 0.75rem. Tous identiques : l'âge, le genre et la ville ne sont pas des catégories à coder par couleur.

### Cards / Containers (carte de profil)
- **Corner Style:** coins doux (10px).
- **Background:** Blanc Ivoire.
- **Shadow Strategy:** aucune au repos ; Survol de carte au survol (voir Elevation).
- **Border:** 2px Trait Gris ; passe au violet très clair au survol et au focus.
- **Internal Padding:** 16px. La photo occupe tout le haut, carrée, sans marge ; un zoom de 5 % en 300ms au survol (appareils avec survol uniquement).

### Inputs / Fields
- **Style:** fond blanc, bordure fine grise, coins doux (10px), 36px de haut (44px sur écran tactile).
- **Focus:** anneau violet clair de 2px.

### Navigation
- **Sur la hero :** transparente, superposée à la vidéo, verre très léger (blanc 5 %, flou 4px, bordure basse blanche à 10 %), mot-symbole Playfair en blanc uni.
- **Ailleurs :** collante en haut de page (`sticky`). ⚠️ Son fond pastel en dégradé et son logo en dégradé sont hérités : à migrer.
- **Mobile :** menu tiroir sous 768px, déclencheur de 40px.

### Contrôle vidéo (composant signature)
Bouton rond de 44px en bas à droite de la hero : fond noir à 30 % + flou, contour blanc à 30 %, icône pause/lecture blanche de 16px. N'apparaît que si la vidéo est réellement chargée. Libellé accessible qui change avec l'état.

## Do's and Don'ts

### Do:
- **Do** poser le texte sur l'image avec un voile Masque de Nuit à 50 %, jamais directement sur une photo ou une vidéo.
- **Do** utiliser le blanc à 75–80 % d'opacité pour les textes secondaires sur fond de nuit.
- **Do** garder une seule action principale (pilule blanche) par zone, accompagnée au plus d'une pilule contour.
- **Do** laisser les photos occuper la place : la carte de profil s'efface derrière son image.
- **Do** dessiner les icônes avec Lucide (trait régulier), jamais avec des emojis.

### Don't:
- **Don't** utiliser de dégradé violet→rose, ni sur le texte, ni sur les boutons, ni en fond de page. C'est l'héritage pastel à retirer (déjà retiré de l'accueil et du footer ; reste : navbar hors accueil, menu mobile, autres pages).
- **Don't** colorer les badges selon leur contenu (bleu pour l'âge, vert pour le genre…) : un badge informe, il ne catégorise pas.
- **Don't** utiliser les fonds pastel violet/rose/indigo (`from-purple-50 via-pink-50 to-indigo-50`) sur de nouvelles surfaces.
- **Don't** utiliser Playfair pour autre chose que le titre display et la marque.
- **Don't** ajouter de sur-titre (petit libellé en capitales au-dessus d'un titre) : le titre parle seul. Le « LASTMODEL » au-dessus du titre de la hero est un héritage à retirer.
- **Don't** mettre d'ombre sur une surface au repos.
- **Don't** utiliser d'emojis comme icônes (👨 👩 📍 📷 dans les cartes actuelles : à remplacer).
