/**
 * Email templates
 * Simple, professional email content
 */

interface AuditReportEmailData {
  reportUrl: string;
  monthlySavings: number;
  annualSavings: number;
  optimizationScore: number;
}

/**
 * Generate audit report email HTML
 */
export function generateAuditReportEmail(data: AuditReportEmailData): string {
  const { reportUrl, monthlySavings, annualSavings, optimizationScore } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AIuditor Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">AIuditor</h1>
    <p style="color: #666; margin: 5px 0 0 0;">AI Spend Optimization Report</p>
  </div>
  
  <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1e293b;">Your Report is Ready</h2>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Potential Savings</div>
      <div style="font-size: 32px; font-weight: bold; color: #16a34a;">
        $${monthlySavings.toFixed(0)}<span style="font-size: 16px; color: #64748b;">/mo</span>
      </div>
      <div style="font-size: 14px; color: #64748b;">
        $${annualSavings.toFixed(0)}/year
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Optimization Score</div>
      <div style="font-size: 24px; font-weight: bold; color: #2563eb;">
        ${optimizationScore}/100
      </div>
    </div>
    
    <a href="${reportUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin-top: 8px;">
      View Full Report
    </a>
  </div>
  
  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 16px; color: #1e293b; margin: 0 0 12px 0;">What's in your report:</h3>
    <ul style="margin: 0; padding-left: 20px; color: #475569;">
      <li style="margin-bottom: 8px;">Detailed optimization recommendations</li>
      <li style="margin-bottom: 8px;">Tool overlap analysis</li>
      <li style="margin-bottom: 8px;">Cost breakdown by category</li>
      <li style="margin-bottom: 8px;">Actionable next steps</li>
    </ul>
  </div>
  
  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
    <p style="margin: 0 0 8px 0;">
      This report link is shareable with your team.
    </p>
    <p style="margin: 0;">
      <a href="${reportUrl}" style="color: #2563eb; text-decoration: none;">${reportUrl}</a>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">AIuditor - AI Spend Optimization Platform</p>
  </div>
  
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of audit report email
 */
export function generateAuditReportEmailText(data: AuditReportEmailData): string {
  const { reportUrl, monthlySavings, annualSavings, optimizationScore } = data;
  
  return `
AIuditor - Your AI Spend Optimization Report

Your Report is Ready
━━━━━━━━━━━━━━━━━━━━

Potential Savings: $${monthlySavings.toFixed(0)}/mo ($${annualSavings.toFixed(0)}/year)
Optimization Score: ${optimizationScore}/100

View your full report:
${reportUrl}

What's in your report:
• Detailed optimization recommendations
• Tool overlap analysis
• Cost breakdown by category
• Actionable next steps

This report link is shareable with your team.

━━━━━━━━━━━━━━━━━━━━
AIuditor - AI Spend Optimization Platform
  `.trim();
}
