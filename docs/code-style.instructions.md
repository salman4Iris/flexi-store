# Code Style & TypeScript Conventions

## TypeScript Fundamentals

- **Strict mode enabled** — Use `strict: true` in `tsconfig.json`
- **Always annotate return types** for functions
- **Use `type` over `interface`** unless you need interface-specific features
- **No `any` types** — Use `unknown` if needed, then narrow with type guards
- **Prefer `const` over `let` or `var`**

### Type Definitions

**✅ Correct:**
```typescript
// Use type for most definitions
type User = {
  id: string
  email: string
  name: string
}

// Annotate return types explicitly
function getUserName(user: User): string {
  return user.name
}

// Export types with suffix -Type or -Props
export type ProductCardProps = {
  id: string
  name: string
  price: number
}

// Use union types for clarity
type Status = "pending" | "completed" | "failed"
```

**❌ Avoid:**
```typescript
// Implicit any
function process(data) {  // ❌ Implicit any
  return data.value
}

// Overly broad types
type Thing = {
  [key: string]: any  // ❌ Uses any
}

// Missing return type
export const computeTotal = (items) => {  // ❌ No return annotation
  return items.reduce((sum, i) => sum + i.price, 0)
}
```

## Naming Conventions

### Components & Functions

- **React components**: `PascalCase` — `ProductCard.tsx`, `LoginForm.tsx`
- **Utility functions**: `camelCase` — `formatPrice()`, `validateEmail()`
- **Constants**: `UPPER_SNAKE_CASE` — `API_BASE_URL`, `DEFAULT_TIMEOUT`
- **Type/Interface names**: `PascalCase` with `-Type` or `-Props` suffix

```typescript
// Component
export function ProductCard() { }

// Utility
export function formatPrice(value: number): string { }

// Constant
export const API_BASE_URL = "https://api.example.com"

// Types
export type ProductProps = { /* ... */ }
export type ApiResponse = { /* ... */ }
```

### Variables & Properties

- **Private class properties**: `#private` or `_leading_underscore`
- **Boolean variables**: Prefix with `is`, `has`, `can`, `should` — `isLoading`, `hasError`
- **Event handlers**: Prefix with `handle` — `handleClick()`, `handleSubmit()`
- **Callback props**: Prefix with `on` — `onClick`, `onSuccess`, `onChange`

```typescript
type FormState = {
  isLoading: boolean
  hasError: boolean
  canSubmit: boolean
}

function handleFormSubmit(event: React.FormEvent) { }

export type CardProps = {
  onClose: () => void
  onSelect: (id: string) => void
}
```

## File Organization

### Directory Structure

```
src/
  app/                    # Next.js pages and routes
    api/
      auth/
        login/
          route.ts        # Lowercase, route handler
      orders/
        route.ts
    auth/
      login/
        page.tsx          # Lowercase, page component
        login.css
      register/
        page.tsx
    cart/
      page.tsx
  components/
    ui/                   # shadcn auto-generated (readonly)
    auth/                 # Feature-grouped shared components
      RequireAuth.tsx     # PascalCase filename
    layouts/
      Navbar.tsx
      Footer.tsx
  features/               # Feature-specific code
    products/
      components/         # Feature components
        ProductCard.tsx
        ProductGrid.tsx
      hooks/              # Feature hooks
        useProduct.ts
        useProducts.ts
      services/           # Feature API calls
        products.ts
      types/              # Feature types
        product.ts
    auth/
      components/
      hooks/
      services/
      types/
  providers/              # Context providers
    AuthProvider.tsx
    ThemeProvider.tsx
  services/               # Shared services
    api.ts
    auth.ts
  store/                  # Global state (context/hooks)
    cart.tsx
  types/                  # Shared types
    api.ts
    domain.ts
  utils/                  # Pure utility functions
    formatting.ts
    validation.ts
```

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| React Component | `PascalCase.tsx` | `ProductCard.tsx` |
| Hook | `camelCase.ts` with `use` prefix | `useProducts.ts` |
| Service | `camelCase.ts` | `products.ts` |
| Type Definition | `camelCase.ts` or suffix in filename | `product.ts` |
| API Route | `route.ts` (Next.js convention) | `app/api/products/route.ts` |
| Utility | `camelCase.ts` | `formatPrice.ts` |
| CSS Module | `camelCase.module.css` | `form.module.css` |
| Style Sheet | `camelCase.css` | `globals.css` |

## Imports

### Organization

1. **External imports** (third-party libraries)
2. **Internal imports** (from `@/`)
3. **Blank line separator**

```typescript
// ✅ Correct ordering
import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { formatPrice } from "@/utils/formatting"

export function MyComponent() { }
```

### Import Statements

- Use **named imports** when possible (enables tree-shaking)
- Use **default exports** for single feature exports
- Use absolute imports with `@/` path alias (configured in `tsconfig.json`)

```typescript
// ✅ Correct
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/utils/formatting"
import { ProductCard } from "@/features/products/components"

// ❌ Avoid
import Button from "@/components/ui/button"  // Default when named available
import * as utils from "@/utils/formatting"   // Star imports
import { Button } from "../../../../components/ui/button"  // Relative paths
```

## Comments & Documentation

- Use `//` for single-line comments
- Use `/** */` for type/function documentation (JSDoc style)
- Be specific; avoid obvious comments

```typescript
/**
 * Formats a number as currency using the specified locale.
 * @param value - The numeric value to format
 * @param currency - ISO 4217 currency code (default: "INR")
 * @returns Formatted currency string
 */
export function formatPrice(value: number, currency = "INR"): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value)
}

// Cache user data for 5 minutes to reduce API calls
const CACHE_DURATION = 5 * 60 * 1000
```

## Line Length & Formatting

- Keep lines under **100 characters** where practical
- Use ESLint (configured in `eslint.config.mjs`)
- Run `npm run lint` before committing

## Async & Promises

- Use `async/await` over `.then()` chains
- Handle errors with try/catch
- Always type async functions with `Promise<ReturnType>`

```typescript
// ✅ Correct
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products")
    return response.json()
  } catch (error) {
    console.error("Failed to fetch products:", error)
    throw error
  }
}

// ❌ Avoid
function fetchProducts() {
  return fetch("/api/products")
    .then(res => res.json())
    .catch(err => console.error(err))
}
```

## Error Handling

- Create domain-specific error types when needed
- Include context in error messages
- Log errors for debugging

```typescript
type ApiError = {
  status: number
  message: string
  code: string
}

async function createOrder(data: OrderInput): Promise<Order> {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(`${error.code}: ${error.message}`)
    }

    return response.json()
  } catch (error) {
    console.error("Order creation failed:", error)
    throw error
  }
}
```

---

See also: [docs/architecture.md](./architecture.md) for feature structure and feature-based organization.
