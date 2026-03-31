# State Management

## Overview

This project uses **React Context API** with custom hooks for global state management.

- **When to use**: Authenticated user, theme, cart, global UI state
- **When NOT to use**: Component-level UI state (use `useState` locally)
- **Location**: `src/providers/` for providers, `src/store/` for context hooks

# State Management

## Overview

This project uses **React Context API** with custom hooks for global state management following ES6/TypeScript patterns.

- **When to use**: Authenticated user, theme, cart, global UI state
- **When NOT to use**: Component-level UI state (use `useState` locally)
- **Location**: `src/providers/` for providers, `src/store/` for context hooks
- **Patterns**: Arrow functions, explicit types, async/await, useCallback for optimization

## Context Provider Pattern

Create providers in `src/providers/` with arrow functions and explicit types:

```typescript
// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

// Explicit type definitions
type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  ready: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Arrow function component with explicit return type
export const AuthProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  // Explicit type annotations for state
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Arrow function with useCallback and explicit return type
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

  // Arrow function with explicit return type
  const register = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      setLoading(true)
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        if (!response.ok) {
          throw new Error("Registration failed")
        }

        const data = (await response.json()) as { user: User }
        setUser(data.user)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Create stable value object before returning
  const value: AuthContextType = {
    user,
    ready,
    loading,
    login,
    logout,
    register,
  }

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

## Global Store Pattern (Context + Hooks)

For simpler global state without initialization, use store hooks in `src/store/` with arrow functions and explicit types:

```typescript
// src/store/cart.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

// Explicit type definitions
export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

type CartContextType = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  remove: (id: string) => void
  update: (id: string, qty: number) => void
  clear: () => void
  total: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Arrow function component with explicit return type
export const CartProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [items, setItems] = useState<CartItem[]>([])

  // Arrow function with explicit return type
  const add = useCallback((item: Omit<CartItem, "qty">, qty: number = 1): void => {
    setItems((prev: CartItem[]): CartItem[] => {
      const existing = prev.find((i: CartItem): boolean => i.id === item.id)
      if (existing) {
        return prev.map((i: CartItem): CartItem =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...item, qty }]
    })
  }, [])

  // Arrow function with explicit void return
  const remove = useCallback((id: string): void => {
    setItems((prev: CartItem[]): CartItem[] => prev.filter((i: CartItem): boolean => i.id !== id))
  }, [])

  // Arrow function with explicit return type and early return
  const update = useCallback((id: string, qty: number): void => {
    if (qty <= 0) {
      remove(id)
      return
    }
    setItems((prev: CartItem[]): CartItem[] =>
      prev.map((i: CartItem): CartItem => (i.id === id ? { ...i, qty } : i))
    )
  }, [remove])

  // Arrow function with explicit void return
  const clear = useCallback((): void => {
    setItems([])
  }, [])

  // Arrow function with explicit return type
  const total = useCallback((): number =>
    items.reduce((sum: number, item: CartItem): number => sum + item.price * item.qty, 0),
    [items]
  )

  // Create stable value object
  const value: CartContextType = { items, add, remove, update, clear, total }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook with explicit return type
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be called within CartProvider")
  }
  return ctx
}
```

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const update = (id: string, qty: number) => {
    if (qty <= 0) {
      remove(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    )
  }

  const clear = () => setItems([])

  const total = () =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be called within CartProvider")
  }
  return ctx
}
```

## Layout Integration

Wrap your app with providers in `src/app/layout.tsx` using arrow functions and proper typing:

```typescript
// src/app/layout.tsx
'use client'

import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { CartProvider } from "@/store/cart"
import type { ReactNode } from "react"

type RootLayoutProps = {
  children: ReactNode
}

// Arrow function with explicit return type
const RootLayout = ({ children }: RootLayoutProps): React.ReactNode => {
  return (
    <html>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
```

## Using Global State in Components

Always mark components with `'use client'` when using hooks, using arrow functions with explicit types:

```typescript
// src/features/cart/components/CartSummary.tsx
'use client'

import { useCart } from "@/store/cart"
import { formatPrice } from "@/utils/formatting"

// Arrow function component with explicit return type
const CartSummary = (): React.ReactNode => {
  // Destructure cart context
  const { items, total, clear } = useCart()

  // Arrow function handler with explicit void return
  const handleClear = (): void => {
    clear()
  }

  // Calculate total with nullish coalescing
  const totalAmount = total() ?? 0

  return (
    <div>
      <h2>{`Cart (${items.length} items)`}</h2>
      <p>{`Total: ${formatPrice(totalAmount)}`}</p>
      <button onClick={handleClear}>Clear Cart</button>
    </div>
  )
}

export { CartSummary }
```

## Complex State with Reducers

For complex state logic, use `useReducer` with arrow functions and explicit types:

