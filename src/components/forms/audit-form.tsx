"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolRow } from "./tool-row-fixed";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  defaultToolEntry,
  defaultAuditForm,
  type AuditFormData,
  type ToolEntryFormData,
} from "@/lib/validations/audit-schema";
import type { AuditInput, ToolUsage } from "@/types";
import { getToolConfig } from "@/data/pricing";

interface AuditFormProps {
  onSubmit: (input: AuditInput) => void;
  isLoading?: boolean;
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [formData, setFormData] = usePersistedState<AuditFormData>(
    "aiuditor-form-data",
    defaultAuditForm
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToolChange = (
    index: number,
    field: keyof ToolEntryFormData,
    value: string | number
  ) => {
    setFormData((prevFormData) => {
      const newTools = [...prevFormData.tools];
      newTools[index] = { ...newTools[index], [field]: value };
      return { ...prevFormData, tools: newTools };
    });
    
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`tools.${index}.${field}`];
      return newErrors;
    });
  };

  const handleAddTool = () => {
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, { ...defaultToolEntry }],
    }));
  };

  const handleRemoveTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const handleTeamSizeChange = (value: string) => {
    const teamSize = parseInt(value) || 1;
    setFormData((prev) => ({ ...prev, teamSize }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.teamSize;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate tools
    if (formData.tools.length === 0) {
      newErrors.tools = "Please add at least one tool";
    }

    formData.tools.forEach((tool, index) => {
      if (!tool.toolId) {
        newErrors[`tools.${index}.toolId`] = "Please select a tool";
      }
      if (!tool.planId) {
        newErrors[`tools.${index}.planId`] = "Please select a plan";
      }
      if (tool.monthlySpend < 0) {
        newErrors[`tools.${index}.monthlySpend`] = "Cannot be negative";
      }
      if (tool.seats < 1) {
        newErrors[`tools.${index}.seats`] = "Must be at least 1";
      }
    });

    // Validate team size
    if (formData.teamSize < 1) {
      newErrors.teamSize = "Team size must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearForm = () => {
    // Clear localStorage
    window.localStorage.removeItem("aiuditor-form-data");
    // Reset to default
    setFormData(defaultAuditForm);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert form data to audit input
    const tools: ToolUsage[] = formData.tools.map((tool) => {
      const toolConfig = getToolConfig(tool.toolId);
      return {
        toolId: tool.toolId,
        toolName: tool.toolName,
        planId: tool.planId,
        planName: tool.planName,
        monthlySpend: tool.monthlySpend,
        seats: tool.seats,
        category: toolConfig?.category || "specialized",
        roles: toolConfig?.roles || [],
      };
    });

    const auditInput: AuditInput = {
      tools,
      teamSize: formData.teamSize,
      primaryUseCase: formData.primaryUseCase,
    };

    onSubmit(auditInput);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="AI tools audit form">
      {/* Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your AI Tools</h2>
            <p className="text-sm text-muted-foreground">
              Add the AI tools your team currently uses
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearForm}
              disabled={isLoading}
              aria-label="Clear all form data"
            >
              Clear Form
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTool}
              disabled={isLoading}
              aria-label="Add another AI tool"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add Tool
            </Button>
          </div>
        </div>

        {errors.tools && (
          <p className="text-sm text-destructive">{errors.tools}</p>
        )}

        <div className="space-y-3" role="list" aria-label="AI tools list">
          {formData.tools.map((tool, index) => (
            <ToolRow
              key={`tool-${index}-${tool.toolId}`}
              tool={tool}
              index={index}
              onChange={handleToolChange}
              onRemove={handleRemoveTool}
              showRemove={formData.tools.length > 1}
            />
          ))}
        </div>

        {formData.tools.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No tools added yet. Click &quot;Add Tool&quot; to get started.
            </p>
          </div>
        )}
      </div>

      {/* Team Details Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Team Details</h2>
          <p className="text-sm text-muted-foreground">
            Help us provide better recommendations
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="teamSize">
              Team Size <span className="text-destructive">*</span>
            </Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              step="1"
              value={formData.teamSize || ""}
              onChange={(e) => handleTeamSizeChange(e.target.value)}
              placeholder="e.g., 5"
              disabled={isLoading}
              aria-required="true"
              aria-invalid={!!errors.teamSize}
              aria-describedby={errors.teamSize ? "teamSize-error" : undefined}
            />
            {errors.teamSize && (
              <p id="teamSize-error" className="text-sm text-destructive" role="alert">
                {errors.teamSize}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryUseCase">Primary Use Case (Optional)</Label>
            <Input
              id="primaryUseCase"
              type="text"
              value={formData.primaryUseCase || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, primaryUseCase: e.target.value }))
              }
              placeholder="e.g., Software development"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze My Stack"}
        </Button>
      </div>
    </form>
  );
}
