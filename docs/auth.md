# Authentication

## Provider

**This app uses Clerk for all authentication.**

- Do NOT use NextAuth, custom JWT logic, or any other auth library.
- Do NOT implement your own session management.
- All auth must go through Clerk's official SDK and helpers.

## Getting the Current User

### In Server Components

Use `auth()` from `@clerk/nextjs/server` to get the current user's ID:

```ts
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    // handle unauthenticated state
  }

  // pass userId to data helpers
}
```

### In Client Components

Use the `useAuth()` or `useUser()` hooks from `@clerk/nextjs`:

```ts
import { useAuth } from "@clerk/nextjs";

export function MyClientComponent() {
  const { userId } = useAuth();
}
```

## Protecting Routes

Use Clerk's middleware to protect routes. Route protection is configured in `middleware.ts` at the project root.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

## Rules

- **Never** access the database without a `userId` from Clerk.
- **Never** trust client-supplied user IDs — always derive `userId` from `auth()` on the server.
- All `/data` helper functions must accept and scope queries to a `userId` obtained via Clerk (see `data-fetching.md`).
- Do NOT expose Clerk secret keys in client code. Use only the publishable key on the client.

## Summary

| Concern | Solution |
|---------|----------|
| Auth provider | Clerk |
| Server-side user ID | `auth()` from `@clerk/nextjs/server` |
| Client-side user ID | `useAuth()` from `@clerk/nextjs` |
| Route protection | Clerk middleware in `middleware.ts` |
| Raw auth logic | Never |
