# ES6 & TypeScript Coding Standards

## TypeScript Fundamentals

### Strict Mode Configuration
- **Required**: `strict: true` in `tsconfig.json`
- **No implicit `any`**: Every value must have an explicit type
- **No implicit returns**: All functions must explicitly declare return types
- **Full type checking**: Enable all strict checks

```typescript
// ✅ Correct - Explicit types and return types
const getUserName = (user: User): string => {
  return user.name
}

// ❌ Avoid - Implicit any, missing return type
const getUserName = (user) => {
  return user.name  // return type inferred but explicit is better
}
```

### Type Definitions & Annotations

**Always use explicit types:**

```typescript
// ✅ Correct - Type definitions
type User = {
  id: string
  email: string
  name: string
  isActive: boolean
}

type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

// ✅ Correct - Function with explicit return type
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ Correct - Arrow function component with return type
const UserCard = (props: UserCardProps): React.ReactNode => {
  return <div>{props.name}</div>
}
```

**Type Naming Convention:**
- Use `PascalCase` for all type names
- Use `-Type` or `-Props` suffix for clarity: `ProductProps`, `UserType`
- Avoid `any` — use `unknown` with type narrowing if needed

```typescript
// ✅ Correct
export type ProductProps = {
  id: string
  name: string
  price: number
}

// ✅ Correct - Unknown with type narrowing
const processData = (value: unknown): string => {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  return String(value)
}

// ❌ Avoid
type AnyData = {
  [key: string]: any  // ❌ Uses any
}

const getData = (input: any): any => {  // ❌ any everywhere
  return input
}
```

---

## Modern ES6 Syntax Patterns

### 1. Arrow Functions
All regular functions should use arrow syntax:

```typescript
// ✅ Correct - Arrow function with explicit return type
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Correct - React component as arrow function
const ProductCard = (props: ProductProps): React.ReactNode => {
  return <div>{props.title}</div>
}

// ❌ Avoid - Regular function declaration
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Avoid - Unnamed function
export default function ProductCard() {
  return <div>Product</div>
}
```

### 2. Const Over Let/Var
Default to `const`, only use `let` for reassignment:

```typescript
// ✅ Correct
const user = { name: "Alice", age: 30 }
const items: Item[] = []
const [count, setCount] = useState<number>(0)

// ⚠️ Only when reassignment is necessary
let timer: NodeJS.Timeout | null = null
if (condition) {
  timer = setInterval(() => {}, 1000)
}

// ❌ Avoid - var is deprecated
var user = { name: "Alice" }
var items = []
```

### 3. Template Literals
Use template literals instead of string concatenation:

```typescript
// ✅ Correct - Template literals
const message = `Welcome ${name}, you are ${age} years old`
const apiUrl = `${API_BASE_URL}/users/${userId}`

// ❌ Avoid - String concatenation
const message = "Welcome " + name + ", you are " + age + " years old"
const apiUrl = API_BASE_URL + "/users/" + userId
```

### 4. Destructuring
Use destructuring for cleaner code:

```typescript
// ✅ Correct - Object destructuring
const { name, email, phone } = user
const { data, status } = response
const [firstName, lastName] = fullName.split(" ")

// ✅ Correct - Function parameter destructuring
const displayUser = ({ name, email }: UserProps): void => {
  console.log(`${name} - ${email}`)
}

// ✅ Correct - Nested destructuring
const { user: { profile: { avatar } } } = response

// ❌ Avoid - Accessing properties directly
const name = user.name
const email = user.email
const phone = user.phone
```

### 5. Spread Operator
Use spread operator for arrays and objects:

```typescript
// ✅ Correct - Array spread
const newItems = [...items, newItem]
const mergedItems = [...items, ...otherItems]

// ✅ Correct - Object spread (create immutable updates)
const updatedUser = { ...user, email: "new@example.com" }
const config = { ...defaultConfig, ...userSettings }

// ✅ Correct - Rest parameters
const sum = (...numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0)
}

// ❌ Avoid - Manual array pushing
const items = [1, 2, 3]
items.push(4)

// ❌ Avoid - Object.assign
const updatedUser = Object.assign({}, user, { email: "new@example.com" })
```

### 6. Object Shorthand
Use ES6 shorthand for object properties:

```typescript
// ✅ Correct - Shorthand properties
const user = { name, email, phone }
const config = { name: "app", version: APP_VERSION, items }

// ✅ Correct - Method shorthand
const obj = {
  name: "Product",
  getName(): string {
    return this.name
  },
}

// ❌ Avoid - Verbose syntax
const user = { name: name, email: email, phone: phone }
const obj = {
  getName: function() {
    return this.name
  },
}
```

---

## Async/Await & Promises

### Async/Await Required
Use `async/await` exclusively over `.then()` chains:

