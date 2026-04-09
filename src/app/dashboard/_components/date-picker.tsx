"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  dateString: string;
}

export function DatePicker({ dateString }: DatePickerProps) {
  const router = useRouter();

  const date = new Date(`${dateString}T00:00:00`);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const param = format(d, "yyyy-MM-dd");
    router.push(`/dashboard?date=${param}`);
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      className="rounded-lg border"
    />
  );
}
