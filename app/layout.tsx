import { CookieBanner } from '@/components/cookies/CookieBanner';
import { PosthogProvider } from '@/posthog/posthogProvider/posthogProvider';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Geist, Geist_Mono, Playfair_Display, DM_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lastmodel - Le site de rencontre moderne',
    template: '%s | Lastmodel',
  },
  description:
    'Lastmodel est le site de rencontre le plus moderne du monde. Rencontrez des personnes authentiques grâce à nos algorithmes intelligents et nos fonctionnalités innovantes. Escort, escort paris, escort lyon, escort marseille, escort toulouse, escort Bordeaux, escort Nantes, escort Strasbourg, escort girl, escort girl paris.',
  keywords: [
    'rencontre',
    'dating',
    'site de rencontre',
    'rencontres en ligne',
    'célibataires',
    'amour',
    'relation',
    'escort',
    'escort paris',
    'escort lyon',
    'escort marseille',
    'escort toulouse',
    'escort Bordeaux',
    'escort Nantes',
    'escort Strasbourg',
    'escort girl',
    'escort girl paris',
    'black',
    'black escort',
    'beurette escort',
    'beurette',
    'beurette paris',
    'beurette lyon',
    'beurette marseille',
    'beurette toulouse',
    'beurette Bordeaux',
    'beurette Nantes',
    'beurette Strasbourg',
    'beurette girl',
    'beurette girl paris',
  ],
  authors: [{ name: 'Lastmodel' }],
  creator: 'Lastmodel',
  publisher: 'Lastmodel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lastmodel.net'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://lastmodel.net',
    title: 'Lastmodel - Le site de rencontre moderne',
    description:
      'Rencontrez des personnes authentiques grâce à nos algorithmes intelligents et nos fonctionnalités innovantes.',
    siteName: 'Lastmodel',
    images: [
      {
        url: '/last.png',
        width: 1200,
        height: 630,
        alt: 'Lastmodel - Site de rencontre moderne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lastmodel - Le site de rencontre moderne',
    description:
      'Rencontrez des personnes authentiques grâce à nos algorithmes intelligents.',
    images: ['/last.png'],
    creator: '@lastmodel', // Remplace par ton handle Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logolast.png',
    apple: '/logolast.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} antialiased`}
        >
          <PosthogProvider>
            <Toaster position="top-center" richColors />
            <NuqsAdapter>{children}</NuqsAdapter>
            <CookieBanner />
          </PosthogProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
