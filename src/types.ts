/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeocodingCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  timezone: string;
  country?: string;
  admin1?: string;
  admin2?: string;
}

export interface GeocodingResponse {
  results?: GeocodingCity[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    [key: string]: string;
  };
  current: CurrentWeather;
  daily_units: {
    [key: string]: string;
  };
  daily: DailyWeather;
}

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: string; // Corresponding Lucide icon name
  bgGradient: string; // Tailwind background gradient for detail card
  category: 'clear' | 'cloudy' | 'foggy' | 'drizzle' | 'rainy' | 'snowy' | 'stormy';
}

export const WEATHER_CODES: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Perfectly clear blue skies.',
    iconName: 'Sun',
    bgGradient: 'from-amber-400 to-orange-500',
    category: 'clear',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly clear, with a few light clouds.',
    iconName: 'SunDim',
    bgGradient: 'from-amber-300 to-orange-400',
    category: 'clear',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds, comfortable conditions.',
    iconName: 'CloudSun',
    bgGradient: 'from-sky-400 to-blue-500',
    category: 'cloudy',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Gray, heavily overcast skies.',
    iconName: 'Cloud',
    bgGradient: 'from-slate-400 to-slate-500',
    category: 'cloudy',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Thick fog reducing visibility.',
    iconName: 'CloudFog',
    bgGradient: 'from-zinc-400 to-slate-500',
    category: 'foggy',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog depositing ice rime.',
    iconName: 'CloudFog',
    bgGradient: 'from-zinc-500 to-slate-600',
    category: 'foggy',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Very light, fine rain drizzle.',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-300 to-sky-500',
    category: 'drizzle',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady light drizzle rain.',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-400 to-sky-600',
    category: 'drizzle',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Thick, heavy misting drizzle.',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-500 to-indigo-600',
    category: 'drizzle',
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Light freezing drizzle creating slick roads.',
    iconName: 'CloudSnow',
    bgGradient: 'from-blue-300 to-cyan-500',
    category: 'snowy',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle, risk of ice glaze.',
    iconName: 'CloudSnow',
    bgGradient: 'from-blue-400 to-cyan-600',
    category: 'snowy',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light rain, perfect for indoor plans.',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-400 to-indigo-500',
    category: 'rainy',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady rainfall. Don\'t forget an umbrella!',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-500 to-indigo-600',
    category: 'rainy',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Torrential downpour. Best to stay indoors.',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-600 to-indigo-800',
    category: 'rainy',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Light freezing rain, hazard of immediate icing.',
    iconName: 'CloudSnow',
    bgGradient: 'from-blue-400 to-teal-600',
    category: 'snowy',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Heavy freezing rain, dangerous icy roads.',
    iconName: 'CloudSnow',
    bgGradient: 'from-blue-600 to-teal-800',
    category: 'snowy',
  },
  71: {
    code: 71,
    label: 'Slight Snowfall',
    description: 'Light dusting of snow, magical view.',
    iconName: 'Snowflake',
    bgGradient: 'from-sky-300 to-blue-500',
    category: 'snowy',
  },
  73: {
    code: 73,
    label: 'Moderate Snowfall',
    description: 'Steady snow accumulating on the ground.',
    iconName: 'Snowflake',
    bgGradient: 'from-sky-400 to-blue-600',
    category: 'snowy',
  },
  75: {
    code: 75,
    label: 'Heavy Snowfall',
    description: 'Heavy winter snowstorm, dress very warmly.',
    iconName: 'Snowflake',
    bgGradient: 'from-sky-500 to-indigo-700',
    category: 'snowy',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Frozen ice grains or tiny snow-pellets.',
    iconName: 'Snowflake',
    bgGradient: 'from-slate-300 to-slate-500',
    category: 'snowy',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Passing light showers with sunny breaks.',
    iconName: 'CloudSunRain',
    bgGradient: 'from-cyan-400 to-indigo-500',
    category: 'rainy',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Intermittent moderate showers.',
    iconName: 'CloudRain',
    bgGradient: 'from-cyan-500 to-indigo-600',
    category: 'rainy',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden, severe rain showers.',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-600 to-indigo-900',
    category: 'rainy',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Brief, light snow flurries.',
    iconName: 'CloudSnow',
    bgGradient: 'from-sky-300 to-slate-500',
    category: 'snowy',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Sudden heavy snow squalls.',
    iconName: 'CloudSnow',
    bgGradient: 'from-sky-400 to-slate-600',
    category: 'snowy',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunderstorm with lightning and thunder.',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-600 to-slate-900',
    category: 'stormy',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Severe storm with hail pellets.',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-700 to-slate-900',
    category: 'stormy',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    description: 'Dangerous storm with damaging hail.',
    iconName: 'CloudLightning',
    bgGradient: 'from-violet-800 to-zinc-900',
    category: 'stormy',
  },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return (
    WEATHER_CODES[code] || {
      code,
      label: 'Unknown',
      description: 'Unknown weather conditions.',
      iconName: 'HelpCircle',
      bgGradient: 'from-slate-400 to-slate-600',
      category: 'clear',
    }
  );
}

export interface PlanningRecommendation {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  activityLabel: string;
  activities: string[];
}
