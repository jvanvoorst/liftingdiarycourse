# UI Coding Standards

## Component Library

**ONLY shadcn/ui components are permitted in this project.**

- Do NOT create custom UI components under any circumstances.
- Do NOT use raw HTML elements styled with Tailwind as standalone components.
- Every UI element (buttons, inputs, dialogs, cards, tables, etc.) must come from the shadcn/ui library.
- If a required component does not yet exist in the project, add it via the shadcn CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```

## Date Formatting

All dates must be formatted using `date-fns`. No other date formatting libraries or manual formatting are allowed.

### Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

This is: ordinal day + abbreviated month (3 letters, capitalised) + 4-digit year.

### Implementation

Use `format` from `date-fns` with the token `do MMM yyyy`:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
```
