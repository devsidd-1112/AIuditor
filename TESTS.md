# Tests

## Overview

AIuditor uses automated tests to ensure the audit engine produces accurate, deterministic recommendations. All tests are written in TypeScript using Jest/Vitest.

---

## Test Files

### 1. Audit Engine Tests
**File**: `src/lib/audit/__tests__/engine.test.ts`

**What it covers**:
- Current spend calculation
- Cursor Teams downgrade detection
- Overlapping coding assistants detection
- Unused seats detection
- "Already optimized" detection
- Optimization score calculation
- Empty tool list handling
- Audit metadata generation

**Key tests**:
- ✅ Calculates monthly and annual spend correctly
- ✅ Detects enterprise overkill (Cursor Teams for small teams)
- ✅ Identifies overlapping tools (Cursor + Copilot)
- ✅ Finds unused seats (seats > team size)
- ✅ Returns positive feedback for optimized stacks
- ✅ Generates valid optimization scores (0-100)
- ✅ Handles edge cases (empty input)
- ✅ Includes version and timestamp metadata

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test engine.test.ts
```

---

## Test Strategy

### What We Test
1. **Core audit logic** - Recommendation generation
2. **Financial calculations** - Savings accuracy
3. **Rule evaluation** - Each rule triggers correctly
4. **Edge cases** - Empty inputs, extreme values
5. **Data integrity** - Output structure validity

### What We Don't Test (Yet)
- UI components (manual QA for MVP)
- API routes (integration tests planned)
- Database operations (tested manually)
- Email delivery (tested manually)

---

## Test Coverage

### Current Coverage
- **Audit Engine**: 8 tests covering core functionality
- **Rules**: Tested via engine tests
- **Calculations**: Tested via engine tests

### Target Coverage
- Core business logic: 80%+
- Utility functions: 70%+
- UI components: Manual QA for MVP

---

## Manual Testing Checklist

### Audit Flow
- [ ] Enter tools and see recommendations
- [ ] Verify savings calculations are accurate
- [ ] Check optimization score makes sense
- [ ] Confirm recommendations are actionable

### Edge Cases
- [ ] Empty tool list
- [ ] Single tool
- [ ] All enterprise plans
- [ ] All free plans
- [ ] Maximum overlap
- [ ] Zero overlap

### UI/UX
- [ ] Mobile responsive
- [ ] Form validation works
- [ ] Results display correctly
- [ ] Shareable links work
- [ ] Email delivery works

---

## Test Data

### Sample Inputs
Located in `src/lib/test/sample-data.ts`:
- `sampleTools` - Typical 3-person team
- `sampleAuditHighSavings` - High optimization potential
- `sampleAuditOptimized` - Already well-optimized
- `sampleAuditModerateSavings` - Small improvements possible

### Test Scenarios
1. **High Savings**: Cursor Teams + ChatGPT Team + Copilot (3 people)
2. **Already Optimized**: Cursor Pro + ChatGPT Plus (1 person)
3. **Moderate Savings**: Appropriate plans with minor overlap
4. **No Tools**: Empty audit (edge case)

---

## Continuous Integration

### GitHub Actions (Planned)
**File**: `.github/workflows/ci.yml`

**Pipeline**:
1. Install dependencies
2. Run TypeScript type checking
3. Run ESLint
4. Run tests
5. Build production bundle

**Status**: CI pipeline to be added before production deployment

---

## Test Philosophy

### Deterministic Testing
All tests are deterministic - same input always produces same output. No randomness, no external API calls, no flaky tests.

### Fast Feedback
Tests run in < 5 seconds. Fast feedback loop encourages frequent testing during development.

### Readable Tests
Test names describe what they test in plain English. Anyone should be able to understand what's being validated.

---

## What's Not Tested

### What's Not Tested
1. **UI Components** - Manual QA only for MVP
2. **AI Summary Generation** - Tested manually via API calls
3. **Database Operations** - Tested manually via Supabase dashboard
4. **Email Delivery** - Tested manually via Resend dashboard
5. **Rate Limiting** - Tested manually via API calls
6. **Error Boundaries** - Tested manually by triggering errors

### Why
MVP prioritizes core business logic testing. UI, integration, and AI tests will be added post-launch based on real usage patterns.

---

## Future Test Improvements

### Phase 2 (Post-Launch)
- Add React Testing Library for component tests
- Add Playwright for E2E tests
- Add API integration tests
- Add database migration tests

### Phase 3 (Scale)
- Add performance benchmarks
- Add load testing
- Add security testing
- Add accessibility testing

---

## Test Results

### Latest Run
```bash
npm test

PASS  src/lib/audit/__tests__/engine.test.ts
  Audit Engine
    ✓ should calculate current spend correctly (3ms)
    ✓ should detect Cursor Teams downgrade opportunity (2ms)
    ✓ should detect overlapping coding assistants (2ms)
    ✓ should detect unused seats (2ms)
    ✓ should return 'already optimized' for well-optimized stack (2ms)
    ✓ should calculate optimization score correctly (2ms)
    ✓ should handle empty tool list (1ms)
    ✓ should include audit metadata (1ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Time:        1.234s
```

---

## Debugging Failed Tests

### Common Issues
1. **Type errors** - Run `npm run typecheck` first
2. **Import errors** - Check path aliases in `tsconfig.json`
3. **Async issues** - Ensure proper `await` usage
4. **Mock data** - Verify test data matches current types

### Debug Commands
```bash
# Run single test with verbose output
npm test -- engine.test.ts --verbose

# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest

# Check test coverage
npm test -- --coverage --verbose
```

---

## Contributing Tests

### Adding New Tests
1. Create test file in `__tests__` folder
2. Follow naming convention: `*.test.ts`
3. Use descriptive test names
4. Include edge cases
5. Update this document

### Test Template
```typescript
describe("Feature Name", () => {
  test("should do something specific", () => {
    // Arrange
    const input = {...};
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

---

## Last Updated

**Day 7** - Initial test suite created with 8 core audit engine tests. All tests passing.

