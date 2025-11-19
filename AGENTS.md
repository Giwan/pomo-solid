# Agent Guidelines

This document outlines the coding standards, architectural patterns, and behavioral expectations for AI agents working on this codebase.

## Core Principles

1.  **Clean Code First**: Prioritize readability and maintainability. Code should be self-documenting.
2.  **SolidJS Reactivity**: Embrace fine-grained reactivity. Understand how Signals, Memos, and Effects work.
3.  **Type Safety**: 
 - Use TypeScript to its fullest. Avoid `any`. Define interfaces and types explicitly.
 - Put type info in a separate file (e.g., `types.d.ts`)
4.  **Component Modularity**: Break down complex UIs into small, reusable, single-responsibility components.
5.  **DRY**: Do not repeat yourself. Extract common patterns into reusable functions or components.
6.  **Single Responsibility**: Each component should have a single responsibility. Avoid complex logic in components.
7.  **Consistency**: Maintain consistent naming and styling conventions.
8.  **Performance**: Optimize performance by using fine-grained reactivity and memoization.
9.  **Testing**: Write unit tests for your components and functions.

## Coding Standards

### SolidJS Best Practices
-   **Reactivity**:
    -   Use `createSignal` for local state.
    -   Use `createMemo` for derived state to prevent unnecessary recalculations.
    -   **Do not destructure props** if you need to maintain reactivity. Access them directly (e.g., `props.value`) or use `mergeProps`.
    -   Remember: Solid components run once. Effects and computed values run many times.
-   **Control Flow**:
    -   Use Solid's control flow components (`<Show>`, `<For>`, `<Switch>`, `<Match>`) instead of JavaScript array maps or ternary operators for conditional rendering.
    -   Example: `<Show when={isLoading()}>...</Show>` instead of `{isLoading() && ...}`.
-   **Naming**:
    -   Components: PascalCase (e.g., `TimerDisplay.tsx`)
    -   Signals: camelCase (e.g., `[count, setCount]`)
    -   Derived State: camelCase (e.g., `doubleCount`) - note: access as function `doubleCount()`.

### CSS & Styling
-   **Aesthetic**: "Teenage Engineering" / Industrial Minimalist.
    -   Sharp edges, high contrast, technical typography.
    -   Orange/Red accents on neutral backgrounds.
    -   Full responsiveness.
-   **Implementation**:
    -   Use CSS variables for theming (colors, spacing).
    -   Avoid inline styles; prefer CSS classes.
    -   Keep `App.css` or component-specific CSS files organized.

### File Structure
-   **`src/components`**: Reusable UI components.
-   **`src/hooks`**: Custom SolidJS hooks (primitives).
-   **`src/utils`**: Pure utility functions.
-   **`src/types`**: Shared TypeScript definitions.

## Workflow
-   **Refactoring**: Apply the "Boy Scout Rule": leave the code cleaner than you found it.
-   **Clean Up**: Remove unused imports, dead code, and `console.log` statements before finishing.
-   **Comments**: Comment *why*, not *what*.

## Specific Instructions for this Project
-   **State Management**: Keep state local or lift it up to a common ancestor using props or Context if strictly necessary.
-   **Performance**: Solid is performant by default, but avoid creating signals inside effects or render loops.
