# Routing

## Structure

**All routes in this app are accessed via `/dashboard`.**

- The root `/` route is not a user-facing page. Redirect unauthenticated users to sign-in, authenticated users to `/dashboard`.
- All app pages live under `/dashboard` or its sub-routes (e.g. `/dashboard/workout/[workoutId]`).

```
src/app/
├── dashboard/
│   ├── layout.tsx          # Dashboard shell layout
│   ├── page.tsx            # /dashboard — main app page
│   └── workout/
│       └── [workoutId]/
│           └── page.tsx    # /dashboard/workout/:workoutId
```

## Route Protection

**All `/dashboard` routes are protected and require a logged-in user.**

Route protection is handled exclusively via **Next.js middleware** (`middleware.ts` at the project root) using Clerk. Do NOT implement route protection inside individual page components or layouts.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

## Rules

- **Never** protect routes inside `page.tsx` or `layout.tsx` — middleware is the single enforcement point.
- **Never** create routes outside of `/dashboard` for authenticated app content.
- Do NOT use the `/api` directory for page routing — it is reserved for API route handlers only (if ever needed).
- Dynamic segments (e.g. `[workoutId]`) must validate that the requested resource belongs to the current user before rendering (see `data-fetching.md`).

## Summary

| Concern | Standard |
|---------|----------|
| All app routes | Under `/dashboard` |
| Route protection mechanism | Next.js middleware (`middleware.ts`) |
| Auth provider for protection | Clerk (`clerkMiddleware`) |
| Per-page auth checks | Never — middleware handles it |
| Resource ownership validation | In the `/data` helper, scoped by `userId` |
