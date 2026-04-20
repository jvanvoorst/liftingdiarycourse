"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string(),
  name: z.string().min(1),
  startedAt: z.coerce.date(),
});

type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;

export async function editWorkout(input: UpdateWorkoutInput) {
  const parsed = updateWorkoutSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateWorkout(parsed.data.workoutId, userId, {
    name: parsed.data.name,
    startedAt: parsed.data.startedAt,
  });
}