```typescript
// ✅ Correct - Async/await pattern
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("/api/products")
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch products:", error)
    throw error
  }
}

// ✅ Correct - Async handler with void
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  try {
    await submitForm(data)
  } catch (error) {
    console.error("Submission failed:", error)
  }
}

// ❌ Avoid - Promise chains
const fetchProducts = () => {
  return fetch("/api/products")
    .then(res => res.json())
    .catch(err => console.error(err))
}

// ❌ Avoid - Void without type safety
const handleSubmit = async (e) => {
  await submitForm(data)
}
```

### Error Handling
Always handle errors with try/catch:

```typescript
// ✅ Correct - Try/catch/finally
const processPayment = async (amount: number): Promise<void> => {
  let transaction = null
  try {
    transaction = await createTransaction(amount)
    await submitPayment(transaction)
  } catch (error) {
    if (error instanceof PaymentError) {
      console.error(`Payment failed: ${error.code}`)
    } else {
      console.error("Unknown error:", error)
    }
    throw error
  } finally {
    if (transaction) {
      await logTransaction(transaction)
    }
  }
}

// ❌ Avoid - Unhandled errors
const processPayment = async (amount: number) => {
  const transaction = await createTransaction(amount)
  return await submitPayment(transaction)
}
```

---

## Modern Operators

### Nullish Coalescing (`??`)
Use `??` instead of `||` for checking null/undefined:

```typescript
// ✅ Correct - Nullish coalescing
const count = userInput ?? 0  // Only defaults if null/undefined
const theme = savedTheme ?? "light"

// ⚠️ Only use || when checking falsy values
const isEmpty = input || true  // Accepts 0, empty string as false

// ❌ Avoid - Using || for null/undefined
const count = userInput || 0  // Converts 0 to default
const theme = savedTheme || "light"  // Converts "" to "light"
```

### Optional Chaining (`?.`)
Use optional chaining for safe property access:

```typescript
// ✅ Correct - Optional chaining
const userName = user?.profile?.name
const itemCount = response?.data?.[0]?.items?.length
const callback = props?.onClose?.()

// ❌ Avoid - Nested conditionals
const userName = user && user.profile && user.profile.name
const itemCount = response && response.data && response.data[0] && response.data[0].items && response.data[0].items.length
```

### Logical Assignment
Use logical assignment operators for concise conditionals:

```typescript
// ✅ Correct - Logical assignment
let x = null
x ??= 10  // Assign only if null/undefined

let config = {}
config.timeout ??= 5000

// ✅ Correct - Logical AND/OR assignment
let settings = {}
settings ||= getDefaultSettings()
settings &&= validateSettings(settings)

// ❌ Avoid - Long ternary chains
const value = x !== null && x !== undefined ? x : 10
```

---

## Type Safety Patterns

### Explicit Return Types
Every function must have an explicit return type:

```typescript
// ✅ Correct - All return types specified
const getRender = (): React.ReactNode => <div>Hello</div>
const handleClick = (): void => { console.log("clicked") }
const getData = async (): Promise<Data> => { return fetch(...) }
const getUsers = (): User[] => [...]
const getConfig = (): Record<string, string> => ({})

// ❌ Avoid - Implicit return types
const getRender = () => <div>Hello</div>
const handleClick = () => { console.log("clicked") }
const getData = async () => { return fetch(...) }
```

### Union Types & Type Guards
Use union types with proper type narrowing:

```typescript
// ✅ Correct - Union type with type guard
type Result = Success | Error

const processResult = (result: Result): string => {
  if ("data" in result) {
    return result.data
  }
  return `Error: ${result.message}`
}

// ✅ Correct - TypeScript discriminated union
type Response = 
  | { status: "success"; data: any }
  | { status: "error"; error: string }

const handleResponse = (resp: Response): void => {
  if (resp.status === "success") {
    console.log(resp.data)
  } else {
    console.error(resp.error)
  }
}
```

### Generics for Reusability
Use TypeScript generics for flexible, type-safe code:

```typescript
// ✅ Correct - Generic function
const getOrDefault = <T,>(value: T | null, defaultValue: T): T => {
  return value ?? defaultValue
}

// ✅ Correct - Generic component
type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

const List = <T,>({ items, renderItem }: ListProps<T>): React.ReactNode => {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>
}
```

---

## React & TypeScript

### React Components
All React components must be typed arrow functions:

```typescript
// ✅ Correct - Typed React component
type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

const Button = ({ label, onClick, disabled = false }: ButtonProps): React.ReactNode => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// ✅ Correct - With children
type CardProps = {
  title: string
  children: React.ReactNode
}

const Card = ({ title, children }: CardProps): React.ReactNode => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

// ❌ Avoid - Function declaration
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>
}

// ❌ Avoid - Implicit props type
const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

### Hooks with Proper Types
All hooks must have explicit type annotations:

```typescript
// ✅ Correct - Typed useState
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])

