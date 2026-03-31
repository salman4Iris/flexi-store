# UI Components — shadcn UI Standards

## Core Rule: shadcn UI Only with TypeScript

**All UI elements must use shadcn UI components with explicit TypeScript types and ES6 patterns.** Do NOT create custom UI components.

### Installation & Setup

- Install shadcn components via CLI: `npx shadcn-ui@latest add [component]`
- Installed components live in `src/components/ui/`
- Import shadcn directly; do not re-implement components
- Reference the [shadcn/ui documentation](https://ui.shadcn.com) for available components
- Use arrow functions and explicit types in components (see [es6-typescript.instructions.md](./es6-typescript.instructions.md))

### Import Patterns

**✅ Correct:**
```typescript
// Direct import from shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Arrow function component with explicit return type
const LoginForm = (): React.ReactNode => {
  return (
    <form className="space-y-4">
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Button type="submit">Sign In</Button>
    </form>
  )
}

export { LoginForm }
```

**❌ Incorrect:**
```typescript
// Custom button—use shadcn instead
const MyButton = (props: any) => {
  return <button className="px-4 py-2 bg-blue-500">{props.children}</button>
}

// Custom wrapper—compose shadcn directly
const FormContainer = ({ children }) => {
  return <div className="form-wrapper">{children}</div>
}

// Re-implementing shadcn component
const CustomCard = ({ children, title }: any) => {
  return (
    <div className="border rounded-lg p-4">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

## Composition Patterns

You can compose shadcn components together, but keep them **transparent** with proper typing and ES6 patterns:

**✅ Acceptable — Internal Composition:**
```typescript
// Feature-specific form that composes shadcn internally with explicit types
// src/features/auth/components/LoginForm.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>
}

// Arrow function component with explicit return type
const LoginForm = ({ onSubmit }: LoginFormProps): React.ReactNode => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  // Arrow function handler with explicit void return
  const handleSubmit = async (): Promise<void> => {
    await onSubmit(email, password)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export { LoginForm }
```

**✅ Acceptable — Re-export for Consistency:**
```typescript
// If you want a themed alias for your project
// src/components/ui/index.ts
export { Button as PrimaryButton } from "./button"
export { Button as SecondaryButton } from "./button"
```

**❌ Avoid — Heavy Wrapper:**
```typescript
// Don't try to "enhance" or wrap shadcn—compose instead
const EnhancedButton = (props: ButtonProps): React.ReactNode => {
  return (
    <Button {...props} className={`custom-style ${props.className}`}>
      {props.loading ? <Spinner /> : props.children}
    </Button>
  )
}
```

## Third-Party Libraries

Use third-party UI libraries **only** when shadcn doesn't have the component:

**✅ Acceptable:**
- Charts: `recharts`, `chart.js`
- Data tables: `react-table` (if shadcn table is insufficient)
- Rich text editors: `react-quill`
- Advanced calendar: `react-big-calendar`

**❌ Avoid:**
- Using material-ui, chakra-ui, or other full UI libraries alongside shadcn
- Replacing shadcn components with third-party equivalents

## Styling

Use **Tailwind CSS** for all styling via `className` prop with proper organization:

```typescript
import { Button } from "@/components/ui/button"

// Arrow function component with explicit return type
const SpecialButton = (): React.ReactNode => {
  return (
    <Button className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-shadow">
      Click Me
    </Button>
  )
}

export { SpecialButton }
```

- Apply shadow, spacing, and color tokens from Tailwind
- For component-specific overrides, pass `className` to shadcn components
- Use responsive modifiers: `sm:px-4 md:px-8 lg:px-12`
- Combine classes logically using template literals when necessary

## Accessibility

- Use semantic shadcn components (e.g., `<Dialog>` instead of custom modal)
- Pass ARIA attributes where needed with proper types
- Leverage shadcn's built-in a11y features (keyboard navigation, focus management)

```typescript
// Arrow function component with explicit return type
const AccessibleButton = ({ disabled = false }: { disabled?: boolean }): React.ReactNode => {
  return (
    <Button
      disabled={disabled}
      aria-label="Submit form"
      aria-disabled={disabled}
    >
      Submit
    </Button>
  )
}

export { AccessibleButton }
```

## File Organization

Place components in appropriate directories:

```
src/components/
  ui/              # shadcn-generated components (don't edit)
  auth/            # Auth-specific components using shadcn
  layouts/         # Layout scaffolding (use shadcn primitives)
    Header.tsx     # Arrow function components
    Footer.tsx     # Arrow function components

src/features/
  products/
    components/
      ProductCard.tsx    # Composes shadcn with arrow functions
      ProductGrid.tsx    # Composes shadcn with arrow functions
  cart/
    components/
      CartSummary.tsx    # Arrow functions, explicit types
      CartItem.tsx       # Arrow functions, explicit types
```

## Common Patterns

### Form Handling with ES6
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type FormData = {
  email: string
  password: string
}

type MyFormProps = {
  onSubmit: (data: FormData) => Promise<void>
}

// Arrow function with explicit types and destructuring
const MyForm = ({ onSubmit }: MyFormProps): React.ReactNode => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState<boolean>(false)

  // Arrow function handler with nullish coalescing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev: FormData): FormData => ({
      ...prev,
      [name]: value,
    }))
  }

  // Arrow function with async/await
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}

export { MyForm }
```

### Modal/Dialog with ES6
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type ConfirmDialogProps = {
  title?: string
  message?: string
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
}

// Arrow function with explicit types and destructuring
const ConfirmDialog = ({
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Arrow function handler with async/await
  const handleConfirm = async (): Promise<void> => {
    setLoading(true)
    try {
      await Promise.resolve(onConfirm())
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  // Arrow function with nullish coalescing
  const handleCancel = (): void => {
    onCancel?.()
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{message}</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ConfirmDialog }
```

### List/Grid with Dynamic Rendering
```typescript
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

type ListItem = {
  id: string
  title: string
  description?: string
}

type DynamicListProps = {
  items: ListItem[]
  renderItem: (item: ListItem) => ReactNode
  emptyMessage?: string
}

// Arrow function with generics and proper destructuring
const DynamicList = <T extends ListItem>({
  items,
  renderItem,
  emptyMessage = "No items found",
}: DynamicListProps & { items: T[] }): React.ReactNode => {
  // Nullish coalescing for empty state
  const hasItems = (items ?? []).length > 0

  if (!hasItems) {
    return <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
  }

  // Template literal with map
  return (
    <div className="grid gap-4">
      {items.map((item: T): ReactNode => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            {renderItem(item)}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { DynamicList }
```

## When to Ask for New Components

If shadcn doesn't have a component you need:
1. Check the [shadcn catalog](https://ui.shadcn.com)
2. If missing, consider a third-party library (charts, tables)
3. If no good option exists, document the exception and get team approval

---

## ES6 & TypeScript Requirements for UI Components

✅ **Arrow functions** for all components  
✅ **Explicit types** on all component props  
✅ **Const by default** for components and values  
✅ **Destructuring** in component parameters  
✅ **No `any` types** — use proper type annotations  
✅ **Template literals** for dynamic class names  
✅ **Nullish coalescing** (`??`) for default props  
✅ **Async/await** for asynchronous operations  
✅ **Spread operator** for immutable updates  
✅ **Optional chaining** (`?.`) for safe access  

See also: [es6-typescript.instructions.md](./es6-typescript.instructions.md) for comprehensive patterns and [architecture.instructions.md](./architecture.instructions.md) for component organization.
