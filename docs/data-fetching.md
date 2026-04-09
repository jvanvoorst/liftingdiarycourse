# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching in this app MUST be done via Server Components.**

Do NOT fetch data via:
- Route handlers (`/api/*`)
- Client components (`"use client"`)
- Any other mechanism

This is non-negotiable. Every piece of data must be fetched in a Server Component and passed down as props if needed by client components.

## Database Queries via /data Directory

All database queries MUST be done via helper functions in the `/data` directory.

Rules:
- **Always use Drizzle ORM** — never write raw SQL
- Every helper function must accept a `userId` parameter and scope queries to that user
- A logged-in user must **only** ever be able to access their own data

### Example

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

Then in a Server Component:

```tsx
// app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkouts(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Where to fetch data | Server Components only |
| How to query the DB | Drizzle ORM via `/data` helpers |
| Raw SQL | Never |
| Data access scope | Current user's data only |
