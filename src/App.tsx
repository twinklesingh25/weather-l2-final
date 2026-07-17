/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GeocodingCity, ForecastResponse, PlanningRecommendation } from './types';
import { generateRecommendations } from './utils/weatherHelpers';
import CitySearch from './components/CitySearch';
import CurrentConditions from './components/CurrentConditions';
import WeatherChart from './components/WeatherChart';
import RecommendationsCard from './components/RecommendationsCard';
import { CloudSun, RefreshCw, AlertCircle, Sparkles, MapPin, Loader } from 'lucide-react';

const DEFAULT_CITY: GeocodingCity = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  country_code: 'GB',
  timezone: 'Europe/London',
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingCity>(DEFAULT_CITY);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<PlanningRecommendation[]>([]);

  // 1. Initial Load: Retrieve last selected city from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_selected_city');
      if (saved) {
        setSelectedCity(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse saved city:', e);
    }
  }, []);

  // 2. Fetch forecast whenever selectedCity changes
  useEffect(() => {
    let isMounted = true;

    async function fetchForecast() {
      setIsLoading(true);
      setError(null);

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to retrieve forecast data from meteorological services.');
        }

        const data: ForecastResponse = await response.json();
        
        if (isMounted) {
          setForecast(data);
          
          // Generate recommendations dynamically from forecast
          if (data.current && data.daily) {
            const recs = generateRecommendations(data.current, data.daily);
            setRecommendations(recs);
          }
          
          // Save selected city to localStorage
          localStorage.setItem('weather_selected_city', JSON.stringify(selectedCity));
        }
      } catch (err: any) {
        console.error('Forecast fetch error:', err);
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred while loading weather forecast.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Force-refresh function
  const handleRefresh = () => {
    // Re-trigger the effect by setting selectedCity to its clone to force a state update
    setSelectedCity({ ...selectedCity });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.04] rounded-full blur-3xl animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/[0.03] rounded-full blur-3xl animate-pulse duration-8000"></div>
      </div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-100 text-sm sm:text-base tracking-tight flex items-center gap-2">
                Weather Intelligence
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-semibold hidden xs:inline-block">
                  v1.2
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Smart climate planning & forecasting</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-850 disabled:opacity-50 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-6">
        
        {/* Search Panel Component */}
        <section className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
          <CitySearch onSelectCity={setSelectedCity} selectedCity={selectedCity} />
        </section>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl text-red-300 flex items-start gap-3 shadow-lg animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-red-200">Weather service failure</h4>
              <p className="text-xs text-red-300/90 mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2.5 px-3 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-200 text-[10px] font-bold rounded-lg border border-red-700/35 transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* Main Forecast Dashboard Section */}
        {isLoading && !forecast ? (
          /* Loading Skeleton for initial state */
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-900 h-64 rounded-2xl border border-slate-800/60 p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-20 h-5 bg-slate-800 rounded-lg"></div>
                  <div className="w-40 h-8 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-900 h-28 rounded-xl border border-slate-800/50"></div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 h-64 rounded-2xl border border-slate-800/60"></div>
          </div>
        ) : forecast ? (
          <div className="space-y-6">
            
            {/* Loading Overlay when refresh is running */}
            {isLoading && (
              <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-50">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-2xl">
                  <Loader className="w-5 h-5 text-indigo-400 animate-spin" />
                  <span className="text-xs font-semibold text-slate-200">Updating Forecast...</span>
                </div>
              </div>
            )}

            {/* Panel 1: Current Weather Conditions (Bento Layout) */}
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CurrentConditions
                current={forecast.current}
                daily={forecast.daily}
                cityName={selectedCity.name}
                countryName={selectedCity.country}
                adminRegion={selectedCity.admin1}
              />
            </section>

            {/* Panel 2 & 3: Interactive 7-Day Forecast & Planning Intelligence (Side-by-Side or Stacked) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Outlook graph - 7 columns */}
              <section className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-75">
                <WeatherChart daily={forecast.daily} timezone={forecast.timezone} />
              </section>

              {/* Recommendations/Planning - 5 columns */}
              <section className="lg:col-span-5 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-150">
                <RecommendationsCard recommendations={recommendations} />
              </section>
            </div>

          </div>
        ) : (
          /* Empty/Welcome Fallback State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="mx-auto w-16 h-16 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
              <CloudSun className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Welcome to Weather Intelligence</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Input a city in the search bar above or choose a popular location to generate an immediate smart forecast with planning recommendations.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Powered by the public{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Open-Meteo API
            </a>{' '}
            (No API Keys required).
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            System status: <span className="text-slate-400 font-mono">Fully Operational</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
