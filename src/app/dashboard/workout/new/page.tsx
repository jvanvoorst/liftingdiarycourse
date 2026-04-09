import { NewWorkoutForm } from "./_components/new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">New Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
