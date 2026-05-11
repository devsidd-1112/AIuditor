"use client";

import { useState } from "react";
import { Navbar, Container, Footer } from "@/components/layout";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditForm } from "@/components/forms/audit-form";
import { AuditResults } from "@/components/audit/audit-results";
import { FormErrorBoundary, AuditErrorBoundary } from "@/components/error-boundary";
import { runAudit } from "@/lib/audit/engine";
import { generateExecutiveAuditReport } from "@/lib/audit/narrative";
import type { AuditInput, AuditResult } from "@/types";
import type { ExecutiveAuditReport } from "@/types/narrative";

const SUPPORTED_TOOLS = ["ChatGPT", "Claude", "Cursor", "Gemini", "Copilot"];

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [narrativeReport, setNarrativeReport] = useState<ExecutiveAuditReport | null>(null);

  const handleStartAudit = () => {
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleAuditSubmit = (input: AuditInput) => {
    setIsLoading(true);
    
    // Simulate brief loading for better UX
    setTimeout(() => {
      try {
        // Run V2 audit
        const result = runAudit(input);
        
        // Generate narrative report
        const narrative = generateExecutiveAuditReport(result);
        
        setAuditResult(result);
        setNarrativeReport(narrative);
        setIsLoading(false);
        
        // Scroll to results
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Audit error:", error);
        setIsLoading(false);
        alert("An error occurred during the audit. Please try again.");
      }
    }, 800);
  };

  const handleReset = () => {
    setAuditResult(null);
    setNarrativeReport(null);
    setShowForm(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleNewAudit = () => {
    setAuditResult(null);
    setNarrativeReport(null);
    setShowForm(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      <Navbar />

      <main id="main-content" className="flex-1 pt-14" tabIndex={-1}>
        {!showForm && !auditResult && (
          /* Hero Section - Premium Gradient Design */
          <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-rose-300/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl" />
            
            <Container>
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-rose-100 px-4 py-2 text-sm font-medium text-orange-900 border border-orange-200/50">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500" />
                  AI Spend Optimization Platform
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl mb-6">
                  <span className="gradient-text">Stop Overpaying</span>
                  <br />
                  <span className="text-gray-900">for AI Tools</span>
                </h1>

                <p className="mt-6 max-w-2xl mx-auto text-xl leading-relaxed text-gray-700">
                  Get a professional audit of your AI stack and uncover hidden savings in under 60 seconds.
                </p>

                {/* CTA */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleStartAudit}
                    className="gradient-warm text-white hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-xl shadow-xl shadow-orange-200/50"
                  >
                    Start Free Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    No credit card • No signup • 100% free
                  </span>
                </div>

                {/* Supported Tools */}
                <div className="mt-24">
                  <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
                    Supported AI Tools
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {SUPPORTED_TOOLS.map((tool) => (
                      <div
                        key={tool}
                        className="rounded-xl bg-white/80 backdrop-blur-sm border border-orange-100/50 px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {showForm && !auditResult && (
          /* Audit Form Section - Premium Design */
          <section className="py-16 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-rose-200/20 rounded-full blur-3xl" />
            
            <Container>
              <div className="relative z-10 mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Audit Your AI Stack</span>
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Enter your current AI tools and spending to get personalized, actionable recommendations
                  </p>
                </div>
                
                <div className="card-premium p-8">
                  <FormErrorBoundary>
                    <AuditForm onSubmit={handleAuditSubmit} isLoading={isLoading} />
                  </FormErrorBoundary>
                </div>
              </div>
            </Container>
          </section>
        )}

        {auditResult && narrativeReport && (
          /* Results Section - Premium Design */
          <section className="py-16 relative">
            {/* Background decoration */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />
            
            <Container>
              <div className="relative z-10 mx-auto max-w-6xl">
                <AuditErrorBoundary>
                  <AuditResults 
                    result={auditResult} 
                    narrative={narrativeReport}
                    onReset={handleReset} 
                  />
                </AuditErrorBoundary>
                <div className="mt-10 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleNewAudit}
                    className="rounded-xl border-orange-200 hover:bg-orange-50"
                  >
                    Start New Audit
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
