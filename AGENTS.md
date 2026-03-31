# flexi-store Agent Guidelines

⚠️ **CRITICAL: READ INSTRUCTION FILES BEFORE CODING** ⚠️

**ALWAYS read the relevant individual instruction files in the `/docs` directory BEFORE generating ANY CODE.** This is not optional. Each feature area has specific standards that MUST be followed. Failure to read these files first will result in code that violates project standards.

LLM agents working on this project must adhere to the coding standards defined in this folder. Each standard is documented in a separate instruction file. Reference the appropriate file based on your task.

---

## 📱 Project Overview

**flexi-store** is a responsive ecommerce web application built with Next.js, React, TypeScript, and Tailwind CSS. The application provides a complete online shopping experience with the following key pages and features:

- **Home Page** - Landing page showcasing featured products and store information
- **Products Page** - Browse all available products with filtering and search
- **Product Details Page** - Detailed view of individual products with specifications
- **Category Page** - Browse products organized by category
- **Cart Page** - Manage items in the shopping cart
- **Checkout Page** - Multi-step checkout process
- **Payment Page** - Secure payment processing
- **Order Page** - Order history and tracking
- **Authentication** - User registration and login system

All UI components use **shadcn UI exclusively** styled with **Tailwind CSS**. The application follows feature-based architecture with strict TypeScript typing and comprehensive testing.

---

## Quick Reference

| Topic | File | Key Rules |
|-------|------|-----------|
| **ES6 & TypeScript** | [es6-typescript.instructions.md](./docs/es6-typescript.instructions.md) | Arrow functions, explicit types, async/await, no `any`, strict mode |
| **UI Components** | [ui-components.instructions.md](./docs/ui-components.instructions.md) | Use shadcn UI exclusively; no custom components |
| **Code Style** | [code-style.instructions.md](./docs/code-style.instructions.md) | TypeScript strict mode, PascalCase components, camelCase functions |
| **Architecture** | [architecture.instructions.md](./docs/architecture.instructions.md) | Feature-based organization; components, hooks, services, types per feature |
| **Testing** | [testing.instructions.md](./docs/testing.instructions.md) | Jest; test files colocated; >80% coverage goal |
| **API Routes** | [api-routes.instructions.md](./docs/api-routes.instructions.md) | Next.js App Router; `route.ts` files with HTTP method exports |
| **State Management** | [state-management.instructions.md](./docs/state-management.instructions.md) | React Context API; providers in `src/providers/`; hooks in `src/store/` |

---

## Core Standards at a Glance

### UI Components — shadcn UI + Tailwind CSS Only 🚫 NO CUSTOM UI
**ALL UI elements MUST use shadcn UI components with Tailwind CSS.** This is non-negotiable.

- ✅ Import and compose shadcn directly
- ✅ Style with Tailwind CSS utilities (`className="...`)
- ❌ NO custom Button, Input, Card, Dialog, or any UI component shadcn provides
- ❌ NO custom styled components or CSS modules for UI
- ❌ NO inline styles for component styling

### Code Style
- **Strict TypeScript**: No `any` types; always annotate return types
- **PascalCase**: Components and types (`ProductCard`, `UserProps`)
- **camelCase**: Functions, hooks, variables, utilities
- **Feature-based**: Organize code by feature in `src/features/`

### Architecture
```
src/features/products/
  components/        # Feature UI components
  hooks/            # Feature hooks (useProducts, useProduct)
  services/         # API calls
  types/            # Type definitions
```

### Testing
- Test files colocated with source: `Component.test.tsx`
- Jest with TypeScript support
- Command: `npm test`

### API Routes
- Live in `src/app/api/[resource]/route.ts`
- Export HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Use `NextRequest` and `NextResponse` for type safety

### State Management
- **Providers**: Global state in `src/providers/AuthProvider.tsx`
- **Stores**: Simpler state in `src/store/cart.tsx`
- **Custom hooks**: Always check context exists before using

---

## Before You Start

1. **🔴 READ THE RELEVANT INSTRUCTION FILE FIRST** — Before writing any code, consult the appropriate file from the Quick Reference table above. Each instruction file contains critical requirements, patterns, and examples specific to that feature area.
2. **🔴 USE SHADCN UI + TAILWIND CSS** — ALL UI components MUST come from shadcn UI. Style everything with Tailwind CSS. No exceptions. No custom UI components.
3. **Check existing examples** in the codebase to understand patterns
4. **Follow TypeScript strict mode** — no exceptions
5. **Run linter before committing**: `npm run lint`
6. **Validate tests pass**: `npm test`

## Build & Test Commands

```bash
npm run dev     # Start development server
npm test        # Run tests
npm run build   # Build for production
npm run lint    # Run ESLint
```

---

See the appropriate instruction file for detailed standards and examples.
