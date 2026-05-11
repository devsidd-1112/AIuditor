/**
 * Audit Engine Tests
 * Tests the core audit engine functionality using Node.js built-in test runner
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { runAudit } from "../engine";
import type { AuditInput } from "@/types";

describe("Audit Engine", () => {
  it("should calculate current spend correctly", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-pro",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 1,
    };

    const result = runAudit(input);
    assert.strictEqual(result.savings.current.monthly, 20);
    assert.strictEqual(result.savings.current.annual, 240);
  });

  it("should detect Cursor Teams downgrade opportunity", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-teams",
          planName: "Teams",
          monthlySpend: 120,
          seats: 3,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 3,
    };

    const result = runAudit(input);
    const cursorRec = result.recommendations.find((r) =>
      r.title.includes("Cursor")
    );

    assert.ok(cursorRec, "Should have Cursor recommendation");
    assert.strictEqual(cursorRec?.category, "downgrade");
    assert.strictEqual(cursorRec?.severity, "high");
    assert.ok(
      cursorRec && cursorRec.savings.monthly > 0,
      "Should have positive savings"
    );
  });

  it("should detect overlapping coding assistants", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-pro",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
          category: "coding_assistant",
          roles: ["development"],
        },
        {
          toolId: "github-copilot",
          toolName: "GitHub Copilot",
          planId: "copilot-individual",
          planName: "Individual",
          monthlySpend: 10,
          seats: 1,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 1,
    };

    const result = runAudit(input);
    const overlapRec = result.recommendations.find(
      (r) => r.category === "overlap"
    );

    assert.ok(overlapRec, "Should have overlap recommendation");
    assert.ok(
      overlapRec?.affectedTools.includes("cursor"),
      "Should include cursor"
    );
    assert.ok(
      overlapRec?.affectedTools.includes("github-copilot"),
      "Should include copilot"
    );
  });

  it("should detect unused seats", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-pro",
          planName: "Pro",
          monthlySpend: 100,
          seats: 5,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 2,
    };

    const result = runAudit(input);
    const seatsRec = result.recommendations.find(
      (r) => r.category === "unused_seats"
    );

    assert.ok(seatsRec, "Should have unused seats recommendation");
    assert.strictEqual(seatsRec?.severity, "high");
  });

  it("should return high score for well-optimized stack", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-pro",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 1,
    };

    const result = runAudit(input);

    assert.ok(
      result.score.overall > 80,
      "Should have high optimization score"
    );
    assert.ok(
      result.savings.savings.monthly < 20,
      "Should have minimal savings"
    );
  });

  it("should calculate optimization score correctly", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-teams",
          planName: "Teams",
          monthlySpend: 120,
          seats: 3,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 3,
    };

    const result = runAudit(input);

    assert.ok(
      result.score.overall >= 0 && result.score.overall <= 100,
      "Score should be between 0 and 100"
    );
    assert.ok(result.score.rating, "Should have rating");
    assert.ok(result.score.breakdown, "Should have breakdown");
  });

  it("should handle empty tool list", () => {
    const input: AuditInput = {
      tools: [],
      teamSize: 1,
    };

    const result = runAudit(input);

    assert.strictEqual(result.savings.current.monthly, 0);
    assert.strictEqual(result.recommendations.length, 0);
  });

  it("should include audit metadata", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          toolName: "Cursor",
          planId: "cursor-pro",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
          category: "coding_assistant",
          roles: ["development"],
        },
      ],
      teamSize: 1,
    };

    const result = runAudit(input);

    assert.strictEqual(result.version, "2.0.0");
    assert.ok(result.auditedAt instanceof Date, "Should have audit date");
  });
});
