# API Routes Standards

## Overview

API routes are implemented using Next.js App Router in `src/app/api/` with strict TypeScript and ES6 patterns.

- **Route files**: `route.ts` (must be named exactly this)
- **HTTP methods**: Named exports as `async` arrow functions with explicit return types
- **Type safety**: Use TypeScript with `NextRequest` / `NextResponse` and explicit type annotations
- **ES6 Patterns**: Arrow functions, async/await, destructuring, nullish coalescing

## Route Structure

```
src/app/api/
  products/
    route.ts                    # /api/products (GET, POST)
    [slug]/
      route.ts                  # /api/products/[slug] (GET, PUT, DELETE)
  orders/
    route.ts                    # /api/orders (GET, POST)
    [id]/
      route.ts
  auth/
    login/
      route.ts                  # /api/auth/login (POST)
    register/
      route.ts                  # /api/auth/register (POST)
    logout/
      route.ts                  # /api/auth/logout (POST)
```

## Basic Route Pattern

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import type { Product, ProductInput } from "@/features/products/types/product"

// GET /api/products - Arrow function with explicit return type
export const GET = async (request: NextRequest): Promise<NextResponse<Product[]>> => {
  try {
    // Destructure URL and query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ?? "10"

    // Fetch from database (implement your DB call)
    const products: Product[] = [] // Replace with real data

    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Arrow function with explicit return type
export const POST = async (request: NextRequest): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const input: ProductInput = await request.json()

    // Validate input with destructuring
    const { name, price } = input
    if (!name || !price) {
      return NextResponse.json(
        { error: "Missing required fields: name, price" },
        { status: 400 }
      )
    }

    // Create product (implement your DB call)
    const product: Product = {
      id: "new-id",
      ...input,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product"
    console.error(message, error)
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
```

## Dynamic Routes

Use `[param]` segment for dynamic routes:

```typescript
// src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import type { Product } from "@/features/products/types/product"

type RouteParams = {
  params: { slug: string }
}

// GET /api/products/[slug] - Arrow function with explicit return type
export const GET = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const { slug } = params

    // Fetch product by slug (implement your DB call)
    const product: Product | null = null // Replace with real data

    // Optional chaining and nullish check
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT /api/products/[slug] - Arrow function with explicit return type
export const PUT = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const { slug } = params
    const updates = (await request.json()) as Partial<Product>

    // Update product (implement your DB call)
    const product: Product = {} as Product // Replace with real data

    return NextResponse.json(product)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// DELETE /api/products/[slug] - Arrow function with explicit return type
export const DELETE = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean } | { error: string }>> => {
  try {
    const { slug } = params

    // Delete product (implement your DB call)

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

## Query Parameters

Extract and validate query parameters from the request URL:

```typescript
// Arrow function with explicit return type and proper type narrowing
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url)

  // Get single parameter with nullish coalescing
  const category = searchParams.get("category") // null if not present
  const limit = searchParams.get("limit") ?? "10"

  // Get array of values (for filters[]=a&filters[]=b)
  const filters = searchParams.getAll("filter")

  // Check if parameter exists
  const sort = searchParams.has("sort") ? searchParams.get("sort") : null

  return NextResponse.json({ category, limit, filters, sort })
}

// Usage: GET /api/products?category=electronics&limit=20&filter=new&filter=sale
```

## Request Body Parsing

```typescript
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file")

    // Parse text
    const text = await request.text()
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
```

## Response Patterns

### Success Responses

```typescript
// 200 OK (default)
return NextResponse.json({ data: value })

// 201 Created
return NextResponse.json({ id: "new-id" }, { status: 201 })

// 204 No Content
return new NextResponse(null, { status: 204 })
```

### Error Responses

```typescript
// 400 Bad Request
return NextResponse.json(
  { error: "Validation failed", details: errors },
  { status: 400 }
)

// 401 Unauthorized
return NextResponse.json(
  { error: "Authentication required" },
  { status: 401 }
)

// 403 Forbidden
return NextResponse.json(
  { error: "Access denied" },
  { status: 403 }
)

// 404 Not Found
return NextResponse.json(
  { error: "Resource not found" },
  { status: 404 }
)

// 500 Internal Server Error
return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
)
```

## Authentication & Middleware

Use middleware or guards for protected routes:

```typescript
// src/app/api/orders/route.ts
import { verifyAuth } from "@/services/auth"

async function requireAuth(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    throw new Error("Unauthorized")
  }

  const user = await verifyAuth(token)
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const orders = [] // Fetch user's orders

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const input = await request.json()

    // Create order for user...

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}
```

## CORS & Headers

Set response headers as needed:

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: "value" })

  // Add CORS headers if needed
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")

  // Add cache headers
  response.headers.set("Cache-Control", "public, max-age=3600")

  return response
}
```

## Error Handling

Always use try/catch with proper type narrowing and async/await patterns:

```typescript
// Arrow function with explicit return type and comprehensive error handling
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const data = (await request.json()) as { email?: string }

    // Validate with destructuring
    const { email } = data
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Process...
    return NextResponse.json({ success: true })
  } catch (error) {
    // Type narrowing for proper error handling
    if (error instanceof SyntaxError) {
      // JSON parse error
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : "Internal server error"
    console.error(`API error: ${message}`, error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
```

## Type-Safe Route Handlers

Always type route parameters and request/response bodies with explicit return types:

```typescript
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { Product, ProductInput } from "@/features/products/types/product"

type RouteParams = {
  params: { slug: string }
}

// Arrow function with explicit return type—no implicit 'any'
export const GET = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const { slug } = params
    const product: Product = {} as Product // Fetch...
    
    if (!product) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Not found"
    return NextResponse.json(
      { error: message },
      { status: 404 }
    )
  }
}

// Arrow function with explicit return type
export const PUT = async (
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product | { error: string }>> => {
  try {
    const { slug } = params
    const updates = (await request.json()) as Partial<ProductInput>
    const product: Product = {} as Product // Update...
    return NextResponse.json(product)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request"
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
```

## Testing API Routes

```typescript
// src/app/api/products/route.test.ts
import { GET, POST } from "./route"
import { NextRequest } from "next/server"

describe("GET /api/products", () => {
  it("should return products", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/products"))
    const response = await GET(request)
    const data = (await response.json()) as unknown[]

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it("should handle errors gracefully", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/products"))
    // Mock error scenario
    const response = await GET(request)
    
    expect(response.status).toBeGreaterThanOrEqual(200)
  })
})
```

---

## ES6 & TypeScript Best Practices for API Routes

✅ **Always use arrow functions** as named exports  
✅ **Explicit return types** on all route handlers  
✅ **Type narrowing** with `instanceof` for error handling  
✅ **Nullish coalescing** (`??`) for default values  
✅ **Destructuring** for extracting params and body data  
✅ **Async/await** for all async operations  
✅ **Avoid `any` types** — use proper type annotations  

See also: [es6-typescript.instructions.md](./es6-typescript.instructions.md), [architecture.instructions.md](./architecture.instructions.md) for service patterns, and [Next.js API Routes documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
