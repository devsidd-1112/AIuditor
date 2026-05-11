/**
 * Form validation schema using Zod
 */

import { z } from "zod";

/**
 * Tool entry validation
 */
export const toolEntrySchema = z.object({
  toolId: z.string().min(1, "Please select a tool"),
  toolName: z.string().min(1, "Tool name is required"),
  planId: z.string().min(1, "Please select a plan"),
  planName: z.string().min(1, "Plan name is required"),
  monthlySpend: z.number().min(0, "Monthly spend cannot be negative"),
  seats: z.number().int("Seats must be a whole number").min(1, "Must have at least 1 seat"),
});

/**
 * Complete audit form validation
 */
export const auditFormSchema = z.object({
  tools: z
    .array(toolEntrySchema)
    .min(1, "Please add at least one tool to audit"),
  teamSize: z.number().int("Team size must be a whole number").min(1, "Team size must be at least 1"),
  primaryUseCase: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type ToolEntryFormData = z.infer<typeof toolEntrySchema>;
export type AuditFormData = z.infer<typeof auditFormSchema>;

/**
 * Default values for form
 */
export const defaultToolEntry: ToolEntryFormData = {
  toolId: "",
  toolName: "",
  planId: "",
  planName: "",
  monthlySpend: 0,
  seats: 1,
};

export const defaultAuditForm: AuditFormData = {
  tools: [{ ...defaultToolEntry }],
  teamSize: 1,
  primaryUseCase: "",
};
