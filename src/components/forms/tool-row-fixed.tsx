"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TOOL_CONFIGS } from "@/data/pricing";
import type { ToolEntryFormData } from "@/lib/validations/audit-schema";

interface ToolRowProps {
  tool: ToolEntryFormData;
  index: number;
  onChange: (index: number, field: keyof ToolEntryFormData, value: string | number) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

export function ToolRow({ tool, index, onChange, onRemove, showRemove }: ToolRowProps) {
  const toolConfigs = Object.values(TOOL_CONFIGS);
  const selectedToolConfig = tool.toolId ? TOOL_CONFIGS[tool.toolId] : null;

  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toolId = e.target.value;
    const config = TOOL_CONFIGS[toolId];
    if (config) {
      onChange(index, "toolId", toolId);
      onChange(index, "toolName", config.name);
      // Reset plan when tool changes
      onChange(index, "planId", "");
      onChange(index, "planName", "");
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planId = e.target.value;
    if (selectedToolConfig) {
      const plan = selectedToolConfig.plans.find((p) => p.id === planId);
      if (plan) {
        onChange(index, "planId", planId);
        onChange(index, "planName", plan.name);
        
        // Auto-calculate monthly spend based on plan pricing
        const calculatedSpend = plan.seats?.perSeat 
          ? plan.price * (tool.seats || 1)
          : plan.price;
        
        onChange(index, "monthlySpend", calculatedSpend);
      }
    }
  };

  const handleSeatsChange = (seats: number) => {
    onChange(index, "seats", seats);
    
    // Update monthly spend if per-seat pricing
    if (selectedToolConfig && tool.planId) {
      const plan = selectedToolConfig.plans.find((p) => p.id === tool.planId);
      if (plan?.seats?.perSeat) {
        const calculatedSpend = plan.price * seats;
        onChange(index, "monthlySpend", calculatedSpend);
      }
    }
  };

  return (
    <div className="relative rounded-lg border border-border bg-card p-4">
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tool Selection */}
        <div className="space-y-2">
          <Label htmlFor={`tool-${index}`}>Tool</Label>
          <select
            id={`tool-${index}`}
            value={tool.toolId || ""}
            onChange={handleToolChange}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select tool</option>
            {toolConfigs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Selection */}
        <div className="space-y-2">
          <Label htmlFor={`plan-${index}`}>Plan</Label>
          <select
            id={`plan-${index}`}
            value={tool.planId || ""}
            onChange={handlePlanChange}
            disabled={!selectedToolConfig}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select plan</option>
            {selectedToolConfig?.plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.price}
                {plan.seats?.perSeat ? "/seat" : ""})
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Spend */}
        <div className="space-y-2">
          <Label htmlFor={`spend-${index}`}>Monthly Spend ($)</Label>
          <Input
            id={`spend-${index}`}
            type="number"
            min="0"
            step="0.01"
            value={tool.monthlySpend || ""}
            onChange={(e) =>
              onChange(index, "monthlySpend", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
          />
        </div>

        {/* Seats */}
        <div className="space-y-2">
          <Label htmlFor={`seats-${index}`}>Seats</Label>
          <Input
            id={`seats-${index}`}
            type="number"
            min="1"
            step="1"
            value={tool.seats || ""}
            onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );
}
