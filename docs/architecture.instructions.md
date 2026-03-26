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

Live in `src/app/[path]/page.tsx`, handle routing and layout:

```typescript
// src/app/products/page.tsx
'use client'

import { useProducts } from "@/features/products/hooks/useProducts"
import { ProductGrid } from "@/features/products/components/ProductGrid"

export default function ProductsPage() {
  const { products, loading, error } = useProducts()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductGrid products={products} />
    </main>
  )
}
```

### Feature Components

Live in `src/features/[feature]/components/`, handle rendering and feature logic:

```typescript
// src/features/products/components/ProductCard.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/features/products/types/product"

export type ProductCardProps = {
  product: Product
  onAddToCart: (id: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">${product.price}</p>
        <Button onClick={() => onAddToCart(product.id)}>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}
```

### Shared Layout Components

Live in `src/components/layouts/`, wrapping pages:

```typescript
// src/components/layouts/Navbar.tsx
'use client'

import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b">
      <Link href="/">Home</Link>
      {user ? (
        <>
          <Link href="/cart">Cart</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </nav>
  )
}
```

## Hooks Pattern

### Feature Hooks

Live in `src/features/[feature]/hooks/`, use services to fetch data:

```typescript
// src/features/products/hooks/useProducts.ts
'use client'

import { useEffect, useState } from "react"
import { getProducts } from "@/features/products/services/products"
import type { Product } from "@/features/products/types/product"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { products, loading, error }
}
```

## Services Pattern

### Feature Services

Live in `src/features/[feature]/services/`, handle API calls:

```typescript
// src/features/products/services/products.ts
import type { Product, ProductInput } from "@/features/products/types/product"

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products")
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error("Failed to fetch product")
  return res.json()
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("Failed to create product")
  return res.json()
}
```

## Types Pattern

### Feature Types

Live in `src/features/[feature]/types/`, define domain models:

```typescript
// src/features/products/types/product.ts
export type Product = {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  createdAt: string
}

export type ProductInput = Omit<Product, "id" | "createdAt">

export type ProductFilter = {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
```

## API Routes Pattern

### Structure

Live in `src/app/api/[resource]/route.ts`, follow RESTful conventions:

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import type { Product, ProductInput } from "@/features/products/types/product"

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    // Fetch from database
    const products: Product[] = [] // Replace with real DB call
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const input: ProductInput = await request.json()
    // Validate and create
    const product: Product = {} as Product // Replace with real creation
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
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

Global state uses React Context API with custom hooks.

```typescript
// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from "react"

type AuthContextType = {
  user: { id: string; email: string } | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  ready: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Implementation...

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be called within AuthProvider")
  return ctx
}
```

## Import Aliases

- Use `@/` alias for absolute imports from `src/`
- Configured in `tsconfig.json` and `next.config.ts`

```typescript
// ✅ Correct
import { ProductCard } from "@/features/products/components/ProductCard"
import { useProducts } from "@/features/products/hooks/useProducts"
import { getProducts } from "@/features/products/services/products"
import type { Product } from "@/features/products/types/product"

// ❌ Avoid
import { ProductCard } from "../../../../features/products/components/ProductCard"
```

---

See also: [docs/code-style.instructions.md](./code-style.instructions.md) for naming conventions and file organization per type.
