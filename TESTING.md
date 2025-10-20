# Testing Guide

Comprehensive testing documentation for Multipult Frontend project.

## Overview

The project uses **Vitest** as the testing framework with comprehensive unit test coverage for all critical modules.

## Test Statistics

- **Total Tests**: 146 passing
- **Test Files**: 12 test suites
- **Coverage Target**: 80%+ for lines, functions, and statements

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Tests with Coverage
```bash
npm run test:unit -- --run --coverage
```

### Run Tests in Watch Mode
```bash
npm run test:unit -- --watch
```

### Run Specific Test File
```bash
npm run test:unit -- src/lib/auth/services/AuthService.spec.ts
```

## Test Structure

### Test Organization

```
src/
├── lib/
│   ├── auth/
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   └── AuthService.spec.ts          ✅ 23 tests
│   │   ├── strategies/
│   │   │   ├── EmailPasswordStrategy.ts
│   │   │   └── EmailPasswordStrategy.spec.ts ✅ 8 tests
│   │   └── storage/
│   │       ├── TokenStorage.ts
│   │       └── TokenStorage.spec.ts          ✅ 13 tests
│   ├── errors/
│   │   ├── ErrorHandler.ts
│   │   └── ErrorHandler.spec.ts              ✅ 12 tests
│   └── notifications/
│       ├── notificationStore.svelte.ts
│       └── notificationStore.spec.ts         ✅ 19 tests
└── routes/
    └── ...
```

## Test Coverage by Module

### 1. Authentication Module (109 tests)

#### Authentication Strategies (26 tests)
- **EmailPasswordStrategy**: Username/password authentication
- **GoogleAuthStrategy**: Google OAuth integration
- **TelegramAuthStrategy**: Telegram authentication

**Test file examples:**
```typescript
// src/lib/auth/strategies/EmailPasswordStrategy.spec.ts
describe('EmailPasswordStrategy', () => {
  it('should authenticate successfully with valid credentials', async () => {
    const result = await strategy.authenticate(validCredentials);
    expect(result.success).toBe(true);
  });

  it('should handle mutation errors', async () => {
    const result = await strategy.authenticate(invalidCredentials);
    expect(result.success).toBe(false);
  });
});
```

#### Auth Services (48 tests)
- **AuthService**: Login, register, logout, token refresh, password reset
- **PermissionService**: Role-based access control, permissions checking

**Key test scenarios:**
- ✅ Successful login/register flow
- ✅ Token storage and retrieval
- ✅ Permission and role checks
- ✅ Error handling for failed operations

#### Storage & Stores (30 tests)
- **TokenStorage**: Secure token persistence in localStorage
- **authStore**: Reactive authentication state management

### 2. Error Handling (17 tests)

Tests cover:
- AppError class creation and properties
- ErrorHandler normalization of different error types
- Error callbacks and notifications
- Async error handling

```typescript
// src/lib/errors/ErrorHandler.spec.ts
it('should normalize generic Error to AppError', () => {
  const result = handler.handle(new Error('Generic error'));
  expect(result).toBeInstanceOf(AppError);
});
```

### 3. Notifications (19 tests)

Comprehensive notification system testing:
- Success, error, warning, info notifications
- Auto-dismiss with configurable durations
- Manual dismiss and dismissAll
- Notification actions

```typescript
// src/lib/notifications/notificationStore.spec.ts
it('should auto-dismiss notification after duration', () => {
  notificationStore.success('Test', { duration: 3000 });
  vi.advanceTimersByTime(3000);
  expect(notificationStore.items).toHaveLength(0);
});
```

### 4. Configuration (5 tests)

Tests for application configuration and logger:
- Environment variable loading
- Development/production mode detection
- Logger functionality

## Writing Tests

### Test File Naming Convention

- Unit tests: `*.spec.ts`
- Component tests: `*.svelte.spec.ts`

