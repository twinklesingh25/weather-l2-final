/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentWeather, DailyWeather, PlanningRecommendation, getWeatherCondition } from '../types';

export function generateRecommendations(
  current: CurrentWeather,
  daily: DailyWeather
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];
  const currentCondition = getWeatherCondition(current.weather_code);

  // 1. Extreme Weather Alert
  if ([95, 96, 99].includes(current.weather_code)) {
    recommendations.push({
      type: 'danger',
      title: 'Thunderstorm Active',
      description: 'Lightning, thunder, and potential hail are present in your area.',
      activityLabel: 'Safety Advisory',
      activities: [
        'Stay indoors and avoid using wired electrical appliances.',
        'If outside, seek low ground or shelter inside a hardtop vehicle.',
        'Postpone outdoor sports, swimming, or hiking activities.',
      ],
    });
  } else if (current.precipitation > 0 || [61, 63, 65, 80, 81, 82].includes(current.weather_code)) {
    recommendations.push({
      type: 'warning',
      title: 'Rain or Showers Detected',
      description: 'Wet conditions are active. Precipitation will impact outdoor plans.',
      activityLabel: 'Rain gear required',
      activities: [
        'Bring a reliable umbrella or wear a hooded rain jacket.',
        'Choose water-resistant footwear with good grip.',
        'Opt for indoor alternatives like visiting a museum, cafe, or library.',
      ],
    });
  } else if ([71, 73, 75, 85, 86].includes(current.weather_code)) {
    recommendations.push({
      type: 'info',
      title: 'Winter Wonderland',
      description: 'Snow is falling! Beautiful but cold and slippery conditions.',
      activityLabel: 'Winter Preparedness',
      activities: [
        'Wear insulated, waterproof boots with thick socks.',
        'Be cautious of black ice on walkways, stairs, and roads.',
        'Perfect day for drinking hot chocolate or building a snowman!',
      ],
    } as PlanningRecommendation);
  } else if ([45, 48].includes(current.weather_code)) {
    recommendations.push({
      type: 'warning',
      title: 'Foggy & Low Visibility',
      description: 'Dense fog may cause travel delays and limit views.',
      activityLabel: 'Commute Caution',
      activities: [
        'Use low-beam headlights if driving (do not use high beams).',
        'Maintain extra distance from other vehicles on the road.',
        'Reconsider scenic viewing activities or drone flights.',
      ],
    });
  }

  // 2. Temperature-based advice
  const temp = current.temperature_2m;
  if (temp < 5) {
    recommendations.push({
      type: 'danger',
      title: 'Freezing Cold Conditions',
      description: `Temperature is a freezing ${temp}°C. Frostbite risk on prolonged exposure.`,
      activityLabel: 'Layer Up Heavily',
      activities: [
        'Wear thermal inner layers, a heavy down jacket, and windproof outer layers.',
        'Protect your hands and ears with insulated gloves and a thick beanie.',
        'Keep pets indoors and check pipes to prevent freezing.',
      ],
    });
  } else if (temp >= 5 && temp < 15) {
    recommendations.push({
      type: 'info',
      title: 'Brisk & Chilly Weather',
      description: `Cool air is active (${temp}°C). Perfect for keeping active.`,
      activityLabel: 'Chilly Outfit Suggestion',
      activities: [
        'Dress in layers: a comfortable long-sleeve, sweater, and a light jacket.',
        'Excellent weather for a brisk jog or hiking — you will heat up quickly!',
        'Keep a scarf handy, especially if the wind gusts are strong.',
      ],
    });
  } else if (temp >= 15 && temp <= 25) {
    // If it's clear and comfortable, highly positive recommendations!
    if (['clear', 'cloudy'].includes(currentCondition.category) && current.precipitation === 0) {
      recommendations.push({
        type: 'success',
        title: 'Perfect Outdoor Weather',
        description: `Delightful and comfortable temperature of ${temp}°C with dry conditions.`,
        activityLabel: 'Highly Recommended Activities',
        activities: [
          'Excellent day for a park picnic, outdoor dining, or cycling.',
          'Open your windows at home to let in fresh, temperate air.',
          'Wear lightweight clothes: a T-shirt, shorts, or light trousers.',
        ],
      });
    } else {
      recommendations.push({
        type: 'success',
        title: 'Comfortable & Mild',
        description: `Mild temperatures around ${temp}°C are great for general daily routines.`,
        activityLabel: 'General Outing Advice',
        activities: [
          'A simple t-shirt or light shirt is perfect, but carry a backup layer.',
          'Great time to run errands or walk around town.',
        ],
      });
    }
  } else if (temp > 25) {
    recommendations.push({
      type: 'warning',
      title: 'Warm / Hot Conditions',
      description: `High heat is active at ${temp}°C. Hydration is key.`,
      activityLabel: 'Cooling Strategies',
      activities: [
        'Drink water regularly, even if you do not feel thirsty.',
        'Wear loose, light-colored, breathable clothing (e.g. linen, cotton).',
        'Avoid intense physical workouts outdoors during peak sun hours (11 AM - 3 PM).',
      ],
    });
  }

  // 3. UV Index Alert (based on today's maximum UV)
  const maxUv = daily.uv_index_max?.[0];
  if (maxUv !== undefined && maxUv >= 6) {
    recommendations.push({
      type: 'warning',
      title: `High UV Index Alert (${maxUv.toFixed(1)})`,
      description: 'Sunburn can occur in under 20 minutes. Protect your skin.',
      activityLabel: 'Sun Protection Plan',
      activities: [
        'Apply broad-spectrum SPF 30+ sunscreen 15 minutes before going outside.',
        'Wear UV-blocking sunglasses and a wide-brimmed sun hat.',
        'Seek shade where possible, especially in the middle of the day.',
      ],
    });
  }

  // 4. High Winds
  if (current.wind_speed_10m > 25) {
    recommendations.push({
      type: 'warning',
      title: 'Gusty & Windy Conditions',
      description: `Winds are blowing at ${current.wind_speed_10m} km/h.`,
      activityLabel: 'Wind Protection',
      activities: [
        'Secure loose patio furniture, plants, or balcony items.',
        'Watch for falling tree branches or windblown debris.',
        'If cycling or driving a high-profile vehicle, prepare for crosswinds.',
      ],
    });
  }

  // Fallback if empty
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      title: 'Stable Weather Ahead',
      description: 'No severe parameters or extreme conditions are forecast.',
      activityLabel: 'Planning Tips',
      activities: [
        'Proceed with standard outdoor and indoor plans.',
        'Keep an eye on regional variations if traveling.',
      ],
    });
  }

  return recommendations;
}
