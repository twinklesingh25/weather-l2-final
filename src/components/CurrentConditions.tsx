/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrentWeather, DailyWeather, getWeatherCondition } from '../types';
import { WeatherIcon } from './WeatherChart';
import {
  Wind,
  Droplets,
  CloudRain,
  Cloudy,
  Sun,
  Sunset,
  Sunrise,
  Compass,
  Gauge,
  ThermometerSun,
} from 'lucide-react';

interface CurrentConditionsProps {
  current: CurrentWeather;
  daily: DailyWeather;
  cityName: string;
  countryName?: string;
  adminRegion?: string;
}

export default function CurrentConditions({
  current,
  daily,
  cityName,
  countryName,
  adminRegion,
}: CurrentConditionsProps) {
  const condition = getWeatherCondition(current.weather_code);

  // Format sunrise and sunset times
  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '--:--';
    }
  };

  const sunriseTime = formatTime(daily.sunrise?.[0]);
  const sunsetTime = formatTime(daily.sunset?.[0]);
  const maxUv = daily.uv_index_max?.[0] ?? 0;

  // Determine UV rating description
  let uvLevel = 'Low';
  let uvColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (maxUv >= 3 && maxUv < 6) {
    uvLevel = 'Moderate';
    uvColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (maxUv >= 6 && maxUv < 8) {
    uvLevel = 'High';
    uvColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  } else if (maxUv >= 8) {
    uvLevel = 'Very High';
    uvColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  }

  // Calculate wind direction text
  const getWindDirectionStr = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return directions[index];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Visual Condition Block (Left or Top - 5 cols) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group">
        {/* Soft background light matching the weather type */}
        <div className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br ${condition.bgGradient} opacity-[0.12] blur-3xl rounded-full transition-all duration-500 group-hover:scale-110`}></div>

        <div>
          {/* City details */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full">
              Live Weather
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-2.5 truncate">{cityName}</h2>
            {adminRegion || countryName ? (
              <p className="text-slate-400 text-xs mt-0.5 truncate">
                {[adminRegion, countryName].filter(Boolean).join(', ')}
              </p>
            ) : null}
          </div>

          {/* Core Temperature section */}
          <div className="flex items-center gap-6 my-6">
            <div className={`p-4 bg-gradient-to-br ${condition.bgGradient} rounded-2xl shadow-xl shadow-slate-950/40 transform transition-transform group-hover:scale-105 duration-300`}>
              <WeatherIcon name={condition.iconName} className="w-12 h-12 text-white" />
            </div>
            <div>
              <div className="flex items-start">
                <span className="text-5xl font-black text-slate-50 font-mono tracking-tighter">
                  {Math.round(current.temperature_2m)}
                </span>
                <span className="text-xl font-bold text-slate-300 mt-0.5">°C</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-medium flex items-center gap-1">
                <ThermometerSun className="w-3.5 h-3.5 text-amber-500" />
                Feels like <strong className="text-slate-200">{Math.round(current.apparent_temperature)}°C</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Forecast metadata descriptions */}
        <div className="border-t border-slate-800/80 pt-4 mt-2">
          <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            {condition.label}
          </h4>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {condition.description}
          </p>
        </div>
      </div>

      {/* Bento Grid Metrics (Right or Bottom - 7 cols) */}
      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: Wind Speed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Wind Speed</span>
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-slate-100 font-mono">
              {current.wind_speed_10m} <span className="text-xs text-slate-500 font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-sky-400 animate-spin-slow" />
              <span>
                {current.wind_direction_10m}° {getWindDirectionStr(current.wind_direction_10m)}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Relative Humidity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Humidity</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-slate-100 font-mono">
              {current.relative_humidity_2m}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {current.relative_humidity_2m > 60 ? 'Humid air' : current.relative_humidity_2m < 30 ? 'Dry air' : 'Comfortable'}
            </div>
          </div>
        </div>

        {/* Metric 3: Precipitation amount */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Precipitation</span>
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-slate-100 font-mono">
              {current.precipitation} <span className="text-xs text-slate-500 font-normal">mm</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {current.precipitation > 0 ? 'Rain active' : 'No rain observed'}
            </div>
          </div>
        </div>

        {/* Metric 4: Cloud Cover */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Cloud Cover</span>
            <div className="p-1.5 bg-slate-500/10 text-slate-400 rounded-lg">
              <Cloudy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-slate-100 font-mono">
              {current.cloud_cover}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {current.cloud_cover > 75 ? 'Cloudy' : current.cloud_cover > 25 ? 'Partly cloudy' : 'Mostly clear'}
            </div>
          </div>
        </div>

        {/* Metric 5: UV Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Max UV Index</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-slate-100 font-mono">
              {maxUv.toFixed(1)}
            </div>
            <div className={`text-[9px] font-semibold mt-1 px-1.5 py-0.5 rounded border inline-block ${uvColor}`}>
              {uvLevel}
            </div>
          </div>
        </div>

        {/* Metric 6: Sun Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Sun Cycle</span>
            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <Sunset className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Rise:
              </span>
              <span className="text-slate-300 font-bold">{sunriseTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-rose-400" /> Set:
              </span>
              <span className="text-slate-300 font-bold">{sunsetTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
