'use client';

import { Cookie, Settings, X } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useEffect, useState } from 'react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours true, non modifiable
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Petit délai pour ne pas être trop agressif
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);

    // Ici tu peux activer tes scripts analytics (PostHog, etc.)
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      window.dataLayer.push({ event: 'cookie_consent_all' });
    }
  };

  const handleAcceptEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);

    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push({ event: 'cookie_consent_essential' });
    }
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
    setShowSettings(false);

    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push({ event: 'cookie_consent_custom', consent });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Bannière principale */}
      {!showSettings ? (
        <div
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-2xl sm:right-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:rounded-lg sm:border"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Cookie
                    className="h-5 w-5 text-purple-600"
                    aria-hidden="true"
                  />
                </div>
                <h2
                  id="cookie-banner-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Cookies & Confidentialité
                </h2>
              </div>
            </div>

            {/* Description */}
            <p
              id="cookie-banner-description"
              className="mb-4 text-sm leading-relaxed text-gray-600"
            >
              Nous utilisons des cookies pour améliorer votre expérience,
              analyser notre trafic et personnaliser le contenu. Vous pouvez
              accepter tous les cookies ou personnaliser vos préférences.
            </p>

            <p className="mb-4 text-xs text-gray-500">
              En savoir plus :{' '}
              <Link
                href="/legal/politique-confidentialite"
                className="text-purple-600 underline hover:text-purple-700"
              >
                Politique de confidentialité
              </Link>
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                Accepter tout
              </button>
              <button
                onClick={handleAcceptEssential}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                Essentiel uniquement
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                aria-label="Personnaliser les cookies"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Modal de paramètres */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="cookie-settings-title"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2
                id="cookie-settings-title"
                className="text-xl font-semibold text-gray-900"
              >
                Paramètres des cookies
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                aria-label="Fermer les paramètres"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-96 space-y-4 overflow-y-auto p-6">
              {/* Cookies essentiels */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Cookies essentiels
                    </h3>
                    <p className="text-sm text-gray-600">
                      Nécessaires au fonctionnement du site (connexion,
                      sécurité). Ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-5 w-5 rounded border-gray-300 text-purple-600"
                      aria-label="Cookies essentiels - toujours activés"
                    />
                  </div>
                </div>
              </div>

              {/* Cookies analytics */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Cookies analytiques
                    </h3>
                    <p className="text-sm text-gray-600">
                      Nous aident à comprendre comment vous utilisez le site
                      pour l'améliorer (anonymisé).
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          analytics: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                      aria-label="Activer ou désactiver les cookies analytiques"
                    />
                  </div>
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Cookies marketing
                    </h3>
                    <p className="text-sm text-gray-600">
                      Permettent de personnaliser les publicités et mesurer leur
                      efficacité.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                      aria-label="Activer ou désactiver les cookies marketing"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
