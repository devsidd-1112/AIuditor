/**
 * Financial calculation utilities for audit engine
 */

import type { SavingsSummary } from "@/types";

/**
 * Calculate monthly savings
 */
export function calculateMonthlySavings(current: number, optimized: number): number {
  return Math.max(0, current - optimized);
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(monthlySavings: number): number {
  return monthlySavings * 12;
}

/**
 * Calculate percentage savings
 */
export function calculatePercentageSavings(current: number, savings: number): number {
  if (current === 0) return 0;
  return Math.round((savings / current) * 100);
}

/**
 * Create a complete savings summary
 */
export function createSavingsSummary(
  currentMonthly: number,
  optimizedMonthly: number
): SavingsSummary {
  const monthlySavings = calculateMonthlySavings(currentMonthly, optimizedMonthly);
  const annualSavings = calculateAnnualSavings(monthlySavings);
  const percentage = calculatePercentageSavings(currentMonthly, monthlySavings);
  
  return {
    current: {
      monthly: currentMonthly,
      annual: currentMonthly * 12,
    },
    optimized: {
      monthly: optimizedMonthly,
      annual: optimizedMonthly * 12,
    },
    savings: {
      monthly: monthlySavings,
      annual: annualSavings,
      percentage,
    },
  };
}

/**
 * Format currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Safe division (avoids NaN)
 */
export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (denominator === 0) return fallback;
  const result = numerator / denominator;
  return isNaN(result) ? fallback : result;
}

/**
 * Calculate per-seat cost
 */
export function calculatePerSeatCost(totalCost: number, seats: number): number {
  return safeDivide(totalCost, seats);
}

/**
 * Calculate total cost for seats
 */
export function calculateSeatsCost(perSeatCost: number, seats: number): number {
  return perSeatCost * seats;
}

/**
 * Calculate waste from unused seats
 */
export function calculateUnusedSeatWaste(
  perSeatCost: number,
  totalSeats: number,
  usedSeats: number
): number {
  const unusedSeats = Math.max(0, totalSeats - usedSeats);
  return unusedSeats * perSeatCost;
}
