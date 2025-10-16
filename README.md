<div align="center">
  <img src="./public/logolast.png" alt="Last Model Logo" width="200"/>

# Last Model

**Site de rencontre avec système d'abonnement**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[🌐 Site Web](https://lastmodel.net) • [📖 Documentation](#documentation) • [🐛 Signaler un Bug](https://github.com/votre-repo/issues)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Installation](#-installation)
- [Scripts Disponibles](#-scripts-disponibles)
- [Structure du Projet](#-structure-du-projet)
- [Sécurité](#-sécurité)
- [Contribution](#-contribution)

---

## 🎯 À propos

**Last Model** est une plateforme SaaS moderne permettant la mise en relation de profils avec un système d'abonnement freemium. Construite avec Next.js 15, l'application offre une expérience utilisateur fluide et sécurisée.

### 🎨 Caractéristiques principales

- 🔐 **Authentification robuste** avec Better Auth (email/password + OAuth Google)
- 💳 **Paiements Stripe** avec abonnements mensuels et annuels
- 📸 **Upload d'images** sécurisé sur Cloudflare R2
- 🛡️ **Protection WAF** avec Arcjet (anti-bot, rate limiting, SQL injection)
- 📊 **Analytics** avec PostHog
- 🔄 **Jobs CRON** automatiques pour le nettoyage des comptes inactifs

---

## ✨ Fonctionnalités

### Pour les utilisateurs

- ✅ Inscription/Connexion (email + Google OAuth)
- ✅ Profils personnalisables avec photos (1 gratuit / 11 premium)
- ✅ Système de likes et favoris
- ✅ Commentaires sur les profils
- ✅ Messagerie de contact
- ✅ Gestion d'abonnement via Stripe

### Pour les admins

- ✅ Dashboard d'administration
- ✅ Gestion des utilisateurs
- ✅ Modération des contenus
- ✅ Statistiques et analytics

---

## 🛠️ Stack Technique

### Frontend

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : TypeScript 5
- **Styling** : Tailwind CSS 4
- **UI Components** : Radix UI
- **Animations** : next-view-transitions
- **Forms** : React Hook Form + Zod
- **State** : nuqs (URL state)

### Backend

- **Runtime** : Node.js
- **Database** : PostgreSQL (Neon)
- **ORM** : Prisma 6
- **Auth** : Better Auth + Argon2
- **Payments** : Stripe
- **Storage** : Cloudflare R2 (S3-compatible)
- **Email** : Resend

### DevOps & Sécurité

- **Hosting** : Vercel
- **WAF** : Arcjet (bot detection, rate limiting, shield)
- **Analytics** : PostHog
- **CI/CD** : Vercel Git Integration
- **Testing** : Vitest + React Testing Library

---

## 🚀 Installation

### Prérequis

- Node.js 20+
- pnpm (recommandé) ou npm
- PostgreSQL
- Comptes requis : Stripe, Cloudflare R2, Google OAuth, Resend, PostHog, Arcjet

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/lastmodel.git
cd lastmodel
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Consultez le fichier `.env.example` pour la liste complète des variables nécessaires.

4. **Initialiser la base de données**

```bash
pnpm prisma generate
pnpm prisma db push
```

5. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts Disponibles

```bash
# Développement
pnpm dev          # Lance le serveur dev avec Turbopack
pnpm build        # Build de production
pnpm start        # Lance le build de production

# Base de données
pnpm prisma generate    # Génère le client Prisma
pnpm prisma db push     # Synchronise le schéma avec la DB
pnpm prisma studio      # Interface visuelle de la DB

# Qualité de code
pnpm lint         # Vérifie le code avec ESLint
pnpm format       # Formate le code avec Prettier
pnpm clean        # Lint + format automatique
pnpm ts           # Vérification TypeScript

# Tests
pnpm test         # Lance les tests en mode watch
pnpm test:run     # Lance les tests une fois
pnpm test:ui      # Interface UI pour les tests
```

---

## 📁 Structure du Projet

```
lastmodel/
├── app/                      # Next.js App Router
│   ├── (connexion)/         # Routes d'authentification
│   ├── admin/               # Dashboard admin
│   ├── api/                 # API routes
│   ├── chat/                # Page de chat
│   ├── contact/             # Page de contact
│   ├── create/              # Création de profil
│   ├── favorites/           # Favoris
│   ├── pricing/             # Page de tarification
│   ├── produits/            # Liste des profils
│   └── profile/             # Profil utilisateur
├── actions/                 # Server Actions
│   ├── admin/               # Actions admin
│   ├── creation/            # Actions de création
│   ├── delete/              # Actions de suppression
│   ├── stripe/              # Actions Stripe
│   └── update/              # Actions de mise à jour
├── components/              # Composants React
│   ├── ui/                  # Composants UI réutilisables
│   └── ...
├── lib/                     # Bibliothèques et config
│   ├── better-auth-setup/   # Configuration Better Auth
│   ├── prisma-setup/        # Configuration Prisma
│   ├── s3-setup/            # Configuration S3/R2
│   └── stripe-setup/        # Configuration Stripe
├── prisma/                  # Schéma Prisma
│   └── schema.prisma
├── public/                  # Assets statiques
├── tools/                   # Utilitaires
├── zodSchema/               # Schémas de validation Zod
├── middleware.ts            # Middleware Next.js
├── .env.example             # Template des variables
└── vercel.json              # Config Vercel (CRON jobs)
```

---

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Authentification** : Better Auth + Argon2 (hashing sécurisé)
- ✅ **Rate Limiting** : Arcjet (10 req/10min pour signup, 60 req/1min pour signin)
- ✅ **WAF** : Protection contre SQL injection, XSS, path traversal
- ✅ **Bot Detection** : Blocage des bots automatiques
- ✅ **Headers de sécurité** : CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- ✅ **CORS** : Whitelist des origines autorisées
- ✅ **Upload sécurisé** : Validation du type MIME + signature binaire
- ✅ **CRON protégé** : Secret token pour les jobs automatiques
- ✅ **Prisma ORM** : Protection native contre les injections SQL

### Rapport de sécurité

**Score global : 8.5/10**

Pour signaler une vulnérabilité : [security@lastmodel.net](mailto:security@lastmodel.net)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Conventions de code

- Code en TypeScript strict
- Utiliser Prettier pour le formatage (`pnpm format`)
- Écrire des tests pour les nouvelles fonctionnalités
- Suivre les conventions de commit conventionnels

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📧 Contact

**Équipe Last Model** - [contact@lastmodel.net](mailto:contact@lastmodel.net)

Site web : [https://lastmodel.net](https://lastmodel.net)

---

<div align="center">

**Fait avec ❤️ par l'équipe Last Model**

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

</div>
