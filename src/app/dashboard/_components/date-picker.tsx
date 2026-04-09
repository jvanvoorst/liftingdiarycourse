"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  dateString: string;
}

export function DatePicker({ dateString }: DatePickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const date = new Date(`${dateString}T00:00:00`);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const param = format(d, "yyyy-MM-dd");
    setOpen(false);
    router.push(`/dashboard?date=${param}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex h-9 w-[200px] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground">
        <CalendarIcon className="h-4 w-4" />
        {format(date, "do MMM yyyy")}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
