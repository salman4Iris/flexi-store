# State Management

## Overview

This project uses **React Context API** with custom hooks for global state management.

- **When to use**: Authenticated user, theme, cart, global UI state
- **When NOT to use**: Component-level UI state (use `useState` locally)
- **Location**: `src/providers/` for providers, `src/store/` for context hooks

## Context Provider Pattern

Create providers in `src/providers/` with clear, reusable patterns:

```typescript
// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) throw new Error("Registration failed")

      const data = await res.json()
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use context
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be called within AuthProvider")
  }
  return ctx
}
```

## Global Store Pattern (Context + Hooks)

For simpler global state without initialization, use store hooks in `src/store/`:

```typescript
// src/store/cart.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from "react"

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...item, qty }]
    })
  }

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

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be called within CartProvider")
  }
  return ctx
}
```

## Layout Integration

Wrap your app with providers in `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { CartProvider } from "@/store/cart"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
```

## Using Global State in Components

Always mark components with `'use client'` when using hooks:

```typescript
// src/features/cart/components/CartSummary.tsx
'use client'

import { useCart } from "@/store/cart"
import { formatPrice } from "@/utils/formatting"

export function CartSummary() {
  const { items, total, clear } = useCart()

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <p>Total: {formatPrice(total())}</p>
      <button onClick={clear}>Clear Cart</button>
    </div>
  )
}
```

## Complex State with Reducers

For complex state logic, use `useReducer` instead of multiple `useState`:

```typescript
// src/providers/ComplexStateProvider.tsx
'use client'

import { createContext, useContext, useReducer, ReactNode } from "react"

type State = {
  user: any
  theme: string
  notifications: any[]
  sidebar: { open: boolean }
}

type Action =
  | { type: "SET_USER"; payload: any }
  | { type: "SET_THEME"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: any }
  | { type: "TOGGLE_SIDEBAR" }

const initialState: State = {
  user: null,
  theme: "light",
  notifications: [],
  sidebar: { open: false },
}

function reducer(state: State, action: Action): State {
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
    default:
      return state
  }
}

type ContextType = {
  state: State
  dispatch: React.Dispatch<Action>
}

const Context = createContext<ContextType | undefined>(undefined)

export function ComplexStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export function useAppState(): ContextType {
  const ctx = useContext(Context)
  if (!ctx) throw new Error("useAppState must be within ComplexStateProvider")
  return ctx
}
```

## Local Storage Persistence

Persist state to localStorage for persistence across page reloads:

```typescript
// src/store/userPreferences.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

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

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("preferences")
    setPreferences(stored ? JSON.parse(stored) : DEFAULT_PREFERENCES)
  }, [])

  // Save to localStorage on changes
  const updatePreferences = (updates: Partial<Preferences>) => {
    const newPrefs = { ...preferences, ...updates }
    setPreferences(newPrefs)
    localStorage.setItem("preferences", JSON.stringify(newPrefs))
  }

  return (
    <Context.Provider value={{ preferences, updatePreferences }}>
      {children}
    </Context.Provider>
  )
}

export function usePreferences(): ContextType {
  const ctx = useContext(Context)
  if (!ctx) throw new Error("usePreferences must be within PreferencesProvider")
  return ctx
}
```

## Best Practices

1. **Avoid over-nesting providers** — Use composition
2. **Error handling** — Check context exists in hooks
3. **Memoization** — Use `useCallback` for callbacks to prevent re-renders
4. **Keep context values stable** — Avoid creating new objects in render
5. **Test providers** — Mock context in tests
6. **Document required providers** — Add comments explaining dependencies

### Example: Stable Context Value

```typescript
// ✅ Correct — stable object
const value = {
  user,
  theme,
  login,
  logout,
}

return <Context.Provider value={value}>{children}</Context.Provider>

// ❌ Avoid — new object every render
return (
  <Context.Provider value={{ user, theme, login, logout }}>
    {children}
  </Context.Provider>
)
```

## Testing Providers

```typescript
// src/providers/AuthProvider.test.tsx
import { render, screen } from "@testing-library/react"
import { AuthProvider, useAuth } from "./AuthProvider"

function TestComponent() {
  const { user, login } = useAuth()
  return <div>{user ? "Logged in" : "Logged out"}</div>
}

describe("AuthProvider", () => {
  it("should provide auth context", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText("Logged out")).toBeInTheDocument()
  })

  it("should throw if hook used outside provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be called within AuthProvider"
    )
  })
})
```

---

See also: [docs/architecture.instructions.md](./architecture.instructions.md) for provider setup and feature structure.
