'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Filter, MapPin, Search, Users, X } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs'; // ✅ Import nuqs
import { useId } from 'react';
import CityInput from './CityInput';

interface FilterDropdownProps {
  origins: Array<{ id: string; name: string }>;
}

export function FilterDropdown({ origins }: FilterDropdownProps) {
  // ✅ Gérer tous les filtres avec nuqs
  const [filters, setFilters] = useQueryStates(
    {
      // parseAsString.withDefault('') = Si le param n'existe pas dans l'URL, retourne ''
      age: parseAsString.withDefault(''),
      origin: parseAsString.withDefault(''),
      city: parseAsString.withDefault(''),
      sex: parseAsString.withDefault(''),
    },
    {
      // history: 'push' = Ajoute une entrée dans l'historique du navigateur (bouton retour fonctionne)
      // history: 'replace' = Remplace l'URL actuelle sans ajouter d'entrée dans l'historique
      history: 'push',

      // shallow: false = IMPORTANT ! Le Server Component (ProductGrid) se recharge avec les nouveaux filtres
      // shallow: true = L'URL change mais le serveur ne recharge pas (filtres côté client uniquement)
      shallow: false,

      // throttleMs: 300 = Attend 300ms avant d'appliquer le changement
      // Évite de spammer le serveur si l'utilisateur change plusieurs filtres rapidement
      throttleMs: 300,
    }
  );

  // Générer des IDs uniques pour les labels
  const ageId = useId();
  const originId = useId();
  const sexId = useId();
  const cityId = useId();
  const filterId = useId();

  // ✅ Mise à jour d'un filtre (super simple maintenant!)
  const updateFilter = (key: keyof typeof filters, value: string) => {
    if (value && value !== 'all' && value !== '') {
      setFilters({ [key]: value });
    } else {
      setFilters({ [key]: null }); // null = supprime le param de l'URL
    }
  };

  // ✅ Réinitialiser tous les filtres
  const clearAllFilters = () => {
    setFilters({
      age: null,
      origin: null,
      city: null,
      sex: null,
    });
  };

  // Récupérer les valeurs actuelles des filtres
  const currentAge = filters.age;
  const currentOrigin = filters.origin;
  const currentCity = filters.city;
  const currentSex = filters.sex;

  // Compter le nombre de filtres actifs
  const activeFiltersCount = [
    currentAge,
    currentOrigin,
    currentCity,
    currentSex,
  ].filter((filter) => filter && filter !== 'all').length;

  // Créer des descriptions accessibles pour les filtres actifs
  const getFilterDescription = () => {
    const activeFilters = [];
    if (currentAge && currentAge !== 'all') {
      activeFilters.push(`âge ${currentAge}`);
    }
    if (currentOrigin && currentOrigin !== 'all') {
      const originName = origins.find((o) => o.id === currentOrigin)?.name;
      if (originName) {
        activeFilters.push(`origine ${originName}`);
      }
    }
    if (currentSex && currentSex !== 'all') {
      activeFilters.push(`genre ${currentSex}`);
    }
    if (currentCity && currentCity !== 'all') {
      activeFilters.push(`ville ${currentCity}`);
    }
    return activeFilters.join(', ');
  };

  return (
    <section
      className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
      role="search"
      aria-labelledby={`${filterId}-title`}
      aria-describedby={`${filterId}-description`}
    >
      <div className="flex flex-col gap-6">
        {/* Header avec titre et compteur de filtres */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-2"
              aria-hidden="true"
            >
              <Search className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2
                id={`${filterId}-title`}
                className="font-semibold text-gray-900"
              >
                Affiner votre recherche
              </h2>
              <p
                id={`${filterId}-description`}
                className="text-sm text-gray-600"
              >
                Trouvez votre profil idéal
              </p>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="text-sm text-gray-600"
                aria-live="polite"
                aria-label={`${activeFiltersCount} filtres actifs: ${getFilterDescription()}`}
              >
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}{' '}
                actif{activeFiltersCount > 1 ? 's' : ''}
              </span>
              <div
                className="h-2 w-2 rounded-full bg-purple-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Filtres en grille responsive */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Filtre par âge */}
          <div className="space-y-2">
            <label
              htmlFor={ageId}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Calendar
                className="h-4 w-4 text-purple-600"
                aria-hidden="true"
              />
              Âge
            </label>
            <Select
              value={currentAge || 'all'}
              onValueChange={(value) => updateFilter('age', value)}
            >
              <SelectTrigger
                id={ageId}
                className="w-full border-gray-300 bg-white text-gray-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:ring-offset-1"
                aria-describedby={currentAge ? `${ageId}-current` : undefined}
              >
                <SelectValue placeholder="Sélectionnez un âge" />
              </SelectTrigger>
              <SelectContent
                className="border-gray-200 bg-white"
                role="listbox"
                aria-label="Options d'âge"
              >
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  Tous les âges
                </SelectItem>
                <SelectItem
                  value="18-23"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  18-23 ans
                </SelectItem>
                <SelectItem
                  value="24-27"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  24-27 ans
                </SelectItem>
                <SelectItem
                  value="28-32"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  28-32 ans
                </SelectItem>
                <SelectItem
                  value="33-37"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  33-37 ans
                </SelectItem>
                <SelectItem
                  value="38-42"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  38-42 ans
                </SelectItem>
                <SelectItem
                  value="43-47"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  43-47 ans
                </SelectItem>
              </SelectContent>
            </Select>
            {currentAge && currentAge !== 'all' && (
              <div
                id={`${ageId}-current`}
                className="sr-only"
                aria-live="polite"
              >
                Filtre âge sélectionné: {currentAge}
              </div>
            )}
          </div>

          {/* Filtre par origine */}
          <div className="space-y-2">
            <label
              htmlFor={originId}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Users className="h-4 w-4 text-purple-600" aria-hidden="true" />
              Origine
            </label>
            <Select
              value={currentOrigin || 'all'}
              onValueChange={(value) => updateFilter('origin', value)}
            >
              <SelectTrigger
                id={originId}
                className="w-full border-gray-300 bg-white text-gray-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:ring-offset-1"
                aria-describedby={
                  currentOrigin ? `${originId}-current` : undefined
                }
              >
                <SelectValue placeholder="Sélectionnez une origine" />
              </SelectTrigger>
              <SelectContent
                className="border-gray-200 bg-white"
                role="listbox"
                aria-label="Options d'origine"
              >
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  Toutes les origines
                </SelectItem>
                {origins.map((origin) => (
                  <SelectItem
                    key={origin.id}
                    value={origin.id}
                    className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                  >
                    {origin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentOrigin && currentOrigin !== 'all' && (
              <div
                id={`${originId}-current`}
                className="sr-only"
                aria-live="polite"
              >
                Filtre origine sélectionné:{' '}
                {origins.find((o) => o.id === currentOrigin)?.name}
              </div>
            )}
          </div>

          {/* Filtre par sexe */}
          <div className="space-y-2">
            <label
              htmlFor={sexId}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Filter className="h-4 w-4 text-purple-600" aria-hidden="true" />
              Genre
            </label>
            <Select
              value={currentSex || 'all'}
              onValueChange={(value) => updateFilter('sex', value)}
            >
              <SelectTrigger
                id={sexId}
                className="w-full border-gray-300 bg-white text-gray-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:ring-offset-1"
                aria-describedby={currentSex ? `${sexId}-current` : undefined}
              >
                <SelectValue placeholder="Sélectionnez un genre" />
              </SelectTrigger>
              <SelectContent
                className="border-gray-200 bg-white"
                role="listbox"
                aria-label="Options de genre"
              >
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  Tous les genres
                </SelectItem>
                <SelectItem
                  value="homme"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">👨</span>
                    <span>Homme</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="femme"
                  className="text-gray-900 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-900"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">👩</span>
                    <span>Femme</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {currentSex && currentSex !== 'all' && (
              <div
                id={`${sexId}-current`}
                className="sr-only"
                aria-live="polite"
              >
                Filtre genre sélectionné: {currentSex}
              </div>
            )}
          </div>

          {/* Filtre par ville */}
          <div className="space-y-2">
            <label
              htmlFor={cityId}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <MapPin className="h-4 w-4 text-purple-600" aria-hidden="true" />
              Ville
            </label>
            <div className="relative">
              <CityInput
                id={cityId}
                value={currentCity || ''}
                placeholder="Rechercher une ville"
                onCitySelect={(city) => updateFilter('city', city)}
                aria-describedby={currentCity ? `${cityId}-current` : undefined}
              />
              {currentCity && currentCity !== 'all' && (
                <div
                  id={`${cityId}-current`}
                  className="sr-only"
                  aria-live="polite"
                >
                  Filtre ville sélectionné: {currentCity}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions en bas */}
        <div className="flex items-center justify-between border-t border-gray-200/50 pt-4">
          <div
            className="text-sm text-gray-600"
            role="status"
            aria-live="polite"
            aria-label={
              activeFiltersCount === 0
                ? 'Aucun filtre appliqué'
                : `${activeFiltersCount} filtres appliqués: ${getFilterDescription()}`
            }
          >
            {activeFiltersCount === 0
              ? 'Aucun filtre appliqué'
              : `${activeFiltersCount} filtre${
                  activeFiltersCount > 1 ? 's' : ''
                } appliqué${activeFiltersCount > 1 ? 's' : ''}`}
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="border-gray-300 bg-white text-gray-600 hover:bg-slate-100 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label={`Réinitialiser tous les filtres. ${activeFiltersCount} filtres actuellement actifs: ${getFilterDescription()}`}
              >
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
