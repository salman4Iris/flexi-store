# Testing Standards

## Testing Framework

- **Test runner**: Jest
- **Command**: `npm test` (runs with `--runInBand` flag)
- **Config**: `jest.config.cjs`
- **TypeScript support**: `ts-jest`

## Test File Organization

Place test files next to tested code with `.test.ts` or `.test.tsx` suffix:

```
src/
  features/
    products/
      components/
        ProductCard.tsx
        ProductCard.test.tsx        # ✅ Colocated test
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

Use descriptive test names and organize with `describe` blocks:

```typescript
// src/utils/formatting.test.ts
import { formatPrice } from "@/utils/formatting"

describe("formatPrice", () => {
  it("should format a number as currency with default locale", () => {
    expect(formatPrice(100)).toBe("₹100.00")
  })

  it("should format with specified currency", () => {
    expect(formatPrice(100, "USD")).toBe("$100.00")
  })

  it("should handle zero and negative values", () => {
    expect(formatPrice(0)).toBe("₹0.00")
    expect(formatPrice(-50)).toBe("-₹50.00")
  })

  it("should handle decimal precision", () => {
    expect(formatPrice(99.99)).toBe("₹99.99")
  })
})
```

## Component Testing

Use Jest's built-in utilities for component testing. Avoid testing implementation details—test behavior.

```typescript
// src/features/products/components/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { ProductCard } from "./ProductCard"
import type { Product } from "@/features/products/types/product"

describe("ProductCard", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    image: "test.jpg",
  }

  it("should render product name and price", () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)
    
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()
  })

  it("should call onAddToCart when button is clicked", () => {
    const mockCallback = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={mockCallback} />)
    
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }))
    
    expect(mockCallback).toHaveBeenCalledWith("1")
  })
})
```

## Hook Testing

Test hooks with custom render utilities or hook testing libraries:

```typescript
// src/features/products/hooks/useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react"
import { useProducts } from "./useProducts"

describe("useProducts", () => {
  it("should fetch products on mount", async () => {
    const { result } = renderHook(() => useProducts())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toHaveLength(3)
  })

  it("should handle fetch errors", async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error"))
    )

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.error).toBe("Network error")
    })
  })
})
```

## Mock Patterns

### Mocking Modules

```typescript
import { getProducts } from "@/features/products/services/products"

jest.mock("@/features/products/services/products")

const mockedGetProducts = getProducts as jest.MockedFunction<typeof getProducts>

describe("Component using getProducts", () => {
  it("should handle data from service", async () => {
    mockedGetProducts.mockResolvedValueOnce([
      { id: "1", name: "Product 1", price: 99 },
    ])

    // Test component...
  })
})
```

### Mocking Fetch

```typescript
// src/__tests__/mockAuth.test.ts
global.fetch = jest.fn((url: string) => {
  if (url.includes("/api/auth/login")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: "mock-token", user: { id: "1" } }),
    })
  }
  return Promise.reject(new Error("Not mocked"))
})
```

### Mocking Context

```typescript
import { AuthProvider, useAuth } from "@/providers/AuthProvider"

jest.mock("@/providers/AuthProvider", () => ({
  ...jest.requireActual("@/providers/AuthProvider"),
  useAuth: jest.fn(),
}))

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe("Component using auth", () => {
  it("should render when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com" },
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

Use clear, semantic assertions:

```typescript
// ✅ Correct
expect(result).toBe(true)
expect(items).toHaveLength(3)
expect(function).toHaveBeenCalledWith(arg)
expect(element).toBeInTheDocument()
expect(error).toBeDefined()

// ❌ Avoid
expect(result === true).toBe(true)
expect(items.length).toBe(3)  // Use toHaveLength
expect(element).not.toBe(null)  // Use toBeInTheDocument
```

## Async Testing

Always `await` or use `waitFor` for async operations:

```typescript
// ✅ Correct
it("should handle async operations", async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// With waitFor for DOM updates
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument()
})

// ❌ Avoid
it("should handle async operations", () => {
  fetchData()  // Fire and forget
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

## Best Practices

1. **One assertion focus per test** — Each test should verify one behavior
2. **Use descriptive names** — Test names should read like documentation
3. **Setup and teardown** — Use `beforeEach`/`afterEach` for common setup
4. **Don't test framework behavior** — Don't test React internals
5. **Mock external dependencies** — Mock API calls, async operations
6. **Keep tests isolated** — Tests shouldn't depend on execution order

### Good Test Example

```typescript
describe("LoginForm", () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test specific behavior
  it("should submit form with email and password", async () => {
    const mockOnSubmit = jest.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
  })
})
```

---

See also: [docs/code-style.instructions.md](./code-style.instructions.md) and `jest.config.cjs` for configuration.
