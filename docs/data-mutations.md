# Data Mutations

## CRITICAL: Server Actions Only

**ALL data mutations in this app MUST be done via Server Actions.**

Do NOT mutate data via:
- Route handlers (`/api/*`)
- Client-side fetch/axios calls
- Any other mechanism

## Server Action File Conventions

Server actions must live in colocated `actions.ts` files, placed alongside the route or component they serve.

```
src/app/dashboard/actions.ts       ✅
src/app/workouts/[id]/actions.ts   ✅
src/lib/actions.ts                 ❌ (not colocated)
```

Every `actions.ts` file must have `"use server"` at the top.

## Typed Parameters — No FormData

Server action parameters must be explicitly typed. **Never use `FormData` as a parameter type.**

```ts
// ✅ Correct
export async function createWorkout(input: CreateWorkoutInput) { ... }

// ❌ Wrong
export async function createWorkout(formData: FormData) { ... }
```

## Zod Validation

**ALL server actions MUST validate their arguments with Zod** before performing any logic or DB calls.

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.date(),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkout(input: CreateWorkoutInput) {
  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  await insertWorkout({ userId: session.user.id, ...parsed.data });
}
```

## Database Mutations via /data Directory

All DB writes MUST go through helper functions in the `src/data` directory that wrap Drizzle ORM calls. Server actions must never call Drizzle directly.

Rules:
- **Always use Drizzle ORM** — never write raw SQL
- Every helper function must accept a `userId` parameter and scope mutations to that user
- A logged-in user must **only** ever be able to mutate their own data

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function insertWorkout(input: {
  userId: string;
  name: string;
  date: Date;
}) {
  return db.insert(workouts).values(input);
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

Then in a server action:

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { insertWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.date(),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkout(input: CreateWorkoutInput) {
  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const session = await auth();

  await insertWorkout({ userId: session.user.id, ...parsed.data });
}
```

## Redirects

**Never call `redirect()` inside a server action.**

Redirects must be handled client-side after the server action resolves:

```ts
// ✅ Correct — redirect in the client component
async function handleSubmit() {
  await createWorkout(input);
  router.push("/dashboard");
}

// ❌ Wrong — redirect inside the server action
export async function createWorkout(input: CreateWorkoutInput) {
  await insertWorkout(...);
  redirect("/dashboard"); // never do this
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Where to mutate data | Server Actions only |
| Server action file location | Colocated `actions.ts` files |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod on every server action |
| How to write to the DB | Drizzle ORM via `src/data` helpers |
| Raw SQL | Never |
| Data access scope | Current user's data only |
