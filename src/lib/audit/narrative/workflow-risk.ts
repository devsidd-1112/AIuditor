/**
 * Workflow Risk Assessment Engine
 * Evaluates operational disruption potential for each recommendation
 * Conservative, realistic risk assessment
 */

import type { Recommendation } from "@/types/audit";
import type { WorkflowRisk, ImplementationComplexity } from "@/types/narrative";

/**
 * Assess workflow risk for a recommendation
 */
export function assessWorkflowRisk(rec: Recommendation): {
  risk: WorkflowRisk;
  explanation: string;
} {
  // Use metadata if available
  if (rec.metadata?.workflowRisk) {
    return {
      risk: rec.metadata.workflowRisk as WorkflowRisk,
      explanation: generateRiskExplanation(rec, rec.metadata.workflowRisk as WorkflowRisk),
    };
  }
  
  // Otherwise, infer from category and confidence
  const risk = inferWorkflowRisk(rec);
  return {
    risk,
    explanation: generateRiskExplanation(rec, risk),
  };
}

/**
 * Infer workflow risk from recommendation characteristics
 */
function inferWorkflowRisk(rec: Recommendation): WorkflowRisk {
  switch (rec.category) {
    case "unused_seats":
      // Removing unused seats has no workflow impact
      return "none";
    
    case "downgrade":
      // Downgrades typically low risk if team is small
      if (rec.confidence >= 0.8) {
        return "low";
      }
      return "medium";
    
    case "overlap":
      // Consolidation requires workflow adjustment
      const overlapScore = rec.metadata?.overlapScore || 50;
      if (overlapScore >= 80) {
        return "low"; // High overlap = low risk to consolidate
      }
      if (overlapScore >= 50) {
        return "medium";
      }
      return "medium";
    
    case "enterprise_overkill":
      // Removing enterprise features can be risky
      return "medium";
    
    case "api_optimization":
      // API changes can affect production systems
      return "medium";
    
    case "already_optimized":
      return "none";
    
    default:
      return "low";
  }
}

/**
 * Generate risk explanation
 */
function generateRiskExplanation(rec: Recommendation, risk: WorkflowRisk): string {
  switch (risk) {
    case "none":
      return generateNoRiskExplanation(rec);
    case "low":
      return generateLowRiskExplanation(rec);
    case "medium":
      return generateMediumRiskExplanation(rec);
    case "high":
      return generateHighRiskExplanation(rec);
  }
}

/**
 * Generate "no risk" explanation
 */
function generateNoRiskExplanation(rec: Recommendation): string {
  if (rec.category === "unused_seats") {
    return "Removing unused seats carries no operational risk. The change affects only billing and does not impact active users or workflow capabilities.";
  }
  
  if (rec.category === "already_optimized") {
    return "No changes recommended. Current configuration maintains operational continuity.";
  }
  
  return "This optimization carries minimal operational risk and should not affect day-to-day workflows.";
}

/**
 * Generate "low risk" explanation
 */
function generateLowRiskExplanation(rec: Recommendation): string {
  if (rec.category === "downgrade") {
    return "The recommended downgrade preserves core workflow capabilities. Enterprise-specific features (SSO, advanced admin controls) would be removed, but these do not appear actively utilized based on current team structure. Day-to-day operations should remain unaffected.";
  }
  
  if (rec.category === "overlap") {
    const overlapScore = rec.metadata?.overlapScore || 80;
    return `The affected tools provide ${overlapScore}%+ overlapping functionality. Consolidating to a single primary platform should preserve essential capabilities while requiring only minor workflow adjustment. Most teams successfully complete this transition within days.`;
  }
  
  return "This recommendation preserves core operational capabilities while requiring minimal workflow adjustment. Implementation should not materially disrupt day-to-day operations.";
}

/**
 * Generate "medium risk" explanation
 */
function generateMediumRiskExplanation(rec: Recommendation): string {
  if (rec.category === "overlap") {
    return "Consolidation may require workflow adjustment across team members who have established preferences for specific platforms. While the tools provide overlapping capabilities, individual workflows may have adapted to platform-specific features. Recommend gradual transition with team input.";
  }
  
  if (rec.category === "downgrade") {
    return "The recommended downgrade removes enterprise-grade features that may be utilized by specific team members or workflows. While current usage patterns suggest low dependency, validate with stakeholders before proceeding to ensure no critical workflows rely on enterprise capabilities.";
  }
  
  if (rec.category === "enterprise_overkill") {
    return "Removing enterprise features may affect administrative workflows, compliance requirements, or security policies. Validate that SSO, audit logging, and centralized management are not required before proceeding.";
  }
  
  if (rec.category === "api_optimization") {
    return "Changing API pricing models may affect production systems, rate limits, or usage patterns. Thoroughly test the new configuration in non-production environments and monitor usage closely during transition.";
  }
  
  return "This recommendation requires careful evaluation of current workflows and stakeholder input before implementation. Some operational adjustment may be necessary.";
}

