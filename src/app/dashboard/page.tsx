import { auth } from "@clerk/nextjs/server";
import { format, differenceInMinutes } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./_components/date-picker";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();
  const dateString = format(date, "yyyy-MM-dd");
  const workouts = await getWorkoutsForDate(userId!, date);

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Workout Dashboard</h1>

      <div className="grid grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Date</h2>
          <DatePicker dateString={dateString} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts logged for this date.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {workouts.map((workout) => {
                const duration =
                  workout.completed_at
                    ? differenceInMinutes(workout.completed_at, workout.started_at)
                    : null;
                const status = workout.completed_at ? "Completed" : "In Progress";

                return (
                  <Card key={workout.id}>
                    <CardHeader className="pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{workout.name}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {format(workout.started_at, "h:mm a")}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {status}
                        {duration !== null && ` • Duration: ${duration} min`}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
