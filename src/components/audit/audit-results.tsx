"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsHero } from "./savings-hero";
import { RecommendationCard } from "./recommendation-card";
import { RecommendationCardEnhanced } from "./recommendation-card-enhanced";
import { NoIssuesState } from "./no-issues-state";
import { LeadCapture } from "@/components/forms/lead-capture";
import type { AuditResult } from "@/types";
import type { ExecutiveAuditReport } from "@/types/narrative";
import { Share2, CheckCircle2, AlertCircle, Copy } from "lucide-react";

interface AuditResultsProps {
  result: AuditResult;
  narrative?: ExecutiveAuditReport;
  onReset: () => void;
}

export function AuditResults({ result, narrative, onReset }: AuditResultsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedReport, setSavedReport] = useState<{
    slug: string;
    id: string;
    reportUrl: string;
  } | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const actionableRecommendations = result.recommendations.filter(
    (r) => r.category !== "already_optimized"
  );
  const hasActionableRecommendations = actionableRecommendations.length > 0;
  
  const handleSaveReport = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save report");
      }
      
      const data = await response.json();
      setSavedReport(data);
      setShowLeadCapture(true);
      
    } catch (error) {
      console.error("Save error:", error);
      setSaveError("Failed to save report. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopyLink = async () => {
    if (!savedReport) return;
    
    try {
      await navigator.clipboard.writeText(savedReport.reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary with Premium Gradient */}
      {narrative && (
        <div className="card-gradient p-10 relative overflow-hidden">
          {/* Decorative dots pattern */}
          <div className="absolute top-6 right-6 opacity-20">
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-90 mb-3">
                Executive Summary
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                AI Spend Audit Report
              </h2>
            </div>
            
            <p className="text-lg leading-relaxed opacity-95 max-w-3xl">
              {narrative.executiveSummary.overallStatement}
            </p>
            
            {narrative.operationalObservations.length > 0 && (
              <div className="pt-6 border-t border-white/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">
                  Key Observations
                </h3>
                <ul className="space-y-3">
                  {narrative.operationalObservations.slice(0, 3).map((obs, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90">
                      <span className="text-white/60 mt-1.5">•</span>
                      <span className="text-base leading-relaxed">{obs.observation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Optimization Health Badge */}
            <div className="flex items-center gap-3 pt-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  narrative.executiveSummary.optimizationHealth === 'excellent' ? 'bg-green-300' :
                  narrative.executiveSummary.optimizationHealth === 'good' ? 'bg-blue-300' :
                  narrative.executiveSummary.optimizationHealth === 'moderate' ? 'bg-yellow-300' :
                  'bg-red-300'
                }`} />
                <span className="text-sm font-semibold capitalize">
                  {narrative.executiveSummary.optimizationHealth} Health
                </span>
              </div>
            </div>
          </div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Savings Hero - Updated Design */}
      <div className="card-premium p-8">
        <SavingsHero
          currentMonthly={result.savings.current.monthly}
          optimizedMonthly={result.savings.optimized.monthly}
          monthlySavings={result.savings.savings.monthly}
          annualSavings={result.savings.savings.annual}
          savingsPercentage={result.savings.savings.percentage}
          optimizationScore={result.score.overall}
          rating={result.score.rating}
        />
      </div>

      {/* Overlap Analysis */}
      {narrative && narrative.overlapNarratives.length > 0 && (
        <div className="card-premium p-8 border-l-4 border-amber-400">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tool Overlap Analysis</h2>
          {narrative.overlapNarratives.map((overlap, i) => (
            <div key={i} className="space-y-4">
              <p className="text-gray-800 text-lg leading-relaxed">{overlap.summary}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="font-semibold text-gray-900">
                  Severity: <span className="gradient-text">{overlap.severity}</span>
                </span>
                <span className="font-semibold text-gray-900">
                  Assessment: <span className="text-amber-600">{overlap.justification}</span>
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{overlap.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Section */}
      <div className="card-premium p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Recommendations</h2>
            <p className="text-gray-600 mt-1">
              {hasActionableRecommendations
                ? `${actionableRecommendations.length} optimization ${
                    actionableRecommendations.length === 1
                      ? "opportunity"
                      : "opportunities"
                  } identified`
                : "No major optimization opportunities found"}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onReset}
            className="rounded-xl border-orange-200 hover:bg-orange-50"
          >
            New Audit
          </Button>
        </div>

        {hasActionableRecommendations ? (
          <div className="space-y-6">
            {narrative ? (
              // Enhanced recommendations with narrative
              narrative.recommendationNarratives
                .filter(rn => rn.recommendation.category !== "already_optimized")
                .map((recNarrative, i) => (
                  <RecommendationCardEnhanced
                    key={recNarrative.recommendation.id}
                    narrative={recNarrative}
                    index={i}
                  />
                ))
            ) : (
              // Fallback to basic recommendations
              actionableRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            )}
          </div>
        ) : (
          <NoIssuesState score={result.score.overall} />
        )}
      </div>
      
      {/* Final Operational Assessment */}
      {narrative && (
        <div className="card-premium p-8 bg-gradient-to-br from-gray-50 to-orange-50/30">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Assessment</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Overall Conclusion
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {narrative.operationalAssessment.overallConclusion}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Confidence Statement
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {narrative.operationalAssessment.confidenceStatement}
              </p>
            </div>
            
            {narrative.operationalAssessment.nextSteps && narrative.operationalAssessment.nextSteps.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Recommended Next Steps
                </h3>
                <ol className="space-y-2">
                  {narrative.operationalAssessment.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Save & Share Section */}
      {!savedReport && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Save & Share This Report
            </h3>
            <p className="text-gray-600">
              Get a shareable link to discuss with your team
            </p>
          </div>
          
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={handleSaveReport}
              disabled={isSaving}
              size="lg"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save & Get Shareable Link"}
            </Button>
          </div>
        </div>
      )}
      
      {/* Saved Report Success */}
      {savedReport && !showLeadCapture && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Report Saved Successfully
                </h3>
                <p className="text-gray-600">
                  Your report is now accessible via this shareable link:
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={savedReport.reportUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                onClick={() => setShowLeadCapture(true)}
                variant="default"
                className="w-full sm:w-auto"
              >
                Email Me This Report
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lead Capture */}
      {savedReport && showLeadCapture && (
        <LeadCapture
          auditId={savedReport.id}
          reportUrl={savedReport.reportUrl}
          monthlySavings={result.savings.savings.monthly}
          annualSavings={result.savings.savings.annual}
          optimizationScore={result.score.overall}
        />
      )}

      {/* Audit Metadata */}
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Audit completed on {new Date(result.auditedAt).toLocaleDateString()} •
          Engine v{result.version} • {result.input.tools.length} tools analyzed
        </p>
      </div>
    </div>
  );
}