### Test Structure Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ComponentName', () => {
  let instance: ComponentType;
  let mockDependency: MockType;

  beforeEach(() => {
    // Setup before each test
    mockDependency = {
      method: vi.fn()
    };
    instance = new ComponentType(mockDependency);
  });

  describe('methodName', () => {
    it('should handle success case', () => {
      // Arrange
      mockDependency.method.mockResolvedValue('success');

      // Act
      const result = await instance.methodName();

      // Assert
      expect(result).toBe('success');
    });

    it('should handle error case', () => {
      // Arrange
      mockDependency.method.mockRejectedValue(new Error('Failed'));

      // Act & Assert
      await expect(instance.methodName()).rejects.toThrow('Failed');
    });
  });
});
```

### Mocking Best Practices

#### Mocking GraphQL Client
```typescript
const mockGraphQLClient: IGraphQLClient = {
  query: vi.fn(),
  mutate: vi.fn()
};

vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
  login: { accessToken: 'token', refreshToken: 'refresh' }
});
```

#### Mocking Storage
```typescript
const mockStorage: Storage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
};
```

#### Using Fake Timers
```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should handle timeout', () => {
  scheduleAction(1000);
  vi.advanceTimersByTime(1000);
  expect(actionExecuted).toBe(true);
});
```

## Coverage Configuration

Coverage is configured in `vite.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    '**/node_modules/**',
    '**/.svelte-kit/**',
    '**/*.config.*',
    '**/*.spec.ts',
    '**/types.ts',
    '**/constants.ts'
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80
  },
  all: true,
  include: ['src/**/*.{js,ts,svelte}']
}
```

### Viewing Coverage Reports

After running tests with coverage:
```bash
npm run test:unit -- --run --coverage
```

Open the HTML report:
```
coverage/index.html
```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operation', async () => {
  const promise = service.asyncMethod();
  await expect(promise).resolves.toBe('result');
});
```

### Testing State Transitions

```typescript
it('should transition from logged out to logged in', async () => {
  expect(authStore.isAuthenticated).toBe(false);

  await auth.login(credentials);

  expect(authStore.isAuthenticated).toBe(true);
  expect(authStore.user).toBeDefined();
});
```

### Testing Error Handling

```typescript
it('should handle network errors gracefully', async () => {
  mockClient.mutate.mockRejectedValue(new Error('Network error'));

  const result = await service.operation();

  expect(result.success).toBe(false);
  expect(result.error).toContain('Network error');
});
```

## Debugging Tests

### Running Single Test
```bash
npm run test:unit -- -t "should authenticate successfully"
```

### Verbose Output
```bash
npm run test:unit -- --reporter=verbose
```

### Debug Mode
```bash
npm run test:unit -- --inspect-brk
```

## CI/CD Integration

Tests run automatically in CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:unit -- --run --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Test Maintenance

### When to Update Tests

1. **Adding new features**: Write tests first (TDD approach)
2. **Fixing bugs**: Add test case that reproduces the bug
3. **Refactoring**: Ensure all tests still pass
4. **Changing APIs**: Update affected test cases

### Test Health Checklist

- [ ] All tests pass locally
- [ ] Coverage meets thresholds (80%+)
- [ ] No skipped or pending tests without reason
- [ ] Tests run quickly (< 30 seconds for unit tests)
- [ ] Tests are isolated (no dependencies between tests)
- [ ] Mock data is realistic

## Troubleshooting

### Common Issues

**Issue**: Tests timeout
```typescript
// Solution: Increase timeout for slow operations
it('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

**Issue**: Flaky tests
```typescript
// Solution: Ensure proper cleanup and isolation
afterEach(() => {
  vi.clearAllMocks();
  store.reset();
});
```

**Issue**: Mock not working
```typescript
// Solution: Use vi.spyOn for existing objects
vi.spyOn(object, 'method').mockReturnValue('value');
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Mock Service Worker](https://mswjs.io/) - for API mocking
- [Playwright](https://playwright.dev/) - for E2E tests

## Next Steps

### Priority 4 Testing (Optional)

1. **Integration Tests**: Test GraphQL operations with mock server
2. **E2E Tests**: Full user flow testing with browser automation
3. **Component Tests**: Svelte component testing with Testing Library
4. **Visual Regression Tests**: Snapshot testing for UI components

---

**Last Updated**: 2025-01-16

**Maintained By**: Development Team
