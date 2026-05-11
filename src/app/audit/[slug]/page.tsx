/**
 * Public audit report page
 * Shareable, public-safe audit results
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerClient } from "@/lib/supabase";
import { getAuditBySlug } from "@/lib/audit/persistence";
import { SavingsHero } from "@/components/audit/savings-hero";
import { RecommendationCard } from "@/components/audit/recommendation-card";
import { NoIssuesState } from "@/components/audit/no-issues-state";
import { Container } from "@/components/layout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getServerClient();
  const audit = await getAuditBySlug(slug, supabase);
  
  if (!audit) {
    return {
      title: "Report Not Found - AIuditor",
    };
  }
  
  const savingsText = audit.savings.monthly > 0
    ? `$${audit.savings.monthly.toFixed(0)}/mo in potential savings`
    : "AI spend analysis";
  
  return {
    title: `AIuditor Report - ${savingsText}`,
    description: `AI spend optimization report with ${audit.recommendations.length} recommendations. Optimization score: ${audit.score.overall}/100.`,
    openGraph: {
      title: `AIuditor Report - ${savingsText}`,
      description: `AI spend optimization report with ${audit.recommendations.length} recommendations.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `AIuditor Report - ${savingsText}`,
      description: `AI spend optimization report with ${audit.recommendations.length} recommendations.`,
    },
  };
}

export default async function AuditReportPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = getServerClient();
  const audit = await getAuditBySlug(slug, supabase);
  
  if (!audit) {
    notFound();
  }
  
  const hasRecommendations = audit.recommendations.length > 0;
  const actionableRecommendations = audit.recommendations.filter(
    (rec) => rec.category !== "already_optimized"
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Container>
        <div className="py-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              AI Spend Audit Report
            </h1>
            <p className="text-lg text-gray-600">
              Generated on {new Date(audit.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          
          {/* Savings Hero */}
          <SavingsHero
            currentMonthly={audit.savings.monthly + (audit.savings.monthly / (1 - audit.savings.percentage / 100))}
            optimizedMonthly={audit.savings.monthly}
            monthlySavings={audit.savings.monthly}
            annualSavings={audit.savings.annual}
            savingsPercentage={audit.savings.percentage}
            optimizationScore={audit.score.overall}
            rating={audit.score.rating as "excellent" | "good" | "moderate" | "poor"}
          />
          
          {/* Tool Stack Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tool Stack Analyzed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {audit.toolStack.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {tool.toolName}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {tool.planName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tool.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommendations
              </h2>
              {actionableRecommendations.length > 0 && (
                <p className="text-gray-600">
                  {actionableRecommendations.length} optimization{" "}
                  {actionableRecommendations.length === 1 ? "opportunity" : "opportunities"}{" "}
                  identified
                </p>
              )}
            </div>
            
            {!hasRecommendations ? (
              <NoIssuesState score={audit.score.overall} />
            ) : (
              <div className="space-y-4">
                {audit.recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Footer CTA */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Want to optimize your AI spend?
            </h3>
            <p className="text-gray-600 mb-6">
              Run your own audit and get personalized recommendations
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Run Your Audit
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
