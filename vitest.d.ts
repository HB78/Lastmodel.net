/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

// Types globaux pour les tests
declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

interface TestingLibraryMatchers<T, R> {
  toBeInTheDocument(): R;
  toBeVisible(): R;
  toHaveClass(className: string): R;
  toHaveValue(value: string | number): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
}

export {};