// ✅ Correct - Typed useEffect cleanup
const useInterval = (callback: () => void, delay: number): void => {
  useEffect(() => {
    const id = setInterval(callback, delay)
    return (): void => clearInterval(id)  // Cleanup with explicit void
  }, [callback, delay])
}

// ✅ Correct - Custom hook with return type
const useFetch = <T,>(url: string): { data: T | null; loading: boolean; error: Error | null } => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(url)
        setData(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [url])

  return { data, loading, error }
}

// ❌ Avoid - Untyped useState
const [count, setCount] = useState(0)  // Type inferred, not explicit
```

---

## Imports

### Import Organization
Follow this import order:

1. External libraries (React, Next.js, etc.)
2. Internal modules (from `@/`)
3. Type imports (use `import type` when only importing types)

```typescript
// ✅ Correct - Organized imports
import React, { useState, useEffect } from "react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks"
import type { User } from "@/features/auth/types"
import { formatPrice } from "@/utils/formatting"

// ❌ Avoid - Mixed order
import { formatPrice } from "@/utils/formatting"
import React from "react"
import type { User } from "@/features/auth/types"
import { useAuth } from "@/features/auth/hooks"
```

### Type Imports
Use `import type` for type-only imports to improve build performance:

```typescript
// ✅ Correct - Type imports
import type { User, Product } from "@/types"
import type { ReactNode } from "react"

// ✅ Correct - Mixed imports when needed
import React, { useState } from "react"
import type { FC } from "react"

// ❌ Avoid - Importing types as regular values
import { User, Product } from "@/types"  // If only used as types
```

---

## Comments & Documentation

### JSDoc for Functions
Use JSDoc for function documentation:

```typescript
// ✅ Correct - JSDoc comments
/**
 * Formats a number as currency using the specified locale.
 * @param value - The numeric value to format
 * @param currency - ISO 4217 currency code (default: "INR")
 * @returns Formatted currency string
 * @example
 * formatPrice(1000, "INR") // "₹1,000.00"
 */
export const formatPrice = (value: number, currency = "INR"): string => {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value)
}

// ✅ Correct - Single line comments for clarity
const CACHE_DURATION = 5 * 60 * 1000  // 5 minutes

// ❌ Avoid - Obvious comments
const name = user.name  // Get the user name
```

---

## Common Patterns

### Immutable Updates
Always create new objects/arrays instead of mutating:

```typescript
// ✅ Correct - Immutable updates
const updateUser = (user: User, changes: Partial<User>): User => {
  return { ...user, ...changes }
}

const addItem = (items: Item[], item: Item): Item[] => {
  return [...items, item]
}

const removeItem = (items: Item[], id: string): Item[] => {
  return items.filter(item => item.id !== id)
}

// ❌ Avoid - Mutating
user.email = "new@example.com"
items.push(newItem)
items.splice(index, 1)
```

### Type Guards
Implement proper type guards:

```typescript
// ✅ Correct - Type predicate
const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    typeof obj.id === "string"
  )
}

// ✅ Correct - Error checking
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
```

---

## Configuration Reference

### TypeScript Config (tsconfig.json)
Ensure these settings are enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esNext": "ES2020",
    "module": "ESNext"
  }
}
```

### ESLint Rules for ES6/TypeScript
Key ESLint rules enforced:

- `prefer-const`: Enforce `const` over `let`/`var`
- `prefer-arrow-callback`: Use arrow functions in callbacks
- `prefer-template`: Use template literals
- `prefer-destructuring`: Encourage destructuring
- `no-var`: Disallow `var` keyword
- `@typescript-eslint/explicit-function-return-types`: Require function return types
- `@typescript-eslint/no-explicit-any`: Disallow `any` type
- `@typescript-eslint/prefer-nullish-coalescing`: Use `??` over `||`
- `@typescript-eslint/prefer-optional-chain`: Use `?.` over conditionals

---

## Checklist Before Committing

- [ ] All functions have explicit return type annotations
- [ ] No `any` types without justification
- [ ] Using `const` by default, `let` only when necessary
- [ ] Arrow functions for all function definitions
- [ ] Async/await instead of `.then()` chains
- [ ] Proper try/catch error handling
- [ ] Using `??` and `?.` operators appropriately
- [ ] Destructuring used where beneficial
- [ ] Template literals for string interpolation
- [ ] Type-safe React components with proper props typing
- [ ] ESLint: `npm run lint` passes
- [ ] Tests: `npm test` passes

---

**Reference**: See also [code-style.instructions.md](./code-style.instructions.md) for naming conventions and file organization.
