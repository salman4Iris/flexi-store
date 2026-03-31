# Testing Standards

## Testing Framework

- **Test runner**: Jest with TypeScript support (`ts-jest`)
- **Command**: `npm test` (runs with `--runInBand` flag)
- **Config**: `jest.config.cjs`
- **Patterns**: ES6 arrow functions, async/await, explicit types

## Test File Organization

Place test files next to tested code with `.test.ts` or `.test.tsx` suffix with proper ES6/TypeScript:

```
src/
  features/
    products/
      components/
        ProductCard.tsx
        ProductCard.test.tsx        # ✅ Colocated test
      services/
        products.ts
        products.test.ts            # ✅ Colocated test
  services/
    auth.ts
    auth.test.ts                    # ✅ Colocated test
  utils/
    formatting.ts
    formatting.test.ts              # ✅ Colocated test
  __tests__/
    mockAuth.test.ts                # Shared mock tests
    integration.test.ts
```

## Test Structure

Use descriptive test names with arrow functions and organize with `describe` blocks:

```typescript
// src/utils/formatting.test.ts
import { formatPrice } from "@/utils/formatting"

describe("formatPrice", () => {
  // Arrow function test with explicit void return
  it("should format a number as currency with default locale", (): void => {
    expect(formatPrice(100)).toBe("₹100.00")
  })

  // Arrow function with string template for clarity
  it("should format with specified currency", (): void => {
    const result = formatPrice(100, "USD")
    expect(result).toBe("$100.00")
  })

  // Test edge cases with descriptive naming
  it("should handle zero and negative values", (): void => {
    expect(formatPrice(0)).toBe("₹0.00")
    expect(formatPrice(-50)).toBe("-₹50.00")
  })

  it("should handle decimal precision", (): void => {
    const result = formatPrice(99.99)
    expect(result).toBe("₹99.99")
  })
})
```

## Component Testing

Use Jest's built-in utilities for component testing with arrow functions and type safety:

```typescript
// src/features/products/components/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { ProductCard } from "./ProductCard"
import type { Product } from "@/features/products/types/product"

describe("ProductCard", () => {
  // Define mock data with proper typing
  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    image: "test.jpg",
    description: "Test description",
    category: "test",
    createdAt: new Date().toISOString(),
  }

  // Arrow function test with explicit void return
  it("should render product name and price", (): void => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)
    
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()
  })

  // Arrow function test checking callback with type narrowing
  it("should call onAddToCart when button is clicked", (): void => {
    const mockCallback = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={mockCallback} />)
    
    const button = screen.getByRole("button", { name: /add to cart/i })
    fireEvent.click(button)
    
    expect(mockCallback).toHaveBeenCalledWith("1")
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})
```

## Hook Testing

Test hooks with custom render utilities and proper async/await patterns:

```typescript
// src/features/products/hooks/useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react"
import { useProducts } from "./useProducts"

describe("useProducts", () => {
  // Arrow function test with async/await
  it("should fetch products on mount", async (): Promise<void> => {
    const { result } = renderHook(() => useProducts())

    // Initially loading
    expect(result.current.loading).toBe(true)

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify data loaded
    expect(result.current.products).toHaveLength(3)
    expect(result.current.error).toBeNull()
  })

  // Arrow function test handling errors
  it("should handle fetch errors gracefully", async (): Promise<void> => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error"))
    )

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.error).toContain("Network error")
    expect(result.current.products).toHaveLength(0)
  })
})
```

## Mock Patterns

### Mocking Modules

Use arrow functions and type-safe mocking:

```typescript
import { getProducts } from "@/features/products/services/products"
import type { Product } from "@/features/products/types/product"

// Mock the module
jest.mock("@/features/products/services/products")

// Type-safe mock function
const mockedGetProducts = getProducts as jest.MockedFunction<typeof getProducts>

describe("Component using getProducts", () => {
  // Setup mock before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Arrow function test with type-safe mock
  it("should handle data from service", async (): Promise<void> => {
    const mockData: Product[] = [
      {
        id: "1",
        name: "Product 1",
        price: 99,
        description: "Test",
        image: "test.jpg",
        category: "test",
        createdAt: new Date().toISOString(),
      },
    ]

    // Mock the service to return specific data
    mockedGetProducts.mockResolvedValueOnce(mockData)

    // Test component...
  })
})
```

### Mocking Fetch

Mock network requests with proper typing and error handling:

```typescript
// src/__tests__/mockAuth.test.ts
type MockFetchParams = {
  url: string
  init?: RequestInit
}

// Type-safe mock fetch
global.fetch = jest.fn((url: string, init?: RequestInit) => {
  if (url.includes("/api/auth/login") && init?.method === "POST") {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          token: "mock-token",
          user: { id: "1", email: "test@example.com" },
        }),
        { status: 200 }
      )
    )
  }
  return Promise.reject(new Error("Not mocked"))
}) as jest.Mock
```

