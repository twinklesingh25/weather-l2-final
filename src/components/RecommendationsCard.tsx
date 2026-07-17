/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlanningRecommendation } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Compass,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: PlanningRecommendation[];
}

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100 text-lg">Smart Planning Intelligence</h3>
          <p className="text-slate-400 text-xs">Actionable recommendations computed from meteorological data</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {recommendations.map((rec, idx) => {
          // Color scheme selection
          let bgClass = '';
          let borderClass = '';
          let textClass = '';
          let accentClass = '';
          let Icon = Info;

          switch (rec.type) {
            case 'danger':
              bgClass = 'bg-rose-500/5';
              borderClass = 'border-rose-500/20';
              textClass = 'text-rose-400';
              accentClass = 'bg-rose-500/10 text-rose-300';
              Icon = ShieldAlert;
              break;
            case 'warning':
              bgClass = 'bg-amber-500/5';
              borderClass = 'border-amber-500/20';
              textClass = 'text-amber-400';
              accentClass = 'bg-amber-500/10 text-amber-300';
              Icon = AlertTriangle;
              break;
            case 'success':
              bgClass = 'bg-emerald-500/5';
              borderClass = 'border-emerald-500/20';
              textClass = 'text-emerald-400';
              accentClass = 'bg-emerald-500/10 text-emerald-300';
              Icon = CheckCircle2;
              break;
            case 'info':
            default:
              bgClass = 'bg-blue-500/5';
              borderClass = 'border-blue-500/20';
              textClass = 'text-blue-400';
              accentClass = 'bg-blue-500/10 text-blue-300';
              Icon = Info;
              break;
          }

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${bgClass} ${borderClass} transition-all duration-300 hover:border-opacity-50`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${accentClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-100 text-sm flex items-center justify-between gap-2 flex-wrap">
                    <span>{rec.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-400 border border-slate-800">
                      {rec.activityLabel}
                    </span>
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Checklist of smart suggestions */}
                  <div className="mt-3 space-y-2 border-t border-slate-800/60 pt-2.5">
                    {rec.activities.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <ArrowRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${textClass}`} />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
