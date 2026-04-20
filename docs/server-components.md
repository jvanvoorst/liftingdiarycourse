# Server Components

## CRITICAL: Params Must Be Awaited

**This project uses Next.js 15, where `params` is a Promise. It MUST be awaited before accessing any values.**

Do NOT destructure params directly — it will not work:

```tsx
// ❌ Wrong — params is a Promise in Next.js 15
export default async function Page({
  params,
}: {
  params: { workoutId: string };
}) {
  const { workoutId } = params; // runtime error
}
```

Always type `params` as a `Promise` and `await` it:

```tsx
// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
}
```

This applies to all dynamic route segments, including nested ones:

```tsx
// ✅ Correct — multiple segments
export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; workoutId: string }>;
}) {
  const { userId, workoutId } = await params;
}
```

## searchParams

The same rule applies to `searchParams` — it is also a Promise in Next.js 15:

```tsx
// ✅ Correct
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
}
```

## Summary

| Prop | Type | Required |
|------|------|----------|
| `params` | `Promise<{ [key: string]: string }>` | Must be awaited |
| `searchParams` | `Promise<{ [key: string]: string \| string[] \| undefined }>` | Must be awaited |
