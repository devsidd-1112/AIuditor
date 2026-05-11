"use client";

/**
 * Lead capture form
 * Shown after audit results to capture user info and send report
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Building2, Briefcase, Users, CheckCircle2, AlertCircle } from "lucide-react";

const leadSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureProps {
  auditId: string;
  reportUrl: string;
  monthlySavings: number;
  annualSavings: number;
  optimizationScore: number;
  onSuccess?: () => void;
}

export function LeadCapture({
  auditId,
  reportUrl,
  monthlySavings,
  annualSavings,
  optimizationScore,
  onSuccess,
}: LeadCaptureProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });
  
  const teamSize = watch("teamSize");
  
  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          company: data.company,
          role: data.role,
          teamSize: data.teamSize,
          auditId,
          reportUrl,
          monthlySavings,
          annualSavings,
          optimizationScore,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send report");
      }
      
      await response.json();
      
      setIsSuccess(true);
      onSuccess?.();
      
    } catch (err) {
      setError("Failed to send report. Please try again.");
      console.error("Lead capture error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Report Sent!
          </h3>
          <p className="text-gray-600">
            Check your email for the full report and shareable link.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          Get Your Report Emailed
        </h3>
        <p className="text-gray-600">
          Receive a shareable link and detailed breakdown
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Email report form">
        {/* Email (required) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" aria-hidden="true" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        
        {/* Company (optional) */}
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            Company
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Your company name"
            {...register("company")}
            aria-label="Company name (optional)"
          />
        </div>
        
        {/* Role (optional) */}
        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            Role
          </Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g., CTO, Engineering Manager"
            {...register("role")}
            aria-label="Your role (optional)"
          />
        </div>
        
        {/* Team Size (optional) */}
        <div className="space-y-2">
          <Label htmlFor="teamSize" className="flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />
            Team Size
          </Label>
          <Select
            value={teamSize}
            onValueChange={(value) => setValue("teamSize", value)}
          >
            <SelectTrigger id="teamSize" aria-label="Team size (optional)">
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 people</SelectItem>
              <SelectItem value="11-50">11-50 people</SelectItem>
              <SelectItem value="51-200">51-200 people</SelectItem>
              <SelectItem value="201-500">201-500 people</SelectItem>
              <SelectItem value="500+">500+ people</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Report to Email"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          We&apos;ll send you a shareable link and never spam you
        </p>
      </form>
    </div>
  );
}
