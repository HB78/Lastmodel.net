'use client';

import { Input } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

interface City {
  nom: string;
  code: string;
  departement: {
    nom: string;
    code: string;
  };
  region: {
    nom: string;
  };
}

interface CityInputProps {
  id?: string;
  value?: string;
  onCitySelect?: (city: string) => void;
  placeholder?: string;
  'aria-describedby'?: string;
}

export default function CityInput({
  id,
  value = '',
  onCitySelect,
  placeholder = 'Rechercher une ville...',
  'aria-describedby': ariaDescribedBy,
}: CityInputProps) {
  const [query, setQuery] = useState(value);
  const [cities, setCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputId = useId();
  const listboxId = useId();
  const statusId = useId();

  const finalInputId = id || inputId;

  // Recherche des villes via l'API Gouvernementale française
  const searchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          searchQuery
        )}&fields=nom,code,departement,region&boost=population&limit=10`
      );
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCities(query);
        setIsOpen(true);
      } else {
        setCities([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fermer la dropdown en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion basique du clavier
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleCitySelect = (city: City) => {
    const cityName = `${city.nom} (${city.departement.code})`;
    setQuery(cityName);
    setIsOpen(false);
    onCitySelect?.(cityName);
  };

  const clearInput = () => {
    setQuery('');
    setCities([]);
    setIsOpen(false);
    onCitySelect?.('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Status pour les annonces */}
      <div id={statusId} className="sr-only" role="status" aria-live="polite">
        {isLoading && 'Recherche en cours...'}
        {!isLoading &&
          cities.length > 0 &&
          `${cities.length} ville${cities.length > 1 ? 's' : ''} trouvée${
            cities.length > 1 ? 's' : ''
          }`}
        {!isLoading &&
          query.length >= 2 &&
          cities.length === 0 &&
          'Aucune ville trouvée'}
      </div>

      <div className="relative">
        <MapPin
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          id={finalInputId}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-white pr-10 pl-10 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
          onFocus={() => query && setIsOpen(true)}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns={isOpen ? listboxId : undefined}
          aria-describedby={[statusId, ariaDescribedBy]
            .filter(Boolean)
            .join(' ')}
          aria-label="Rechercher une ville française"
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform rounded p-1 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:outline-none"
            aria-label={`Effacer la recherche "${query}"`}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown des résultats */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          aria-label="Résultats de recherche de villes"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              Recherche en cours...
            </div>
          ) : cities.length > 0 ? (
            cities.map((city) => (
              <button
                key={`${city.code}-${city.nom}`}
                role="option"
                aria-selected="false"
                onClick={() => handleCitySelect(city)}
                className="w-full border-b border-gray-100 px-3 py-2 text-left text-gray-900 last:border-b-0 hover:bg-purple-50 focus:bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:outline-none focus:ring-inset"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{city.nom}</span>
                  <span className="text-sm text-gray-500">
                    {city.departement.code}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {city.departement.nom}, {city.region.nom}
                </div>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="p-3 text-center text-gray-500">
              Aucune ville trouvée pour "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
