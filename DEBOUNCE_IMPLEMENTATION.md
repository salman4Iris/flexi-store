# Debounce Implementation Summary

## Overview
Implemented a built-in debounce solution for the search input in the flexi-store project using a custom React hook (`useDebounce`).

## Changes Made

### 1. Created Custom Debounce Hook
**File**: [src/hooks/useDebounce.ts](src/hooks/useDebounce.ts)

A reusable TypeScript hook that debounces any value with a specified delay:

```typescript
export const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

**Features**:
- Generic TypeScript type support for any value type
- Configurable delay (default: 300ms)
- Automatic cleanup of timers
- No external dependencies (uses only React hooks)

### 2. Updated SearchBar Component
**File**: [src/components/layouts/SearchBar.tsx](src/components/layouts/SearchBar.tsx)

Integrated the debounce hook into the search input:

```typescript
// Import the debounce hook
import { useDebounce } from "@/hooks/useDebounce";

// Inside SearchBar component
const [searchQuery, setSearchQuery] = useState<string>("");
const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
const { suggestions, loading, error } = useSearchSuggestions(debouncedSearchQuery, 5);
```

### 3. How It Works

1. **Immediate Input Feedback**: The actual `searchQuery` state updates on every keypress, so the input field responds instantly to user typing
2. **Debounced API Calls**: The `debouncedSearchQuery` only updates after 300ms of no typing, reducing unnecessary API calls
3. **Prevents Excessive Requests**: By passing the debounced query to `useSearchSuggestions`, the API is called less frequently while maintaining smooth UI

### 4. Benefits

✅ **Reduces API calls** - Only calls the API after the user stops typing  
✅ **Improves performance** - Fewer network requests and processing  
✅ **Better UX** - Instant input feedback + optimized suggestions loading  
✅ **No external dependencies** - Uses React's built-in hooks only  
✅ **Reusable** - The hook can be used for any debounce scenario  
✅ **TypeScript type-safe** - Full generic type support  
✅ **Follows project standards** - Complies with ES6/TypeScript strict mode  

## Testing

Created comprehensive unit tests for the `useDebounce` hook:
- **File**: [src/hooks/useDebounce.test.ts](src/hooks/useDebounce.test.ts)
- Tests cover: initial values, debouncing, timer cancellation, custom delays, and type support

## Debounce Flow Diagram

```
User Types 'a' → searchQuery updates → timer starts (300ms)
User Types 'b' → searchQuery updates → timer resets
User Types 'c' → searchQuery updates → timer resets
User Stops → 300ms passes → debouncedSearchQuery updates → API Call
```

## Configuration

The debounce delay can be easily adjusted:
- Current default: **300ms** (in `SearchBar.tsx` and `useDebounce.ts`)
- Can be customized per use case by passing different delay values

## Compatibility

- ✅ React 18+
- ✅ Next.js 13+
- ✅ TypeScript with strict mode
- ✅ All modern browsers
