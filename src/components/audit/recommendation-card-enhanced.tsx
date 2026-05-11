/**
 * Enhanced Recommendation Card with Narrative Engine Details
 * Shows layered explanations, workflow risk, implementation complexity, and simulations
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecommendationNarrative } from "@/types/narrative";

interface RecommendationCardEnhancedProps {
  narrative: RecommendationNarrative;
  index: number;
}

export function RecommendationCardEnhanced({ 
  narrative, 
  index 
}: RecommendationCardEnhancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { recommendation, explanations, workflowRisk, implementationComplexity, simulation } = narrative;
  
  // Determine severity color
  const severityColors = {
    high: "border-red-200 bg-red-50",
    medium: "border-amber-200 bg-amber-50",
    low: "border-blue-200 bg-blue-50",
  };
  
  const severityBadgeColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-blue-100 text-blue-700",
  };
  
  // Risk icons
  const riskIcons = {
    none: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    low: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
    medium: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    high: <AlertTriangle className="w-4 h-4 text-red-600" />,
  };
  
  return (
    <div className="card-premium p-6 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 text-white text-sm font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="text-xl font-bold text-gray-900">
              {recommendation.title}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityBadgeColors[recommendation.severity]}`}>
              {recommendation.severity}
            </span>
          </div>
          
          {/* Concise Explanation */}
          <p className="text-gray-700 mb-4 text-base leading-relaxed">
            {explanations.concise}
          </p>
          
          {/* Key Metrics */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Savings:</span>
              <span className="font-bold text-xl gradient-text">
                ${recommendation.savings.monthly}/mo
              </span>
              <span className="text-gray-500">($${recommendation.savings.annual}/yr)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-bold text-gray-900">
                {(recommendation.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              {riskIcons[workflowRisk]}
              <span className="text-gray-600">Risk:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {workflowRisk}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expand/Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-gray-700 hover:text-gray-900"
      >
        <span className="text-sm font-medium">
          {isExpanded ? "Hide Details" : "Show Full Analysis"}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
          {/* Executive Explanation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Executive Summary
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {explanations.executive}
            </p>
          </div>
          
          {/* Detailed Explanation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Detailed Analysis
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {explanations.detailed}
            </p>
          </div>
          
          {/* Before/After Simulation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Before & After
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current State */}
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Current
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  {simulation.currentState.description}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${simulation.currentState.monthlySpend.toFixed(2)}/mo
                </div>
              </div>
              
              {/* Optimized State */}
              <div>
                <div className="text-xs font-medium text-green-600 uppercase mb-1">
                  Optimized
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  {simulation.optimizedState.description}
                </div>
                <div className="text-lg font-semibold text-green-700">
                  ${simulation.optimizedState.monthlySpend.toFixed(2)}/mo
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capability Retention:</span>
                <span className={`font-medium ${
                  simulation.capabilityRetention === 'high' ? 'text-green-700' :
                  simulation.capabilityRetention === 'medium' ? 'text-amber-700' :
                  'text-gray-700'
                }`}>
                  {simulation.capabilityRetention.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Workflow Risk Assessment */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              {riskIcons[workflowRisk]}
              Workflow Risk Assessment
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {narrative.workflowRiskExplanation}
            </p>
          </div>
          
          {/* Implementation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Implementation
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Complexity:</span>
                <span className={`font-medium ${
                  implementationComplexity === 'easy' ? 'text-green-700' :
                  implementationComplexity === 'moderate' ? 'text-amber-700' :
                  'text-red-700'
                }`}>
                  {implementationComplexity.toUpperCase()}
                </span>
              </div>
              
              {narrative.implementationSteps && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Steps:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {narrative.implementationSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
          
          {/* Tradeoffs */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Tradeoff Assessment
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {narrative.tradeoffAssessment}
            </p>
          </div>
          
          {/* Confidence Explanation */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Confidence: {(recommendation.confidence * 100).toFixed(0)}%
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {narrative.confidenceExplanation}
            </p>
          </div>
          
          {/* Technical Details (Collapsible) */}
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="leading-relaxed">{explanations.technical}</p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div><strong>Detection:</strong> {narrative.detectionReason}</div>
                <div className="mt-1"><strong>Evaluation:</strong> {narrative.evaluationMethod}</div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
