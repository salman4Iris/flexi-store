# Architecture & Project Structure

## Feature-Based Organization

This project uses **feature-based organization** — code is grouped by feature/domain, not by type.

### Feature Structure

Each feature lives in `src/features/[feature-name]/` with a consistent structure:

```
src/features/products/
  components/              # React components specific to this feature
    ProductCard.tsx
    ProductGrid.tsx
    ProductDetails.tsx
  hooks/                   # Custom hooks for this feature
    useProduct.ts          # Hook: get single product
    useProducts.ts         # Hook: get all products
    useProductFilter.ts    # Hook: filter/search logic
  services/                # API calls and external data
    products.ts            # Fetch, create, update, delete products
  types/                   # Type definitions for this feature
    product.ts             # export type Product, ProductInput, etc.
```

### Shared Code Organization

Code shared across features lives in shorter paths:

```
src/
  components/
    ui/                    # shadcn components (auto-generated)
    layouts/               # Layout scaffold (Navbar, Footer)
    auth/                  # Auth-specific shared components
  features/                # Feature-specific folders
  providers/               # Context providers (AuthProvider, ThemeProvider)
  store/                   # Global state (cart context, etc.)
  services/                # Cross-feature services (API utilities)
  types/                   # Global types
  utils/                   # Pure utility functions
```

### Why Feature-Based?

- **Scalability**: Easy to add/remove features without breaking others
- **Locality of behavior**: All code for a feature lives together
- **Clear boundaries**: Each feature owns its types, hooks, and services
- **Team ownership**: Each team can own a feature

## Component Patterns

### Page Components

Live in `src/app/[path]/page.tsx`, handle routing and layout with explicit return types:

```typescript
// src/app/products/page.tsx
'use client'

import { useProducts } from "@/features/products/hooks/useProducts"
import { ProductGrid } from "@/features/products/components/ProductGrid"

// Arrow function with explicit return type
const ProductsPage = (): React.ReactNode => {
  const { products, loading, error } = useProducts()

  // Use nullish coalescing and early returns
  if (loading) return <div>Loading...</div>
  if (error) return <div>{`Error: ${error}`}</div>

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductGrid products={products} />
    </main>
  )
}

export default ProductsPage
```

### Feature Components

Live in `src/features/[feature]/components/`, handle rendering and feature logic with proper typing:

```typescript
// src/features/products/components/ProductCard.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/features/products/types/product"

// Explicit props type
export type ProductCardProps = {
  product: Product
  onAddToCart: (id: string) => void
}

// Arrow function component with explicit return type
const ProductCard = ({ product, onAddToCart }: ProductCardProps): React.ReactNode => {
  const { id, name, price } = product
  
  // Arrow function handler with explicit void return
  const handleAddClick = (): void => {
    onAddToCart(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{`$${price}`}</p>
        <Button onClick={handleAddClick}>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}

export { ProductCard }
```

### Shared Layout Components

Live in `src/components/layouts/`, wrapping pages with explicit return types:

```typescript
// src/components/layouts/Navbar.tsx
'use client'

import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"

// Arrow function with explicit return type
const Navbar = (): React.ReactNode => {
  const { user, logout } = useAuth()

  // Arrow function handler with explicit void return
  const handleLogout = (): void => {
    void logout()  // Use void operator for non-awaited async calls
  }

  return (
    <nav className="border-b">
      <Link href="/">Home</Link>
      {user ? (
        <>
          <Link href="/cart">Cart</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </nav>
  )
}

export { Navbar }
```

## Hooks Pattern

### Feature Hooks

Live in `src/features/[feature]/hooks/`, use services to fetch data with proper async/await and type safety:

```typescript
// src/features/products/hooks/useProducts.ts
'use client'

import { useEffect, useState } from "react"
import { getProducts } from "@/features/products/services/products"
import type { Product } from "@/features/products/types/product"

// Define hook return type explicitly
type UseProductsReturn = {
  products: Product[]
  loading: boolean
  error: string | null
}

// Arrow function hook with explicit return type
const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Arrow function with async/await and proper error handling
    const load = async (): Promise<void> => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        // Type narrowing for error messages
        const message = err instanceof Error ? err.message : "Failed to load products"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void load()  // Use void operator for non-awaited promises
  }, [])

  return { products, loading, error }
}

export { useProducts }
```

