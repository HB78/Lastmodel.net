# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux publics servis à égalité par la page d'accueil :

- **Les annonceurs (membres)** : personnes majeures qui publient une annonce d'escort (profil avec photos, âge, ville, origine, taille, poids, description, téléphone). Leur job : être vues et contactées. Elles s'inscrivent gratuitement, puis passent Premium (mensuel) ou VIP (annuel) pour plus de photos et de visibilité.
- **Les visiteurs (clients)** : personnes qui parcourent les annonces, filtrent (ville, origine…), consultent un profil, le likent ou le commentent, puis contactent l'annonceur directement par téléphone.

## Product Purpose

Lastmodel (lastmodel.net) est un annuaire d'annonces d'escorts. Il permet à des annonceurs de publier un profil et à des visiteurs de les trouver et de les contacter directement. Le succès : des visiteurs qui trouvent un profil pertinent et contactent, et des annonceurs qui s'inscrivent puis souscrivent un abonnement payant.

## Positioning

Axes revendiqués par le propriétaire (à prouver dans le produit, pas seulement à afficher) :

- **Authenticité** : des profils réels. ⚠️ Aujourd'hui, seule la vérification de l'email existe ; aucune vérification d'identité ou de photos n'est implémentée. Ne pas afficher « profils vérifiés » tant que ce n'est pas vrai.
- **Discrétion / mystère** : ton élégant et discret (slogan actuel de la hero : « Le mystère commence ici — Rencontres élégantes et authentiques, pour ceux qui osent »).
- **Simplicité** : contact direct par téléphone, sans messagerie intermédiaire.

Le positionnement différenciant reste une **décision ouverte**.

## Operating Context

- Les visiteurs arrivent en grande partie via le référencement (mots-clés escort + villes françaises : Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes, Strasbourg…).
- Parcours visiteur : accueil → filtres → grille de profils → page profil (`/produits/[id]`) → appel téléphonique.
- Parcours annonceur : inscription → vérification email → création du profil (`/create`) → gestion des photos (`/profile/photos`) → abonnement (`/pricing`, Stripe).
- Espace d'administration (`/admin`) pour la modération et les statistiques.
- Langue : français, marché France.

## Capabilities and Constraints

- Plans : Gratuit (2 photos max), Premium mensuel et VIP annuel (11 photos max). Source unique de la limite : `lib/photoLimits.ts`.
- Profils gratuits censés être moins visibles que les payants (règle à confirmer : aujourd'hui `/produits/[id]` affiche aussi les profils FREE).
- Fonctionnalités : likes, favoris, commentaires sur les profils, formulaire de contact, filtres par ville et origine.
- Photos hébergées sur Cloudflare R2, rangées par utilisateur (`images/{userId}/`).
- Annonceurs obligatoirement majeurs (âge minimum 18 dans le formulaire). Aucune vérification d'âge au-delà de la saisie.
- Stack existante : Next.js 15 (App Router), Tailwind 4, Radix UI, Prisma/PostgreSQL, Better Auth, Stripe.

## Brand Commitments

- Nom : **Lastmodel** (logo : `public/logolast.png`, `public/last.png`).
- Voix : élégante, discrète, un brin mystérieuse (« pour ceux qui osent »).

## Evidence on Hand

- Hero vidéo existante (`public/video/`) avec image de repli pour `prefers-reduced-motion`.
- Images d'exemple dans `public/` (`nina.jpg`, `nina2.jpg`, `kat.avif`, `pierce.webp`) : statut (vraies annonceuses ou visuels d'illustration) non confirmé.
- La page `/pricing` affiche « 10 000 membres » : chiffre **non vérifié**. Ne pas réutiliser ni inventer d'autres chiffres, témoignages ou garanties.
- Absences à ne pas combler par de la fiction : pas de témoignages, pas de presse, pas de vérification d'identité.

## Product Principles

1. **Les deux publics comptent** : chaque surface publique doit aider un visiteur à trouver et contacter, et donner envie à un annonceur de publier.
2. **Ne promettre que ce qui existe** : « vérifié », « authentique », « discret » doivent correspondre à des mécanismes réels.
3. **Discrétion par défaut** : l'interface n'expose rien de plus que ce que l'annonceur a choisi de publier.
4. **Contact sans friction** : du profil au téléphone en un minimum d'étapes.
5. **Contenu réservé aux adultes** : majorité des annonceurs et des visiteurs à respecter dans chaque parcours.
