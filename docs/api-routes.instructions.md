# API Routes Standards

## Overview

API routes are implemented using Next.js App Router in `src/app/api/`.

- **Route files**: `route.ts` (must be named exactly this)
- **HTTP methods**: Named exports `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- **Type safety**: Use TypeScript with `NextRequest` / `NextResponse`

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

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    // Optional: Extract query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")

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

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const input: ProductInput = await request.json()

    // Validate input
    if (!input.name || !input.price) {
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
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
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

type RouteParams = {
  params: { slug: string }
}

// GET /api/products/[slug]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    // Fetch product by slug (implement your DB call)
    const product = {} // Replace with real data

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/products/[slug]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params
    const updates = await request.json()

    // Update product (implement your DB call)
    const product = {} // Replace with real data

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 400 })
  }
}

// DELETE /api/products/[slug]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    // Delete product (implement your DB call)

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
```

## Query Parameters

Extract and validate query parameters from the request URL:

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Get single parameter
  const category = searchParams.get("category")  // null if not present
  const limit = searchParams.get("limit") || "10"

  // Get array of values (for filters[]=a&filters[]=b)
  const filters = searchParams.getAll("filter")

  // Check if parameter exists
  if (searchParams.has("sort")) {
    const sort = searchParams.get("sort")
  }

  return NextResponse.json({ category, limit, filters })
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

Always use try/catch and return appropriate status codes:

```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate
    if (!data.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Process...

  } catch (error) {
    if (error instanceof SyntaxError) {
      // JSON parse error
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      )
    }

    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Type-Safe Route Handlers

Always type route parameters and request/response bodies:

```typescript
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { Product, ProductInput } from "@/features/products/types/product"

type RouteParams = {
  params: { slug: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product>> {
  try {
    const product: Product = {} // Fetch...
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Not found" } as any,
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Product>> {
  try {
    const updates: Partial<ProductInput> = await request.json()
    const product: Product = {} // Update...
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" } as any,
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
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeInstanceOf(Array)
  })
})
```

---

See also: [docs/architecture.instructions.md](./architecture.instructions.md) for service patterns and [Next.js API Routes documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