/**
 * Generate "high risk" explanation
 */
function generateHighRiskExplanation(rec: Recommendation): string {
  return "This recommendation may significantly impact operational workflows and should be evaluated carefully with all stakeholders. Consider phased implementation, comprehensive testing, and rollback planning before proceeding.";
}

/**
 * Assess implementation complexity
 */
export function assessImplementationComplexity(rec: Recommendation): {
  complexity: ImplementationComplexity;
  explanation: string;
  steps?: string[];
} {
  // Use metadata if available
  if (rec.metadata?.implementationComplexity) {
    const complexity = rec.metadata.implementationComplexity as ImplementationComplexity;
    return {
      complexity,
      explanation: generateComplexityExplanation(rec, complexity),
      steps: generateImplementationSteps(rec),
    };
  }
  
  // Otherwise, infer from category
  const complexity = inferImplementationComplexity(rec);
  return {
    complexity,
    explanation: generateComplexityExplanation(rec, complexity),
    steps: generateImplementationSteps(rec),
  };
}

/**
 * Infer implementation complexity
 */
function inferImplementationComplexity(rec: Recommendation): ImplementationComplexity {
  switch (rec.category) {
    case "unused_seats":
      return "easy";
    
    case "downgrade":
      return rec.confidence >= 0.8 ? "easy" : "moderate";
    
    case "overlap":
      return "moderate";
    
    case "enterprise_overkill":
      return "moderate";
    
    case "api_optimization":
      return "complex";
    
    default:
      return "moderate";
  }
}

/**
 * Generate complexity explanation
 */
function generateComplexityExplanation(
  rec: Recommendation,
  complexity: ImplementationComplexity
): string {
  switch (complexity) {
    case "easy":
      return "This optimization can be implemented quickly through subscription management. No technical changes or workflow migration required.";
    
    case "moderate":
      return "Implementation requires coordination across team members and may involve workflow migration or tool transition. Plan for 1-2 weeks of adjustment period.";
    
    case "complex":
      return "This optimization requires careful planning, technical implementation, and comprehensive testing. Recommend phased rollout with monitoring and rollback capability.";
  }
}

/**
 * Generate implementation steps
 */
function generateImplementationSteps(rec: Recommendation): string[] | undefined {
  switch (rec.category) {
    case "unused_seats":
      return [
        "Review current seat allocation",
        "Identify inactive users",
        "Reduce seat count in subscription settings",
        "Verify billing adjustment",
      ];
    
    case "downgrade":
      return [
        "Validate enterprise feature usage with team",
        "Review plan comparison and feature differences",
        "Downgrade subscription through provider portal",
        "Verify core functionality remains intact",
        "Monitor for any workflow disruptions",
      ];
    
    case "overlap":
      return [
        "Identify primary platform for consolidation",
        "Communicate change to affected team members",
        "Migrate workflows and saved content",
        "Cancel redundant subscriptions",
        "Monitor adoption and address concerns",
      ];
    
    default:
      return undefined;
  }
}

/**
 * Generate tradeoff assessment
 */
export function generateTradeoffAssessment(rec: Recommendation): string {
  switch (rec.category) {
    case "unused_seats":
      return "No meaningful tradeoffs. Removing unused seats eliminates waste without affecting operational capabilities.";
    
    case "downgrade":
      const currentPlan = rec.metadata?.currentPlan || "enterprise plan";
      const suggestedPlan = rec.metadata?.suggestedPlan || "standard plan";
      return `Core functionality remains preserved under ${suggestedPlan}, though enterprise administrative controls (SSO, centralized management, audit logging) would be reduced. For teams not actively utilizing these features, the tradeoff strongly favors cost efficiency.`;
    
    case "overlap":
      return "Consolidation reduces platform diversity and may limit access to platform-specific features. However, for most workflows, a single well-chosen platform provides sufficient capability coverage while reducing operational complexity and recurring overhead.";
    
    case "enterprise_overkill":
      return "Removing enterprise features reduces administrative control and compliance capabilities. Ensure these features are not required for security, compliance, or operational policies before proceeding.";
    
    case "api_optimization":
      return "Changing pricing models may affect rate limits, billing predictability, or usage flexibility. Evaluate usage patterns carefully to ensure the new model aligns with operational requirements.";
    
    default:
      return "This optimization involves tradeoffs between cost efficiency and operational flexibility. Evaluate based on your specific workflow requirements and organizational priorities.";
  }
}
