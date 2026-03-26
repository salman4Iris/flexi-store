# UI Components — shadcn UI Standards

## Core Rule: shadcn UI Only

**All UI elements must use shadcn UI components.** Do NOT create custom UI components.

### Installation & Setup

- Install shadcn components via CLI: `npx shadcn-ui@latest add [component]`
- Installed components live in `src/components/ui/`
- Import shadcn directly; do not re-implement components
- Reference the [shadcn/ui documentation](https://ui.shadcn.com) for available components

### Import Patterns

**✅ Correct:**
```typescript
// Direct import from shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// In a component
export function LoginForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Button type="submit">Sign In</Button>
    </form>
  )
}
```

**❌ Incorrect:**
```typescript
// Custom button—use shadcn instead
export function MyButton(props) {
  return <button className="px-4 py-2 bg-blue-500">{props.children}</button>
}

// Custom wrapper—compose shadcn directly
export function FormContainer({ children }) {
  return <div className="form-wrapper">{children}</div>
}

// Re-implementing shadcn component
export function CustomCard({ children, title }) {
  return (
    <div className="border rounded-lg p-4">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

## Composition Patterns

You can compose shadcn components together, but keep them **transparent** to other code:

**✅ Acceptable — Internal Composition:**
```typescript
// Feature-specific form that composes shadcn internally
// src/features/auth/components/LoginForm.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  )
}
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
// Don try to "enhance" or wrap shadcn—compose instead
export function EnhancedButton(props) {
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

- Use **Tailwind CSS** for all styling via `className` prop
- Apply shadow, spacing, and color tokens from Tailwind
- For component-specific overrides, pass `className` to shadcn components

```typescript
import { Button } from "@/components/ui/button"

export function SpecialButton() {
  return (
    <Button className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500">
      Click Me
    </Button>
  )
}
```

## Accessibility

- Use semantic shadcn components (e.g., `<Dialog>` instead of custom modal)
- Pass ARIA attributes where needed
- Leverage shadcn's built-in a11y features (keyboard navigation, focus management)

## File Organization

Place components in appropriate directories:

```
src/components/
  ui/              # shadcn-generated components (don't edit)
  auth/            # Auth-specific components
  layouts/         # Layout scaffolding (use shadcn primitives)
  Header.tsx
  Footer.tsx

src/features/
  products/
    components/
      ProductCard.tsx    # Composes shadcn
      ProductGrid.tsx    # Composes shadcn
  cart/
    components/
      CartSummary.tsx
      CartItem.tsx
```

## Common Patterns

### Form Handling
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MyForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Modal/Dialog
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <Button>Confirm</Button>
      </DialogContent>
    </Dialog>
  )
}
```

## When to Ask for New Components

If shadcn doesn't have a component you need:
1. Check the [shadcn catalog](https://ui.shadcn.com)
2. If missing, consider a third-party library (charts, tables)
3. If no good option exists, document the exception and get team approval

---

See also: [docs/conventions.md](./conventions.md) for file naming and structure.
