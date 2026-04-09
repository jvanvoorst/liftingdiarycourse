import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
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
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <DatePicker dateString={dateString} />
      </div>

      <h2 className="text-lg font-semibold mb-4">
        Workouts for {format(date, "do MMM yyyy")}
      </h2>

      {workouts.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged for this date.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {format(workout.started_at, "do MMM yyyy")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