### Mocking Context

Proper type-safe context mocking using arrow functions:

```typescript
import { AuthProvider, useAuth } from "@/providers/AuthProvider"
import type { User } from "@/features/auth/types"

jest.mock("@/providers/AuthProvider", () => ({
  ...jest.requireActual("@/providers/AuthProvider"),
  useAuth: jest.fn(),
}))

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe("Component using auth", () => {
  // Setup mock before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Arrow function test with type-safe auth mock
  it("should render when user is authenticated", (): void => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
    }

    // Type-safe mock return value
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      ready: true,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    // Test component...
  })
})
```

## Assertions

Use clear, semantic assertions with type-safe expectations:

```typescript
// ✅ Correct - Clear semantic assertions
it("should have correct assertions", (): void => {
  expect(result).toBe(true)
  expect(items).toHaveLength(3)
  expect(callback).toHaveBeenCalledWith(arg)
  expect(element).toBeInTheDocument()
  expect(error).toBeDefined()
  expect(value).toBeNull()
  expect(data).toBeTruthy()
})

// ❌ Avoid - Implicit assertions
it("should avoid implicit assertions", (): void => {
  // Avoid
  expect(result === true).toBe(true)      // Use toBe or toBeTruthy
  expect(items.length).toBe(3)            // Use toHaveLength
  expect(element).not.toBe(null)          // Use toBeInTheDocument
  expect(error !== undefined).toBe(true)  // Use toBeDefined
})
```

## Async Testing

Always use `async/await` and `waitFor` for async operations with proper type safety:

```typescript
// ✅ Correct - Async/await with proper typing
it("should handle async operations", async (): Promise<void> => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// ✅ Correct - Using waitFor for DOM updates
it("should update DOM after async change", async (): Promise<void> => {
  render(<AsyncComponent />)
  
  await waitFor(() => {
    expect(screen.getByText("Loaded")).toBeInTheDocument()
  })
})

// ✅ Correct - Error handling in async tests
it("should handle async errors", async (): Promise<void> => {
  await expect(failingAsyncFunction()).rejects.toThrow("Error message")
})

// ❌ Avoid - Not awaiting promises
it("should handle async operations", () => {
  const data = fetchData()  // Missing await
  expect(data).toBeDefined()  // May not be defined yet
})
```

## Test Coverage

- Aim for **>80% coverage** on business logic
- Components: test behavior, not implementation
- Services: test all success and error paths
- Utilities: test edge cases

Run coverage:
```bash
npm test -- --coverage
```

## Test Coverage

- Aim for **>80% coverage** on business logic
- Components: test behavior, not implementation
- Services: test all success and error paths with type safety
- Utilities: test edge cases

Run coverage:
```bash
npm test -- --coverage
```

## Best Practices

1. **One assertion focus per test** — Each test should verify one behavior
2. **Use descriptive names** — Test names should read like documentation
3. **Setup and teardown** — Use `beforeEach`/`afterEach` for common setup
4. **Don't test framework behavior** — Don't test React internals
5. **Mock external dependencies** — Mock API calls, async operations
6. **Keep tests isolated** — Tests shouldn't depend on execution order
7. **Type-safe mocks** — Use `jest.MockedFunction` types for safety
8. **Proper async handling** — Use `async/await` and `waitFor`

### Good Test Example with ES6/TypeScript

```typescript
describe("LoginForm", () => {
  // Setup with type-safe mock
  const setupTest = () => {
    const mockOnSubmit = jest.fn()
    return { mockOnSubmit }
  }

  // Cleanup
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Arrow function test with explicit void return
  it("should submit form with email and password", async (): Promise<void> => {
    const { mockOnSubmit } = setupTest()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    // Destructure screen queries for clarity
    const emailInput = screen.getByPlaceholderText("Email")
    const passwordInput = screen.getByPlaceholderText("Password")
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    // Simulate user interactions
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)

    // Type-safe assertions
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })
})
```

---

## ES6 & TypeScript Requirements for Tests

✅ **Arrow functions** for all test callbacks  
✅ **Async/await** for async operations  
✅ **Explicit types** on mock functions  
✅ **Type narrowing** with `instanceof` for errors  
✅ **Nullish coalescing** (`??`) where applicable  
✅ **Destructuring** for improved clarity  
✅ **No `any` types** in assertions and mocks  

See also: [es6-typescript.instructions.md](./es6-typescript.instructions.md) for comprehensive patterns and [code-style.instructions.md](./code-style.instructions.md) for naming conventions.
