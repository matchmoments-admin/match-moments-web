# Testing Guide

This document explains how to run and maintain tests for the Match Moments website.

## Overview

The project uses **Vitest** for testing with the following structure:

- **Unit Tests** - Test individual functions and components in isolation
- **Integration Tests** - Test API routes and service interactions
- **Coverage Target** - 50% overall (non-blocking)

## Quick Start

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Watch mode for development
npm run test:watch
```

## Test Structure

```
__tests__/
├── unit/                    # Unit tests
│   ├── mappers/            # Data transformation tests
│   ├── cache/              # Redis cache tests
│   └── salesforce/         # Salesforce client tests
├── integration/            # Integration tests
│   └── api/               # API route tests
└── utils/                 # Test utilities and mocks
    ├── test-utils.ts      # Helper functions
    ├── mocks.ts           # Mock data
    ├── mock-redis.ts      # Redis mock
    └── mock-salesforce.ts # Salesforce mock
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { mapTeam } from '@/lib/mappers/team-mapper';
import { createMockTeam } from '../../utils/mocks';

describe('mapTeam', () => {
  it('should map team data correctly', () => {
    const sfTeam = createMockTeam();
    const result = mapTeam(sfTeam);
    
    expect(result.id).toBe(sfTeam.Id);
    expect(result.name).toBe(sfTeam.Name);
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/sports/moments/[id]/route';

describe('GET /api/sports/moments/[id]', () => {
  it('should return moment by ID', async () => {
    const request = new Request('http://localhost/api/sports/moments/123');
    const params = Promise.resolve({ id: '123' });
    
    const response = await GET(request, { params });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Test Coverage

Current coverage targets:

- **Mappers**: 80-90% (pure functions, easy to test)
- **Cache utilities**: 70-80% (mocked dependencies)
- **Salesforce client**: 60-70% (complex auth flow)
- **API routes**: 50-60% (integration tests)

View coverage report:

```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Mocking Strategy

### Redis Cache

Uses in-memory mock (`__tests__/utils/mock-redis.ts`):

```typescript
import { mockUpstashRedis, clearMockRedis } from '../../utils/mock-redis';

mockUpstashRedis(); // Mock the module

beforeEach(() => {
  clearMockRedis(); // Clear cache before each test
});
```

### Salesforce API

Uses fetch mock (`__tests__/utils/mock-salesforce.ts`):

```typescript
import { mockFetch, mockSalesforceQuery } from '../../utils/mock-salesforce';

const fetchMock = mockFetch();
mockSalesforceQuery(fetchMock, mockData);
```

## CI/CD Integration

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Note**: Tests are non-blocking and won't fail deployments.

View workflow: `.github/workflows/test.yml`

## Common Issues

### Tests fail with "module not found"

Make sure dependencies are installed:

```bash
npm install
```

### Mock data not resetting

Clear mocks in `beforeEach`:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  clearMockRedis();
});
```

### Environment variables missing

Tests use mock environment variables (see `vitest.setup.ts`).

### Coverage below threshold

This is non-blocking but indicates areas needing more tests.

## Best Practices

1. **Test Isolation** - Each test should be independent
2. **AAA Pattern** - Arrange, Act, Assert
3. **Descriptive Names** - Use clear test descriptions
4. **Mock External Calls** - Never hit real APIs in tests
5. **Test Edge Cases** - Include null/undefined, errors, empty arrays
6. **One Assertion Focus** - Each test verifies one behavior

## Debugging Tests

### Run specific test file

```bash
npm test __tests__/unit/mappers/helpers.test.ts
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

### View console logs

Uncomment in `vitest.setup.ts`:

```typescript
// log: console.log, // Uncomment to see logs
```

## Future Improvements

- [ ] Increase coverage to 70-80%
- [ ] Add E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Contract testing for Salesforce

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing/vitest)

## Support

For questions or issues with tests, check:

1. Test output for specific error messages
2. Coverage report for untested areas
3. Mock implementations in `__tests__/utils/`

