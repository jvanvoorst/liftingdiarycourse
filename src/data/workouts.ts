import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function insertWorkout(input: {
  userId: string;
  name: string;
  startedAt: Date;
}) {
  return db.insert(workouts).values({
    user_id: input.userId,
    name: input.name,
    started_at: input.startedAt,
  });
}

export async function getWorkoutsForDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.user_id, userId),
        gte(workouts.started_at, start),
        lt(workouts.started_at, end)
      )
    );
}
