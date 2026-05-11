/**
 * Executive Summary Card - Premium Design
 * Warm gradient aesthetic with modern typography
 */

"use client";

import type { ExecutiveSummary } from "@/types/narrative";

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary;
}

export function ExecutiveSummaryCard({ summary }: ExecutiveSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-rose-400 to-pink-400 p-8 text-white shadow-xl">
      {/* Decorative dots pattern */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div>
          <div className="text-sm font-medium uppercase tracking-wider opacity-90 mb-2">
            Executive Summary
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            AI Spend Audit Report
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg leading-relaxed opacity-95">
            {summary.overallStatement}
          </p>
          
          {summary.savingsOverview && (
            <p className="text-base leading-relaxed opacity-90">
              {summary.savingsOverview}
            </p>
          )}
        </div>
        
        {/* Optimization Health Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <div className={`w-2 h-2 rounded-full ${
            summary.optimizationHealth === 'excellent' ? 'bg-green-300' :
            summary.optimizationHealth === 'good' ? 'bg-blue-300' :
            summary.optimizationHealth === 'moderate' ? 'bg-yellow-300' :
            'bg-red-300'
          }`} />
          <span className="text-sm font-medium capitalize">
            {summary.optimizationHealth} Health
          </span>
        </div>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
}