## Services Pattern

### Feature Services

Live in `src/features/[feature]/services/`, handle API calls using async/await with explicit return types:

```typescript
// src/features/products/services/products.ts
import type { Product, ProductInput } from "@/features/products/types/product"

// Arrow function with explicit return type and async/await
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products")
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  return response.json()
}

// Arrow function with typed parameters and return type
export const getProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }
  return response.json()
}

// Arrow function with spread operator and proper typing
export const createProduct = async (input: ProductInput): Promise<Product> => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`)
  }
  return response.json()
}
```

## Types Pattern

### Feature Types

Live in `src/features/[feature]/types/`, define domain models with explicit type definitions:

```typescript
// src/features/products/types/product.ts

// Main domain type
export type Product = {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  createdAt: string
}

// Input type using Omit for immutability
export type ProductInput = Omit<Product, "id" | "createdAt">

// Filter type for query parameters
export type ProductFilter = {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

// Response wrapper type for API responses
export type ProductResponse = {
  data: Product
  status: number
  message: string
}
```

## API Routes Pattern

### Structure

Live in `src/app/api/[resource]/route.ts`, follow RESTful conventions with ES6/TypeScript:

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import type { Product, ProductInput } from "@/features/products/types/product"

// Arrow function with explicit return type
const GET = async (request: NextRequest): Promise<NextResponse<Product[]>> => {
  try {
    // Destructuring URL parameters with nullish coalescing
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ?? "10"
    
    // Fetch from database
    const products: Product[] = [] // Replace with real DB call
    return NextResponse.json(products)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: message } as any,
      { status: 500 }
    )
  }
}

// Arrow function with explicit return type for POST
export const POST = async (
  request: NextRequest
): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const input = (await request.json()) as ProductInput
    // Validate and create
    const product: Product = {} as Product // Replace with real creation
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create"
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
```

### Nested Routes

```
src/app/api/
  products/
    route.ts              # GET /api/products, POST /api/products
    [slug]/
      route.ts            # GET /api/products/[slug], PUT, DELETE
  orders/
    route.ts
    [id]/
      route.ts
  auth/
    login/
      route.ts
    register/
      route.ts
```

## State & Context

Global state uses React Context API with custom hooks and proper ES6/TypeScript patterns:

```typescript
// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

// Define context types explicitly
type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  ready: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Arrow function with explicit return type
export const AuthProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  // Arrow function with explicit return type and proper async/await
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = (await response.json()) as { user: User }
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }, [])

  // Arrow function with explicit void return
  const logout = useCallback((): void => {
    setUser(null)
  }, [])

  const value = { user, ready, loading, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook with explicit return type and error checking
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be called within AuthProvider")
  }
  return ctx
}
```

## Import Aliases

Use `@/` alias for absolute imports from `src/` with consistent patterns:

```typescript
// ✅ Correct - Arrow functions with absolute imports
import type { Product } from "@/features/products/types"
import { ProductCard } from "@/features/products/components/ProductCard"
import { useProducts } from "@/features/products/hooks/useProducts"
import { getProducts } from "@/features/products/services/products"
import { formatPrice } from "@/utils/formatting"

// Arrow function using imports
const Products = (): React.ReactNode => {
  const { products } = useProducts()
  
  return (
    <div>
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
      ))}
    </div>
  )
}

// ❌ Avoid
import { ProductCard } from "../../../../features/products/components/ProductCard"
import * as products from "@/features/products"
```

---

## ES6 & TypeScript Requirements

✅ **Arrow functions** for all function definitions  
✅ **Explicit return types** on all functions  
✅ **Const by default** — only `let` when reassignment needed  
✅ **Async/await** for all asynchronous operations  
✅ **Type narrowing** with `instanceof` for error handling  
✅ **Nullish coalescing** (`??`) for default values  
✅ **Destructuring** for parameters and object access  
✅ **Template literals** instead of string concatenation  
✅ **No `any` types** — use explicit types or `unknown` with type guards  

See also: [es6-typescript.instructions.md](./es6-typescript.instructions.md) for comprehensive patterns and [code-style.instructions.md](./code-style.instructions.md) for naming conventions and file organization per type.
