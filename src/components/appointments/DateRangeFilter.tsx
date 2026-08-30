"use client";

import { DatePickerWithRange } from "@/components/ui/date-picker";
import { useRouter, useSearchParams } from "next/navigation";
import { dayjs } from "@/lib/date";
import { DateRange } from "react-day-picker";

export default function DateRangeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromISO = searchParams.get("from");
  const toISO = searchParams.get("to");

  const initialRange: DateRange = {
    from: fromISO ? new Date(fromISO) : undefined,
    to: toISO ? new Date(toISO) : undefined,
  };

  function updateRange(range: DateRange | undefined) {
    const params = new URLSearchParams(searchParams);

    if (range?.from) {
      params.set("from", dayjs(range.from).startOf("day").toISOString());
    } else {
      params.delete("from");
    }

    if (range?.to) {
      params.set("to", dayjs(range.to).endOf("day").toISOString());
    } else {
      params.delete("to");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="max-w-xs">
      <DatePickerWithRange
        initialDate={initialRange}
        onUpdate={updateRange}
      />
    </div>
  );
}