```typescript
// src/providers/ComplexStateProvider.tsx
'use client'

import { createContext, useContext, useReducer, ReactNode } from "react"

// Explicit state type
type State = {
  user: { id: string; email: string } | null
  theme: string
  notifications: Array<{ id: string; message: string }>
  sidebar: { open: boolean }
}

// Discriminated union for actions
type Action =
  | { type: "SET_USER"; payload: { id: string; email: string } }
  | { type: "SET_THEME"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: { id: string; message: string } }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }

const initialState: State = {
  user: null,
  theme: "light",
  notifications: [],
  sidebar: { open: false },
}

// Arrow function reducer with explicit return type
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebar: { open: !state.sidebar.open },
      }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    default:
      return state
  }
}

// Context type
type ContextType = {
  state: State
  dispatch: React.Dispatch<Action>
}

const Context = createContext<ContextType | undefined>(undefined)

// Arrow function provider with explicit return type
export const ComplexStateProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

// Custom hook with explicit return type
export const useAppState = (): ContextType => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error("useAppState must be within ComplexStateProvider")
  }
  return ctx
}
```

## Local Storage Persistence

Persist state to localStorage for persistence across page reloads with proper async handling:

```typescript
// src/store/userPreferences.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

// Explicit type defin itions
type Preferences = {
  theme: "light" | "dark"
  language: string
  sidebarCollapsed: boolean
}

type ContextType = {
  preferences: Preferences | null
  updatePreferences: (prefs: Partial<Preferences>) => void
}

const Context = createContext<ContextType | undefined>(undefined)

const DEFAULT_PREFERENCES: Preferences = {
  theme: "light",
  language: "en",
  sidebarCollapsed: false,
}

const STORAGE_KEY = "user-preferences"

// Arrow function provider with explicit return type
export const PreferencesProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  // Load from localStorage on mount
  useEffect((): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const prefs = stored ? (JSON.parse(stored) as Preferences) : DEFAULT_PREFERENCES
      setPreferences(prefs)
    } catch (error) {
      console.error("Failed to load preferences:", error)
      setPreferences(DEFAULT_PREFERENCES)
    }
  }, [])

  // Arrow function with explicit return type
  const updatePreferences = useCallback((updates: Partial<Preferences>): void => {
    setPreferences((prev: Preferences | null): Preferences => {
      const newPrefs = { ...(prev ?? DEFAULT_PREFERENCES), ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs))
      } catch (error) {
        console.error("Failed to save preferences:", error)
      }
      return newPrefs
    })
  }, [])

  return (
    <Context.Provider value={{ preferences, updatePreferences }}>
      {children}
    </Context.Provider>
  )
}

// Custom hook with explicit return type
export const usePreferences = (): ContextType => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error("usePreferences must be within PreferencesProvider")
  }
  return ctx
}
```

## Best Practices

1. **Avoid over-nesting providers** — Use composition
2. **Error handling** — Check context exists in hooks with proper error messages
3. **Memoization** — Use `useCallback` for callback functions to prevent unnecessary re-renders
4. **Keep context values stable** — Create value object outside JSX
5. **Test providers** — Mock context in tests with type-safe mocks
6. **Document required providers** — Add comments explaining dependencies
7. **Use explicit types** — All context values must be explicitly typed
8. **Arrow functions** — Use arrow functions for all event handlers and callbacks
9. **Async/await** — Use async/await for asynchronous operations in providers
10. **Error narrowing** — Use `instanceof` for proper error type checking

### Example: Stable Context Value

```typescript
// ✅ Correct — stable object created before render
const AuthProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null)
  // ... other state

  // Create stable value object
  const value: AuthContextType = {
    user,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ❌ Avoid — new object every render
const AuthProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Testing Providers

Test providers with type-safe component rendering:

```typescript
// src/providers/AuthProvider.test.tsx
import { render, screen } from "@testing-library/react"
import { AuthProvider, useAuth } from "./AuthProvider"
import type { ReactNode } from "react"

// Type-safe test component using arrow function
const TestComponent = (): React.ReactNode => {
  const { user } = useAuth()
  return <div>{user ? "Logged in" : "Logged out"}</div>
}

describe("AuthProvider", () => {
  // Arrow function test with explicit void return
  it("should provide auth context", (): void => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText("Logged out")).toBeInTheDocument()
  })

  // Arrow function test checking error
  it("should throw if hook used outside provider", (): void => {
    // Error message should be clear
    expect((): void => {
      render(<TestComponent />)
    }).toThrow("useAuth must be called within AuthProvider")
  })
})
```

---

## ES6 & TypeScript Requirements for State Management

✅ **Arrow functions** for all components and callbacks  
✅ **Explicit types** on all context, state, and actions  
✅ **Const by default** for context and providers  
✅ **Async/await** for asynchronous operations  
✅ **useCallback** for memoizing callbacks  
✅ **Type narrowing** with `instanceof` for error handling  
✅ **Nullish coalescing** (`??`) for default values  
✅ **Destructuring** in provider arguments and hooks  
✅ **No `any` types** — use explicit types throughout  
✅ **Discriminated unions** for complex actions  

See also: [es6-typescript.instructions.md](./es6-typescript.instructions.md) for comprehensive patterns and [architecture.instructions.md](./architecture.instructions.md) for provider setup and feature structure.
