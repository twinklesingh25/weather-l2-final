/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyWeather, getWeatherCondition } from '../types';
import { CloudRain, Sun, Calendar } from 'lucide-react';

interface WeatherChartProps {
  daily: DailyWeather;
  timezone: string;
}

export default function WeatherChart({ daily, timezone }: WeatherChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const daysCount = daily.time.length;
  if (daysCount === 0) return null;

  // Formatting dates to day names (Mon, Tue, etc.) and short dates (Jul 17)
  const formattedDates = daily.time.map((t) => {
    const d = new Date(t);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone });
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: timezone });
    return { dayName, shortDate };
  });

  // Calculate SVG scale constraints
  const tempsMax = daily.temperature_2m_max;
  const tempsMin = daily.temperature_2m_min;
  const highestTemp = Math.max(...tempsMax);
  const lowestTemp = Math.min(...tempsMin);

  // Pad the bounds slightly to prevent clipping
  const yMax = Math.ceil(highestTemp + 2);
  const yMin = Math.floor(lowestTemp - 2);
  const yRange = yMax - yMin || 1;

  // Chart layout configuration
  const width = 600;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Helper to map index to X coordinate
  const getX = (index: number) => {
    return paddingLeft + (index / (daysCount - 1)) * chartWidth;
  };

  // Helper to map temperature to Y coordinate
  const getY = (temp: number) => {
    return paddingTop + chartHeight - ((temp - yMin) / yRange) * chartHeight;
  };

  // Build line paths for Max Temps
  const maxPoints = tempsMax.map((temp, i) => `${getX(i)},${getY(temp)}`);
  const maxPath = `M ${maxPoints.join(' L ')}`;

  // Build line paths for Min Temps
  const minPoints = tempsMin.map((temp, i) => `${getX(i)},${getY(temp)}`);
  const minPath = `M ${minPoints.join(' L ')}`;

  // Area path under high temperatures for a sleek filled gradient
  const areaPath = `
    ${maxPath}
    L ${getX(daysCount - 1)},${paddingTop + chartHeight}
    L ${getX(0)},${paddingTop + chartHeight}
    Z
  `;

  // Draw 4 horizontal grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const value = yMin + (i / (gridLinesCount - 1)) * yRange;
    return {
      y: getY(value),
      value: Math.round(value),
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-lg">7-Day Outlook</h3>
            <p className="text-slate-400 text-xs">Interactive temperature and rain visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-300">Day High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
            <span className="text-slate-300">Night Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/40 inline-block"></span>
            <span className="text-slate-300">Precipitation %</span>
          </div>
        </div>
      </div>

      {/* Primary SVG Chart */}
      <div className="relative w-full overflow-hidden mb-6" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx} className="opacity-40">
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={width - paddingRight}
                y2={line.y}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={paddingLeft - 8}
                y={line.y + 4}
                textAnchor="end"
                className="fill-slate-400 font-mono text-[10px]"
              >
                {line.value}°
              </text>
            </g>
          ))}

          {/* Rain probability bars (Background visual) */}
          {daily.precipitation_probability_max?.map((prob, i) => {
            const barWidth = 14;
            const barHeight = (prob / 100) * (chartHeight * 0.7); // scale max prob to 70% of chart height
            const x = getX(i) - barWidth / 2;
            const y = paddingTop + chartHeight - barHeight;
            const isHovered = hoveredIndex === i;

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="3"
                className="transition-all duration-200"
                fill={isHovered ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.2)'}
              />
            );
          })}

          {/* Highlight Column on Hover */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={paddingTop + chartHeight}
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              className="pointer-events-none"
            />
          )}

          {/* Area under Max High curve */}
          <path d={areaPath} fill="url(#areaGrad)" className="pointer-events-none" />

          {/* Max High Line */}
          <path
            d={maxPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            className="pointer-events-none"
          />

          {/* Min Low Line */}
          <path
            d={minPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="3,2"
            strokeLinecap="round"
            className="pointer-events-none opacity-80"
          />

          {/* Max High Interactive circles */}
          {tempsMax.map((temp, i) => (
            <circle
              key={`max-${i}`}
              cx={getX(i)}
              cy={getY(temp)}
              r={hoveredIndex === i ? 6 : 4.5}
              className="transition-all duration-150 cursor-pointer"
              fill="#f59e0b"
              stroke="#0f172a"
              strokeWidth="2"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* Min Low Interactive circles */}
          {tempsMin.map((temp, i) => (
            <circle
              key={`min-${i}`}
              cx={getX(i)}
              cy={getY(temp)}
              r={hoveredIndex === i ? 5.5 : 4}
              className="transition-all duration-150 cursor-pointer"
              fill="#38bdf8"
              stroke="#0f172a"
              strokeWidth="2"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* X Axis Labels */}
          {formattedDates.map((date, i) => (
            <g key={i} className="text-[11px] font-medium">
              <text
                x={getX(i)}
                y={paddingTop + chartHeight + 16}
                textAnchor="middle"
                className={`${hoveredIndex === i ? 'fill-slate-100 font-bold' : 'fill-slate-400'}`}
              >
                {date.dayName}
              </text>
              <text
                x={getX(i)}
                y={paddingTop + chartHeight + 28}
                textAnchor="middle"
                className="fill-slate-500 text-[9px] font-mono"
              >
                {date.shortDate}
              </text>
            </g>
          ))}

          {/* Invisible interactive vertical columns for smooth hovering */}
          {Array.from({ length: daysCount }).map((_, i) => {
            const colWidth = chartWidth / (daysCount - 1);
            const x = getX(i) - colWidth / 2;
            return (
              <rect
                key={`hit-${i}`}
                x={x}
                y={paddingTop}
                width={colWidth}
                height={chartHeight + 35}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Hover details overlay inside chart area */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-1 pointer-events-none bg-slate-950/95 border border-slate-700/80 rounded-lg p-2.5 shadow-xl text-xs z-20 flex flex-col gap-1 text-slate-200 transition-all duration-100"
            style={{
              left: `${Math.min(
                Math.max(10, (hoveredIndex / (daysCount - 1)) * 100 - 15),
                70
              )}%`,
            }}
          >
            <div className="font-semibold text-indigo-300 border-b border-slate-800 pb-1 flex justify-between items-center gap-4">
              <span>{formattedDates[hoveredIndex].dayName}, {formattedDates[hoveredIndex].shortDate}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {getWeatherCondition(daily.weather_code[hoveredIndex]).label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono pt-1">
              <span className="text-slate-400">High:</span>
              <span className="text-amber-400 font-bold text-right">{tempsMax[hoveredIndex]}°C</span>
              <span className="text-slate-400">Low:</span>
              <span className="text-sky-400 font-bold text-right">{tempsMin[hoveredIndex]}°C</span>
              <span className="text-slate-400">Rain Prob:</span>
              <span className="text-blue-400 font-bold text-right">
                {daily.precipitation_probability_max?.[hoveredIndex] ?? 0}%
              </span>
              <span className="text-slate-400">Wind Gusts:</span>
              <span className="text-indigo-400 font-bold text-right">
                {daily.wind_speed_10m_max?.[hoveredIndex] ?? 0} km/h
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Horizontal list cards for detailed weather codes */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2 border-t border-slate-800/80">
        {Array.from({ length: daysCount }).map((_, i) => {
          const condition = getWeatherCondition(daily.weather_code[i]);
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'bg-slate-800/60 border-indigo-500/50 scale-[1.03] shadow-md shadow-indigo-500/5'
                  : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/20 hover:border-slate-800'
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-slate-400 text-[10px] font-semibold">{formattedDates[i].dayName}</span>
              <div className="my-1.5 p-1 bg-slate-950/40 rounded-lg">
                <WeatherIcon name={condition.iconName} className="w-5 h-5 text-slate-200" />
              </div>
              <span className="text-slate-200 text-xs font-bold font-mono">
                {Math.round(tempsMax[i])}°
              </span>
              <span className="text-slate-500 text-[10px] font-mono">
                {Math.round(tempsMin[i])}°
              </span>
              {daily.precipitation_probability_max && daily.precipitation_probability_max[i] > 10 && (
                <div className="flex items-center gap-0.5 text-[8px] text-blue-400 font-semibold mt-1">
                  <CloudRain className="w-2 h-2" />
                  <span>{daily.precipitation_probability_max[i]}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Inline Icon Switch to load standard Lucide icons cleanly
import * as LucideIcons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
}

export function WeatherIcon({ name, className = 'w-6 h-6' }: WeatherIconProps) {
  // Safe lookup for icon name in Lucide
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <Sun className={className} />;
  }
  return <IconComponent className={className} />;
}
