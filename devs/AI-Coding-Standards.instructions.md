---
applyTo: '**'
---

# AI Agent Coding Instructions

**PRIMARY DIRECTIVE: Write code that any developer can understand immediately. Prioritize clarity over cleverness.**

## Decision Framework (in order of priority)

1. **Does it work correctly?** - Functionality first
2. **Is it readable?** - Clear variable names, simple logic flow
3. **Does it preserve existing behavior?** - Don't break what works
4. **Is it minimal?** - Smallest change that achieves the goal

## Code Style Rules

### Syntax & Structure
- Use 2-space indentation consistently
- Break lines at 80-100 characters at logical points
- Use double quotes for strings (unless escaping needed)
- Always add explicit TypeScript types for function parameters and returns
- Use `const` for variables that won't be reassigned

### Naming & Organization
- Use descriptive names: `userSettings` not `usrSets`
- Functions should do one thing with clear names
- Group related code with blank lines
- Keep components under 150 lines

### Logic Patterns
- Use if/else blocks instead of nested ternary operators
- Prefer array methods (map, filter, reduce) over for loops
- Write pure functions that don't mutate inputs
- Use destructuring for cleaner object access

## Preservation Rules (NEVER violate without explicit request)

- **UI Text**: Don't change button labels, error messages, placeholders
- **APIs**: Preserve component prop names and interfaces
- **Styling**: Keep existing CSS class names
- **Structure**: Maintain file and folder names

## Change Guidelines

### When to Create vs Modify
- **Modify existing**: For similar functionality or bug fixes
- **Create new**: Only when files exceed 300 lines or mix unrelated concerns
- **Extract components**: When logic is reused or component becomes complex

### Dependencies & Tools
- Use existing project dependencies first
- Only add new packages when existing tools can't solve the problem
- Extract reusable logic into custom hooks instead of duplicating

## Technology-Specific Rules

### React
- Functional components with hooks only
- API calls go in custom hooks, not components
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive calculations

### TypeScript
- Interfaces for object shapes, types for unions/primitives
- Define prop interfaces above components that use them
- Type assertions (`as Type`) only when inference fails

### Comments
- Block comments: Capital letter, explain "why" not "what"
- Inline comments: Lowercase, brief
- JSDoc for complex functions and component props
- Plain language only - no emojis or fancy punctuation
