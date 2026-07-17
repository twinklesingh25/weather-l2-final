/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GeocodingCity, GeocodingResponse } from '../types';
import { Search, MapPin, Loader2, X, History, Sparkles } from 'lucide-react';

interface CitySearchProps {
  onSelectCity: (city: GeocodingCity) => void;
  selectedCity: GeocodingCity | null;
}

const POPULAR_CITIES: GeocodingCity[] = [
  { id: 5128581, name: 'New York', latitude: 40.71427, longitude: -74.00597, country: 'United States', country_code: 'US', timezone: 'America/New_York' },
  { id: 2643743, name: 'London', latitude: 51.50853, longitude: -0.12574, country: 'United Kingdom', country_code: 'GB', timezone: 'Europe/London' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.69171, country: 'Japan', country_code: 'JP', timezone: 'Asia/Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.85341, longitude: 2.3488, country: 'France', country_code: 'FR', timezone: 'Europe/Paris' },
  { id: 2147714, name: 'Sydney', latitude: -33.86785, longitude: 151.20732, country: 'Australia', country_code: 'AU', timezone: 'Australia/Sydney' },
];

export default function CitySearch({ onSelectCity, selectedCity }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<GeocodingCity[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
    }
  }, []);

  // Save a search to recents
  const saveToRecent = (city: GeocodingCity) => {
    const updated = [city, ...recentSearches.filter((item) => item.id !== city.id)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent searches:', e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live search
  const triggerSearch = async (searchVal: string) => {
    const trimmed = searchVal.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmed
        )}&count=8&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data: GeocodingResponse = await response.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setIsDropdownOpen(true);
      } else {
        setResults([]);
        setError(`No cities found matching "${trimmed}"`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch city suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === '') {
      setResults([]);
      setIsDropdownOpen(false);
      setError(null);
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch(query);
    }
  };

  const handleSelect = (city: GeocodingCity) => {
    onSelectCity(city);
    saveToRecent(city);
    setQuery(city.name);
    setIsDropdownOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full z-30" ref={dropdownRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsDropdownOpen(true);
          }}
          placeholder="Search for a city (e.g., San Francisco, Mumbai, Berlin)..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-inner"
        />

        <div className="absolute right-3.5 flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : query ? (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          <button
            onClick={() => triggerSearch(query)}
            disabled={isLoading || !query.trim()}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error or No Results Box */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-center gap-2 z-40 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>{error}</span>
        </div>
      )}

      {/* Live Search Suggestions Dropdown */}
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2.5 border-b border-slate-900 bg-slate-900/20">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" /> Matches found ({results.length})
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-900">
            {results.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-slate-100 text-sm group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                    {city.name}
                    {city.country_code && (
                      <span className="text-[10px] bg-slate-900 group-hover:bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800 uppercase font-mono">
                        {city.country_code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {[city.admin1, city.country].filter(Boolean).join(', ')}
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600 font-mono flex flex-col items-end">
                  <span>Lat: {city.latitude.toFixed(2)}</span>
                  <span>Lon: {city.longitude.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Select & History panel */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-3 text-xs text-slate-400">
        {/* Recent searches (if any) */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 flex items-center gap-1">
              <History className="w-3 h-3" /> Recent:
            </span>
            <div className="flex flex-wrap gap-1">
              {recentSearches.map((city) => (
                <button
                  key={`recent-${city.id}`}
                  onClick={() => onSelectCity(city)}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                    selectedCity?.id === city.id
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 font-medium'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            <span className="text-slate-700 mx-1">|</span>
          </div>
        )}

        {/* Popular Cities */}
        <span className="text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400/80" /> Popular:
        </span>
        <div className="flex flex-wrap gap-1">
          {POPULAR_CITIES.map((city) => (
            <button
              key={`pop-${city.id}`}
              onClick={() => onSelectCity(city)}
              className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                selectedCity?.id === city.id
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
